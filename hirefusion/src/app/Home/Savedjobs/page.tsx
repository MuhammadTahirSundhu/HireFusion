"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Bookmark, Bell, Sparkles, Sliders } from "lucide-react";
import { JobCard, JobWithId, Job } from "@/components/job-card";
import { JobDetails } from "@/components/job-details";
import { JobCardSkeleton, JobDetailsSkeleton } from "@/components/skeleton-loader";
import { Pagination } from "@/components/pagination";

const jobOptions: string[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "DevOps Engineer",
];

const locationOptions: string[] = ["New York", "California", "Texas", "Remote", "Canada", "United Kingdom"];

const jobTypeOptions: string[] = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelance"];

const experienceLevelOptions: string[] = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];

export default function SavedJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<JobWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsPerPage] = useState<number>(10);

  // Track scroll position for sticky positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch saved jobs on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedJobs();
    }
  }, [status]);

  // Generate a unique ID for a job
  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.job_title}-${job.company_name}-${job.job_location}`
      .replace(/\s+/g, "-")
      .toLowerCase();
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    return `${baseId}-${index}-${uniqueSuffix}`;
  };

  // Fetch saved jobs from /api/savedjobs/getallsavedjobs
  const fetchSavedJobs = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedJobIndex(null);

    try {
      if (!session?.user?.email) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `/api/savedjobs/getallsavedjobs?email=${encodeURIComponent(session.user.email)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const jobs: Job[] = data.jobs || [];
      const savedJobIds: string[] = data.savedJobIds || [];
      const jobsWithIds: JobWithId[] = jobs.map((job: Job, index: number) => ({
        ...job,
        id: generateJobId(job, index),
      }));
      setResults(jobsWithIds);
      setSavedJobs(savedJobIds);
      if (jobsWithIds.length > 0) {
        setSelectedJobIndex(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete job from saved jobs
  const deleteSavedJob = async (jobId: string): Promise<void> => {
    if (!session?.user?.email) {
      setError("Please sign in to manage saved jobs");
      return;
    }

    try {
      // Unsave job by calling deletejob endpoint
      const response = await fetch(`/api/savedjobs/deletejob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email, jobId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete saved job");
      }

      const updatedSavedJobs = await response.json();
      setSavedJobs(updatedSavedJobs.savedJobIds || []);

      // Refresh saved jobs to reflect changes
      await fetchSavedJobs();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while removing the job");
    }
  };

  // Handle job selection
  const handleJobSelection = (localIndex: number): void => {
    const globalIndex = results.findIndex(
      (job) => job._id.toString() === results[localIndex]._id.toString()
    );
    setSelectedJobIndex(globalIndex);
  };

  // Calculate pagination values
  const indexOfLastJob: number = currentPage * jobsPerPage;
  const indexOfFirstJob: number = indexOfLastJob - jobsPerPage;
  const currentJobs: JobWithId[] = results.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages: number = Math.ceil(results.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    if (selectedJobIndex !== null) {
      const globalIndex = indexOfFirstJob + (selectedJobIndex % jobsPerPage);
      if (globalIndex < results.length) {
        setSelectedJobIndex(globalIndex);
      } else {
        setSelectedJobIndex(indexOfFirstJob);
      }
    }
  };

  const nextPage = (): void => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = (): void => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const selectedJob: JobWithId | null = selectedJobIndex !== null ? results[selectedJobIndex] : null;

  // Conditional rendering for unauthenticated users
  if (status === "loading") {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view saved jobs</p>
          <a
            href="/auth/signin"
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl shadow-lg shadow-purple-500/10 mb-8 overflow-hidden border border-purple-900/30">
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-icsa/20 bg-purple-600 mb-3">
              Your Saved Jobs
            </h1>
            <p className="text-center text-gray-400 text-base mt-2 max-w-2xl mx-auto">
              View and manage all the jobs you have bookmarked
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-5 rounded-xl mb-8 animate-pulse">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Job Results Section */}
        {(results.length > 0 || loading) && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Panel - Job List (wider) */}
              <div className="md:col-span-7 lg:col-span-8">
                <div className="bg-gray-900 rounded-xl shadow-lg shadow-purple-500/5 mb-6 border border-purple-900/30 overflow-hidden">
                  <div className="p-4 border-b border-purple-900/30 flex justify-between items-center bg-black/50">
                    <h2 className="text-xl font-semibold flex items-center text-white">
                      Saved Jobs
                      <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 px-2.5 py-1 rounded-full border border-purple-800/50">
                        {results.length}
                      </span>
                    </h2>
                    <div className="flex items-center gap-4">
                      {/* Results count */}
                      {results.length > 0 && (
                        <div className="text-sm text-gray-400">
                          Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, results.length)} of{" "}
                          {results.length}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-black/20">
                    {loading ? (
                      <div className="p-4 space-y-4">
                        {[...Array(10)].map((_, i) => (
                          <JobCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : results.length === 0 ? (
                      <div className="p-12 text-center">
                        <Bookmark className="h-16 w-16 mx-auto text-purple-900/50 mb-4" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No saved jobs yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Bookmark jobs you're interested in to find them here later
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        {currentJobs.map((job, index) => (
                          <div
                            key={job._id.toString()}
                            className="transform transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1"
                            style={{
                              opacity: 0,
                              animation: "fadeIn 0.5s forwards",
                              animationDelay: `${index * 0.05}s`,
                            }}
                          >
                            <JobCard
                              job={job}
                              isSelected={
                                selectedJobIndex ===
                                results.findIndex((j) => j._id.toString() === job._id.toString())
                              }
                              onClick={() => handleJobSelection(index)}
                              onSave={() => deleteSavedJob(job._id.toString())}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {results.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      paginate={paginate}
                      prevPage={prevPage}
                      nextPage={nextPage}
                    />
                  )}
                </div>
              </div>

              {/* Right Panel - Job Details (sticky) */}
              <div className="md:col-span-5 lg:col-span-4">
                <div
                  className="bg-gray-900 rounded-xl shadow-lg shadow-purple-500/5 border border-purple-900/30 overflow-hidden"
                  style={{
                    position: "sticky",
                    top: "20px",
                    maxHeight: "calc(100vh - 40px)",
                    overflowY: "auto",
                  }}
                >
                  {loading ? (
                    <JobDetailsSkeleton />
                  ) : selectedJob ? (
                    <JobDetails
                      job={selectedJob}
                      isSaved={true} // All jobs on this page are saved
                      onSave={() => deleteSavedJob(selectedJob._id.toString())}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 p-8 text-center">
                      <div>
                        <div className="w-16 h-16 bg-purple-900/20 rounded-full mx-auto flex items-center justify-center mb-4 border border-purple-800/30">
                          <Search className="h-8 w-8 text-purple-500/70" />
                        </div>
                        <p className="text-gray-400">Select a job to view details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}