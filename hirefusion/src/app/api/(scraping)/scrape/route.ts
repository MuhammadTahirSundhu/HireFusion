import { NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer';
import { JobModel } from '@/models/User'; // Ensure this path is correct
import dbConnect from '@/lib/dbConnect';
import PQueue from 'p-queue';

interface JobDetails {
  job_title: string;
  company_name: string;
  job_location: string;
  job_type: string;
  salary?: string;
  apply_link?: string;
  skills_required: string[];
  description: string;
  job_link: string;
}

// Predefined computer science job titles and locations
const JOB_TITLES = [
  'Software Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'AI Research Scientist',
  'Database Administrator',
  'Mobile App Developer',
];
const LOCATIONS = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
  'Denver, CO',
  'Work From Home',
];
const PAGES_PER_COMBINATION = 2; // Scrape 2 pages per job title and location
const MAX_CONCURRENT = 5; // Max concurrent Puppeteer tasks

// Check internet connection
async function checkInternetConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}

// Utility to introduce random delay
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Random user agent to reduce bot detection
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Scrape job details for a single job URL
async function scrapeJobDetails(page: Page, jobUrl: string, index: number, retries = 3, debug = true): Promise<JobDetails | null> {
  const jobDetails: JobDetails = {
    job_title: '',
    company_name: '',
    job_location: 'Remote',
    job_type: 'Unknown',
    salary: undefined,
    apply_link: undefined,
    skills_required: [],
    description: '',
    job_link: jobUrl,
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      await Promise.race([
        page.waitForSelector('h1, [class*="title"], [class*="job-title"], [data-testid*="title"]', { timeout: 15000 }),
        page.waitForResponse(response => response.url().includes('job') && response.status() === 200, { timeout: 15000 }),
      ]);

      const tryFindText = async (selectors: string[], field: string): Promise<string> => {
        for (const selector of selectors) {
          try {
            const elem = await page.$(selector);
            if (elem) {
              const text = await elem.evaluate(el => el.textContent?.trim() || '');
              if (text) return text;
            }
          } catch {}
        }
        if (debug) console.warn(`[!] No matching selector for ${field} in ${jobUrl}`);
        return '';
      };

      const tryFindAllText = async (selectors: string[], field: string): Promise<string[]> => {
        for (const selector of selectors) {
          try {
            const elems = await page.$$(selector);
            const texts: string[] = [];
            for (const elem of elems) {
              const text = await elem.evaluate(el => el.textContent?.trim() || '');
              if (text) texts.push(text);
            }
            if (texts.length > 0) return texts;
          } catch {}
        }
        if (debug) console.warn(`[!] No matching selector for ${field} in ${jobUrl}`);
        return [];
      };

      jobDetails.job_title = await tryFindText(
        ['h1[class*="job-title"]', '[data-testid*="JobTitle"]', '.job-title', 'h1', '[class*="title"]'],
        'job_title'
      );
      jobDetails.company_name = await tryFindText(
        ['[data-testid*="CompanyName"]', '.company-name', '[class*="company"]', 'a[href*="/company/"]', 'span[class*="company"]'],
        'company_name'
      );
      jobDetails.job_location = await tryFindText(
        ['[data-testid*="Location"]', '.job-location', '[class*="location"]', 'span[class*="city"]', 'div[class*="location"]', '[class*="remote"]'],
        'job_location'
      ) || 'Remote';
      jobDetails.job_type = await tryFindText(
        ['[data-testid*="JobType"]', '.job-type', '[class*="type"]', 'span[class*="type"]', 'div[class*="employment"]', '[class*="full-time"]', '[class*="part-time"]', '[class*="contract"]'],
        'job_type'
      ) || 'Unknown';
      jobDetails.description = await tryFindText(
        ['[data-testid*="Description"]', '.job-description', '[class*="description"]', 'div[class*="details"]', 'section[class*="about"]'],
        'description'
      );
      jobDetails.salary = await tryFindText(
        ['[data-testid*="Compensation"]', '.salary', '[class*="salary"]', '[class*="compensation"]'],
        'salary'
      ) || undefined;
      const applyLink = await page.$('[data-testid*="ApplyButton"], .apply-button, [class*="apply"] a, a[href*="apply"]');
      if (applyLink) {
        const href = await applyLink.evaluate(el => el.getAttribute('href') || '');
        jobDetails.apply_link = href || undefined;
      }
      jobDetails.skills_required = await tryFindAllText(
        ['[data-testid*="Qualification"]', '.qualifications li', '[class*="skills"] li', '[class*="requirements"] li'],
        'skills_required'
      );

      const missingFields = [];
      if (!jobDetails.job_title) missingFields.push('job_title');
      if (!jobDetails.company_name) missingFields.push('company_name');
      if (!jobDetails.description) missingFields.push('description');

      if (missingFields.length > 0) {
        console.warn(`[!] Missing fields for ${jobUrl}: ${missingFields.join(', ')}`);
      }

      console.log(`[DEBUG] Scraped data for ${jobUrl}:`, {
        job_title: jobDetails.job_title,
        company_name: jobDetails.company_name,
        job_location: jobDetails.job_location,
        job_type: jobDetails.job_type,
        description: jobDetails.description.slice(0, 100) + '...',
      });

      if (debug && missingFields.length > 0) {
        const content = await page.content();
        console.log(`[!] Page content for ${jobUrl}:\n${content.slice(0, 500)}...`);
      }

      return jobDetails;
    } catch (e) {
      console.error(`[!] Attempt ${attempt + 1} failed for ${jobUrl}: ${e}`);
      if (attempt === retries - 1) {
        if (debug) {
          const content = await page.content();
          console.log(`[!] Page content for ${jobUrl}:\n${content.slice(0, 500)}...`);
        }
        return null;
      }
      await sleep(1000 + Math.random() * 2000);
    }
  }

  return null;
}

