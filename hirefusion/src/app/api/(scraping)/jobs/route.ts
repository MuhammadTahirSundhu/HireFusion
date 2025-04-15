import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface Job {
  title: string | null;
  company: string | null;
  location: string | null;
  'job-type': string | null;
  summary: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle');
  const location = searchParams.get('location');
  const numPages = parseInt(searchParams.get('pages') || '1', 2);

  if (!jobTitle || !location) {
    return NextResponse.json(
      { error: 'Missing required query parameters: jobTitle or location' },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // Set to true if running on server
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    const jobs: Job[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const searchUrl = `https://www.simplyhired.com/search?q=${encodeURIComponent(
        jobTitle
      )}&l=${encodeURIComponent(location)}${pageNum > 1 ? `&pn=${pageNum}` : ''}`;

      console.log(`Navigating to page ${pageNum}: ${searchUrl}`);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Match Python's sleep(2)

      const jobsOnPage: Job[] = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('[data-testid="searchSerpJob"]');
        const scrapedJobs: Job[] = [];

        jobCards.forEach((card) => {
          let title = null;
          let company = null;
          let location = null;
          let jobType = null;
          let summary = null;

          try {
            title = card.querySelector('[data-testid="searchSerpJobTitle"]')?.textContent ?? null;
          } catch {}
          try {
            company = card.querySelector('[data-testid="companyName"]')?.textContent ?? null;
          } catch {}
          try {
            location = card.querySelector('[data-testid="searchSerpJobLocation"]')?.textContent ?? null;
            jobType = location?.toLowerCase().includes('remote') ? 'Remote' : 'Physical';
            if (location?.toLowerCase().includes('remote')) {
              location = '-';
            }
          } catch {}
          try {
            summary = card.querySelector('[data-testid="searchSerpJobSnippet"]')?.textContent ?? null;
          } catch {}

          scrapedJobs.push({
            title,
            company,
            location,
            'job-type': jobType,
            summary,
          });
        });

        return scrapedJobs;
      });

      console.log(`[+] Page ${pageNum}: Found ${jobsOnPage.length} job(s)`);
      jobs.push(...jobsOnPage);
    }

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Scraping error:', error.message);
    return NextResponse.json({ error: 'Failed to scrape jobs', details: error.message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
