"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Bookmark, Bell, Sparkles, Sliders } from "lucide-react";
import { JobCard, JobWithId, Job } from "@/components/job-card";
import { JobDetails } from "@/components/job-details";
import { JobCardSkeleton, JobDetailsSkeleton } from "@/components/skeleton-loader";
import { Pagination } from "@/components/pagination";
import { JobAlerts } from "@/components/job-alerts";
import { AdvancedFilters, FilterOptions } from "@/components/advanced-filters";
import RecommendedJobs from "@/components/recommended-jobs";

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

export default function JobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [results, setResults] = useState<JobWithId[]>([]);
  const [filteredResults, setFilteredResults] = useState<JobWithId[]>([]); // New state for advanced filtered jobs
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredLoading, setFilteredLoading] = useState<boolean>(false); // Loading state for filtered jobs
  const [error, setError] = useState<string | null>(null);
  const [filteredError, setFilteredError] = useState<string | null>(null); // Error state for filtered jobs
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all-jobs" | "recommended" | "filters" | "alerts">("all-jobs");

  // Advanced filters state
  const [advancedFilterOptions, setAdvancedFilterOptions] = useState<FilterOptions>({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [0, 250000],
    skills: [],
    companies: [],
    industries: [],
    datePosted: null,
    remoteOptions: [],
  });
  const [appliedFilterOptions, setAppliedFilterOptions] = useState<FilterOptions>({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [0, 250000],
    skills: [],
    companies: [],
    industries: [],
    datePosted: null,
    remoteOptions: [],
  });

  // Pagination states for all jobs
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsPerPage] = useState<number>(10);

  // Pagination states for filtered jobs
  const [filteredCurrentPage, setFilteredCurrentPage] = useState<number>(1);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch jobs when activeTab changes to "all-jobs"
  useEffect(() => {
    if (activeTab === "all-jobs" && !showSavedOnly) {
      fetchJobs();
    }
  }, [activeTab]);

  const handleJobToggle = (job: string): void => {
    setSelectedJobs((prev) => (prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]));
  };

  const handleLocationToggle = (location: string): void => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const toggleSaveJob = async (jobId: string): Promise<void> => {
    if (!session?.user?.email) {
      setError("Please sign in to save jobs");
      return;
    }
    try {
      setSavedJobs((prev) =>
        prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      );
    } catch (err: any) {
      setError("An unexpected error occurred while saving the job");
    }
  };

  const toggleShowSavedOnly = async (): Promise<void> => {
    if (showSavedOnly) {
      setShowSavedOnly(false);
      setCurrentPage(1);
      await fetchJobs();
    } else {
      router.push("/home/Savedjobs");
    }
  };

  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.job_title}-${job.company_name}-${job.job_location}`
      .replace(/\s+/g, "-")
      .toLowerCase();
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    return `${baseId}-${index}-${uniqueSuffix}`;
  };

  // Fetch jobs from /api/jobs/all-jobs
  const fetchJobs = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedJobIndex(null);
    try {
      const response = await fetch("/api/jobs/all-jobs");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobs: Job[] = await response.json();
      const jobsWithIds: JobWithId[] = jobs.map((job: Job, index: number) => ({
        ...job,
        id: generateJobId(job, index),
      }));
      setResults(jobsWithIds);
      if (jobsWithIds.length > 0) {
        setSelectedJobIndex(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved jobs
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

  // Fetch advanced filtered jobs
  const applyAdvancedFilters = async (): Promise<void> => {
    setAppliedFilterOptions(advancedFilterOptions);
    setFilteredLoading(true);
    setFilteredError(null);
    setFilteredResults([]);
    setFilteredCurrentPage(1);
    setSelectedJobIndex(null);

    try {
      const response = await fetch("/api/advancedfilteredjobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(advancedFilterOptions),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobs: Job[] = await response.json();
      const jobsWithIds: JobWithId[] = jobs.map((job: Job, index: number) => ({
        ...job,
        id: generateJobId(job, index),
      }));
      setFilteredResults(jobsWithIds);
      if (jobsWithIds.length > 0) {
        setSelectedJobIndex(0);
      }
    } catch (err: any) {
      setFilteredError(err.message);
    } finally {
      setFilteredLoading(false);
    }
  };

  const resetAdvancedFilters = (): void => {
    setAdvancedFilterOptions({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [0, 250000],
      skills: [],
      companies: [],
      industries: [],
      datePosted: null,
      remoteOptions: [],
    });
    setAppliedFilterOptions({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [0, 250000],
      skills: [],
      companies: [],
      industries: [],
      datePosted: null,
      remoteOptions: [],
    });
    setFilteredResults([]);
    setFilteredCurrentPage(1);
    setSelectedJobIndex(null);
  };

  // Pagination for all jobs
  const indexOfLastJob: number = currentPage * jobsPerPage;
  const indexOfFirstJob: number = indexOfLastJob - jobsPerPage;
  const currentJobs: JobWithId[] = results.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages: number = Math.ceil(results.length / jobsPerPage);

  // Pagination for filtered jobs
  const filteredIndexOfLastJob: number = filteredCurrentPage * jobsPerPage;
  const filteredIndexOfFirstJob: number = filteredIndexOfLastJob - jobsPerPage;
  const filteredCurrentJobs: JobWithId[] = filteredResults.slice(
    filteredIndexOfFirstJob,
    filteredIndexOfLastJob
  );
  const filteredTotalPages: number = Math.ceil(filteredResults.length / jobsPerPage);

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

  const filteredPaginate = (pageNumber: number): void => {
    setFilteredCurrentPage(pageNumber);
    if (selectedJobIndex !== null) {
      const globalIndex = filteredIndexOfFirstJob + (selectedJobIndex % jobsPerPage);
      if (globalIndex < filteredResults.length) {
        setSelectedJobIndex(globalIndex);
      } else {
        setSelectedJobIndex(filteredIndexOfFirstJob);
      }
    }
  };

  const filteredNextPage = (): void => {
    if (filteredCurrentPage < filteredTotalPages) {
      filteredPaginate(filteredCurrentPage + 1);
    }
  };

  const filteredPrevPage = (): void => {
    if (filteredCurrentPage > 1) {
      filteredPaginate(filteredCurrentPage - 1);
    }
  };

  const handleJobSelection = (localIndex: number, isFiltered: boolean): void => {
    const targetResults = isFiltered ? filteredResults : results;
    const targetIndexOfFirstJob = isFiltered ? filteredIndexOfFirstJob : indexOfFirstJob;
    const globalIndex = targetResults.findIndex(
      (job) =>
        job._id.toString() === targetResults[targetIndexOfFirstJob + localIndex]._id.toString()
    );
    setSelectedJobIndex(globalIndex);
  };

  const selectedJob: JobWithId | null =
    selectedJobIndex !== null
      ? activeTab === "filters" && filteredResults.length > 0
        ? filteredResults[selectedJobIndex]
        : results[selectedJobIndex]
      : null;

  if (status === "loading") {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view jobs</p>
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
        {/* Tabs */}
        <div className="mb-6 border-b border-purple-900/30">
          <div className="flex flex-wrap -mb-px overflow-x-auto hide-scrollbar">
            <button
              className={`py-3 px-5 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "all-jobs"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-purple-300 hover:border-purple-800/50"
              }`}
              onClick={() => setActiveTab("all-jobs")}
            >
              All Jobs
            </button>
            <button
              className={`py-3 px-5 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "recommended"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-purple-300 hover:border-purple-800/50"
              }`}
              onClick={() => setActiveTab("recommended")}
            >
              <div className="flex items-center">
                Recommended
                <Sparkles className="ml-1.5 h-4 w-4 text-purple-500" />
              </div>
            </button>
            <button
              className={`py-3 px-5 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "filters"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-purple-300 hover:border-purple-800/50"
              }`}
              onClick={() => setActiveTab("filters")}
            >
              <div className="flex items-center">
                Advanced Filters
                <Sliders className="ml-1.5 h-4 w-4 text-purple-500" />
              </div>
            </button>
            <button
              className={`py-3 px-5 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "alerts"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-purple-300 hover:border-purple-800/50"
              }`}
              onClick={() => setActiveTab("alerts")}
            >
              <div className="flex items-center">
                Job Alerts
                <Bell className="ml-1.5 h-4 w-4 text-purple-500" />
              </div>
            </button>
          </div>
        </div>

        {activeTab === "all-jobs" && (
          <div className="space-y-6">
            {/* Main Search Card */}
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl shadow-lg shadow-purple-500/10 mb-8 overflow-hidden border border-purple-900/30">
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
                  Find Your Dream Job
                </h1>
                <p className="text-center text-gray-400 text-base mt-2 max-w-2xl mx-auto">
                  Browse all available job listings and discover opportunities that match your skills and career goals
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-5 rounded-xl mb-8 animate-pulse">
                <p>Error: {error}</p>
              </div>
            )}

            {(results.length > 0 || loading) && (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 lg:col-span-8">
                    <div className="bg-gray-900 rounded-xl shadow-lg shadow-purple-500/5 mb-6 border border-purple-900/30 overflow-hidden">
                      <div className="p-4 border-b border-purple-900/30 flex justify-between items-center bg-black/50">
                        <h2 className="text-xl font-semibold flex items-center text-white">
                          Job Listings
                          <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 px-2.5 py-1 rounded-full border border-purple-800/50">
                            {results.length}
                          </span>
                        </h2>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={toggleShowSavedOnly}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${
                              showSavedOnly
                                ? "bg-purple-900/40 text-purple-300 border border-purple-700"
                                : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-purple-900/20 hover:text-purple-300 hover:border-purple-800/50"
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                            {showSavedOnly ? "All Jobs" : "Saved Jobs"}
                            {!showSavedOnly && savedJobs.length > 0 && (
                              <span className="ml-1.5 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {savedJobs.length}
                              </span>
                            )}
                          </button>
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
                        ) : results.length === 0 && showSavedOnly ? (
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
                                  onClick={() => handleJobSelection(index, false)}
                                  onSave={() => toggleSaveJob(job._id.toString())}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                          isSaved={savedJobs.includes(selectedJob._id.toString())}
                          onSave={() => toggleSaveJob(selectedJob._id.toString())}
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
        )}

        {activeTab === "recommended" && (
          <RecommendedJobs
            jobOptions={jobOptions}
            locationOptions={locationOptions}
            savedJobs={savedJobs}
            toggleSaveJob={toggleSaveJob}
          />
        )}

        {activeTab === "filters" && (
          <div className="space-y-6">
            <AdvancedFilters
              filterOptions={advancedFilterOptions}
              setFilterOptions={setAdvancedFilterOptions}
              applyFilters={applyAdvancedFilters}
              resetFilters={resetAdvancedFilters}
            />

            {filteredError && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-5 rounded-xl mb-8 animate-pulse">
                <p>Error: {filteredError}</p>
              </div>
            )}

            {(filteredResults.length > 0 || filteredLoading) && (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 lg:col-span-8">
                    <div className="bg-gray-900 rounded-xl shadow-lg shadow-purple-500/5 mb-6 border border-purple-900/30 overflow-hidden">
                      <div className="p-4 border-b border-purple-900/30 flex justify-between items-center bg-black/50">
                        <h2 className="text-xl font-semibold flex items-center text-white">
                          Filtered Jobs
                          <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 px-2.5 py-1 rounded-full border border-purple-800/50">
                            {filteredResults.length}
                          </span>
                        </h2>
                        {filteredResults.length > 0 && (
                          <div className="text-sm text-gray-400">
                            Showing {filteredIndexOfFirstJob + 1}-
                            {Math.min(filteredIndexOfLastJob, filteredResults.length)} of{" "}
                            {filteredResults.length}
                          </div>
                        )}
                      </div>
                      <div className="bg-black/20">
                        {filteredLoading ? (
                          <div className="p-4 space-y-4">
                            {[...Array(10)].map((_, i) => (
                              <JobCardSkeleton key={i} />
                            ))}
                          </div>
                        ) : filteredResults.length === 0 ? (
                          <div className="p-12 text-center">
                            <Search className="h-16 w-16 mx-auto text-purple-900/50 mb-4" />
                            <h3 className="text-xl font-medium text-gray-300 mb-2">No jobs found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                              Try adjusting your filters to find matching jobs
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 space-y-4">
                            {filteredCurrentJobs.map((job, index) => (
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
                                    filteredResults.findIndex((j) => j._id.toString() === job._id.toString())
                                  }
                                  onClick={() => handleJobSelection(index, true)}
                                  onSave={() => toggleSaveJob(job._id.toString())}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {filteredResults.length > 0 && (
                        <Pagination
                          currentPage={filteredCurrentPage}
                          totalPages={filteredTotalPages}
                          paginate={filteredPaginate}
                          prevPage={filteredPrevPage}
                          nextPage={filteredNextPage}
                        />
                      )}
                    </div>
                  </div>
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
                      {filteredLoading ? (
                        <JobDetailsSkeleton />
                      ) : selectedJob ? (
                        <JobDetails
                          job={selectedJob}
                          isSaved={savedJobs.includes(selectedJob._id.toString())}
                          onSave={() => toggleSaveJob(selectedJob._id.toString())}
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
        )}

        {activeTab === "alerts" && (
          <JobAlerts
            jobOptions={jobOptions}
            locationOptions={locationOptions}
            jobTypeOptions={jobTypeOptions}
            experienceLevelOptions={experienceLevelOptions}
          />
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
          0%, 100% {
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