// Main scraping function
async function scrapeSimplyHired(): Promise<JobDetails[]> {
  await dbConnect();

  if (!(await checkInternetConnection())) {
    console.error('[!] No internet connection detected');
    return [];
  }

  const allJobs: JobDetails[] = [];

  // Iterate through each job title and location combination
  for (const jobTitle of JOB_TITLES) {
    for (const location of LOCATIONS) {
      console.log(`[+] Scraping ${jobTitle} in ${location}`);
      const jobData: JobDetails[] = [];
      const scrapedLinks = new Set<string>();
      let totalPagesScraped = 0;
      const jobsPerPage: number[] = [];

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-dev-shm-usage',
        ],
        defaultViewport: { width: 1280, height: 720 },
      });

      try {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setUserAgent(getRandomUserAgent());
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        });

        // Scrape exactly 2 pages
        const baseUrl = `https://www.simplyhired.com/search?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`;
        for (let currentPage = 1; currentPage <= PAGES_PER_COMBINATION; currentPage++) {
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const url = currentPage === 1 ? baseUrl : `${baseUrl}&pn=${currentPage}`;
              await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
              await page.waitForSelector('[data-testid="searchSerpJob"], .jobposting, .SerpJob, [class*="job-card"], [class*="job-listing"]', {
                timeout: 10000,
              });
              break;
            } catch (e) {
              console.error(`[!] Page ${currentPage} attempt ${attempt + 1} failed for ${jobTitle} in ${location}: ${e}`);
              if (attempt === 2) {
                console.error(`[!] Page ${currentPage}: All attempts failed, skipping page`);
                break;
              }
              await sleep(1000 + Math.random() * 2000);
            }
          }

          const content = await page.content();
          if (content.toLowerCase().includes('captcha') || content.toLowerCase().includes('blocked')) {
            console.error(`[!] Page ${currentPage}: CAPTCHA or block detected for ${jobTitle} in ${location}. Skipping.`);
            break;
          }

          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await sleep(1000 + Math.random() * 1000);

          const jobCards = await page.$$('[data-testid="searchSerpJob"], .jobposting, .SerpJob, [class*="job-card"], [class*="job-listing"]');
          console.log(`[+] Found ${jobCards.length} job cards on page ${currentPage} for ${jobTitle} in ${location}`);
          let pageJobCount = 0;

          for (let i = 0; i < jobCards.length; i++) {
            const job = jobCards[i];
            try {
              const titleLink = await job.$('[data-testid="searchSerpJobTitle"] a, .jobposting-title a, .SerpJob-title a, [class*="title"] a');
              let jobUrl = titleLink ? await titleLink.evaluate(el => el.getAttribute('href') || '') : null;
              if (jobUrl && !jobUrl.startsWith('http')) {
                jobUrl = `https://www.simplyhired.com${jobUrl}`;
              }
              if (jobUrl && !scrapedLinks.has(jobUrl)) {
                scrapedLinks.add(jobUrl);
                jobData.push({ job_link: jobUrl } as JobDetails);
                pageJobCount++;
              }
            } catch {
              continue;
            }
          }

          jobsPerPage.push(pageJobCount);
          totalPagesScraped++;
          await sleep(2000 + Math.random() * 2000);
        }

        await page.close();

        // Scrape job details and save to database
        const queue = new PQueue({ concurrency: MAX_CONCURRENT });
        const detailedJobs: JobDetails[] = [];

        const tasks = jobData.map((jobEntry, index) =>
          queue.add(async () => {
            const detailPage = await context.newPage();
            await detailPage.setUserAgent(getRandomUserAgent());
            try {
              const jobDetails = await scrapeJobDetails(detailPage, jobEntry.job_link, index + 1, 3, true);
              if (!jobDetails) return null;

              // Save to database
              try {
                const existingJob = await JobModel.findOne({ job_link: jobDetails.job_link });
                if (!existingJob) {
                  const newJob = new JobModel({
                    job_title: jobDetails.job_title || 'Unknown',
                    company_name: jobDetails.company_name || 'Unknown',
                    job_location: jobDetails.job_location,
                    job_type: jobDetails.job_type,
                    salary: jobDetails.salary,
                    apply_link: jobDetails.apply_link,
                    skills_required: jobDetails.skills_required,
                    description: jobDetails.description || 'No description available',
                    job_link: jobDetails.job_link,
                  });
                  await newJob.save();
                  console.log(`[+] Saved job ${jobDetails.job_title || 'Unknown'} to database for ${jobTitle} in ${location}`);
                } else {
                  await JobModel.updateOne(
                    { job_link: jobDetails.job_link },
                    {
                      $set: {
                        job_title: jobDetails.job_title || 'Unknown',
                        company_name: jobDetails.company_name || 'Unknown',
                        job_location: jobDetails.job_location,
                        job_type: jobDetails.job_type,
                        salary: jobDetails.salary,
                        apply_link: jobDetails.apply_link,
                        skills_required: jobDetails.skills_required,
                        description: jobDetails.description || 'No description available',
                        updatedAt: new Date(),
                      },
                    }
                  );
                  console.log(`[+] Updated job ${jobDetails.job_title || 'Unknown'} in database for ${jobTitle} in ${location}`);
                }
                return jobDetails;
              } catch (dbError: any) {
                console.error(`[!] Error saving job ${jobDetails.job_link} to database: ${dbError.message}`);
                return null;
              }
            } finally {
              await detailPage.close();
            }
          })
        );

        const results = await Promise.all(tasks);
        detailedJobs.push(...results.filter((job): job is JobDetails => job !== null));
        allJobs.push(...detailedJobs);

        const avgJobsPerPage = jobsPerPage.length > 0 ? jobsPerPage.reduce((a, b) => a + b, 0) / jobsPerPage.length : 0;
        console.log(
          `[+] Completed ${jobTitle} in ${location}: ${detailedJobs.length} jobs saved from ${totalPagesScraped} pages, avg ${avgJobsPerPage.toFixed(2)} jobs per page`
        );

      } catch (e: any) {
        console.error(`[!] Error processing ${jobTitle} in ${location}: ${e.message}`);
      } finally {
        await browser.close();
      }

      // Delay between combinations to avoid rate limiting
      await sleep(5000 + Math.random() * 5000);
    }
  }

  return allJobs;
}

// API Route Handler
export async function GET() {
  try {
    const jobs = await scrapeSimplyHired();
    return NextResponse.json({ jobs, message: `Scraped ${jobs.length} jobs across all combinations` });
  } catch (error: any) {
    console.error('Scraping error:', error.message);
    return NextResponse.json({ error: 'Failed to scrape jobs', details: error.message }, { status: 500 });
  }
}