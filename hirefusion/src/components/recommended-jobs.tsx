
"use client";
import { useState, useEffect } from "react";
import { Sparkles, Bookmark, Search } from "lucide-react";

interface Job {
  title: string;
  company: string;
  location: string;
  "job-type": string;
  summary: string;
}

interface JobWithId extends Job {
  id: string;
}

export function RecommendedJobs() {
  const [recommendedJobs, setRecommendedJobs] = useState<JobWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Hardcoded job and location options
  const jobOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "DevOps Engineer",
  ];
  const locationOptions = ["New York", "California", "Texas", "Remote", "Canada"];

  // Generate a unique ID for a job
  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.title}-${job.company}-${job.location}`
      .replace(/\s+/g, "-")
      .toLowerCase();
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    return `${baseId}-${index}-${uniqueSuffix}`;
  };

  // Toggle save job
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Fetch recommended jobs
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setLoading(true);
      try {
        const randomJobs: JobWithId[] = [];
        for (let i = 0; i < 5; i++) {
          const randomJobTitle = jobOptions[Math.floor(Math.random() * jobOptions.length)];
          const randomLocation = locationOptions[Math.floor(Math.random() * locationOptions.length)];
          const job: Job = {
            title: randomJobTitle,
            company: ["Google", "Microsoft", "Amazon", "Apple", "Meta"][Math.floor(Math.random() * 5)],
            location: randomLocation,
            "job-type": ["Full-time", "Part-time", "Contract"][Math.floor(Math.random() * 3)],
            summary: `Join our team as a ${randomJobTitle} in ${randomLocation}.`,
          };
          randomJobs.push({
            ...job,
            id: generateJobId(job, i),
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRecommendedJobs(randomJobs);
        if (randomJobs.length > 0) {
          setSelectedJobIndex(0);
        }
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedJobs();
  }, []);

  // Handle job selection
  const handleJobSelection = (index: number) => {
    if (index >= 0 && index < recommendedJobs.length) {
      setSelectedJobIndex(index);
    }
  };

  const selectedJob = selectedJobIndex !== null && recommendedJobs[selectedJobIndex] ? recommendedJobs[selectedJobIndex] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-2">
            <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
          </div>
          <p className="text-gray-500">
            Explore job opportunities tailored to your interests.
          </p>
        </div>

        {/* Job Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Job List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : recommendedJobs.length === 0 ? (
                <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-inner">
                  <div className="max-w-md mx-auto">
                    <Sparkles className="h-12 w-12 mx-auto text-yellow-400 mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Recommendations Yet</h3>
                    <p className="text-gray-500 mb-6">
                      Start exploring jobs to find opportunities that match your skills and interests!
                    </p>
                    <a
                      href="/home/jobs"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md shadow-blue-500/20"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Browse Jobs
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedJobIndex === index ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => handleJobSelection(index)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-base text-gray-900 truncate">{job.title}</h3>
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {job["job-type"]}
                            </span>
                            {savedJobs.includes(job.id) && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                                <Bookmark className="h-3 w-3 mr-1" />
                                Saved
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          className={`p-2 rounded-md ${
                            savedJobs.includes(job.id)
                              ? "text-blue-600 hover:bg-blue-50"
                              : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                          aria-label={savedJobs.includes(job.id) ? "Remove from saved jobs" : "Save job"}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ) : selectedJob ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-600">{selectedJob.company}</p>
                  <p className="text-sm text-gray-600">{selectedJob.location}</p>
                  <p className="text-sm text-gray-600">{selectedJob["job-type"]}</p>
                  <p className="text-sm text-gray-700">{selectedJob.summary}</p>
                  <button
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      savedJobs.includes(selectedJob.id)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    {savedJobs.includes(selectedJob.id) ? "Remove from Saved" : "Save Job"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  Select a job to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}