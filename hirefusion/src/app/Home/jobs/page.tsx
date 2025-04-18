"use client"
import { useState, useEffect } from "react"
import { Search, Bookmark, Bell, Sparkles, Sliders } from "lucide-react"
import { JobCard, JobWithId, Job } from "@/components/job-card"
import { JobDetails } from "@/components/job-details"
import { JobCardSkeleton, JobDetailsSkeleton } from "@/components/skeleton-loader"
import { Pagination } from "@/components/pagination"
import { JobAlerts } from "@/components/job-alerts"
import { AdvancedFilters, FilterOptions } from "@/components/advanced-filters"
import { RecommendedJobs } from "@/components/recommended-jobs"



const jobOptions: string[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "DevOps Engineer",
]

const locationOptions: string[] = ["New York", "California", "Texas", "Remote", "Canada", "United Kingdom"]

const jobTypeOptions: string[] = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelance"]

const experienceLevelOptions: string[] = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"]

export default function JobsPage() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [results, setResults] = useState<JobWithId[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null)
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"all-jobs" | "recommended" | "filters" | "alerts">("all-jobs")

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
  })
  const [appliedFilterOptions, setAppliedFilterOptions] = useState<FilterOptions>({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [0, 250000],
    skills: [],
    companies: [],
    industries: [],
    datePosted: null,
    remoteOptions: [],
  })

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [jobsPerPage] = useState<number>(10)

  // Load saved jobs from localStorage on initial render
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem("savedJobs")
    if (savedJobsFromStorage) {
      setSavedJobs(JSON.parse(savedJobsFromStorage) as string[])
    }
  }, [])

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
  }, [savedJobs])

  // Track scroll position for fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch jobs when activeTab changes to "all-jobs"
  useEffect(() => {
    if (activeTab === "all-jobs") {
      fetchJobs()
    }
  }, [activeTab])

  const handleJobToggle = (job: string): void => {
    setSelectedJobs((prev) => (prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]))
  }

  const handleLocationToggle = (location: string): void => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  // Toggle job bookmark status
  const toggleSaveJob = (jobId: string): void => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  // Toggle showing only saved jobs
  const toggleShowSavedOnly = (): void => {
    setShowSavedOnly((prev) => !prev)
    setCurrentPage(1) // Reset to first page when toggling filter
  }

  // Generate a unique ID for a job
  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.job_title}-${job.company_name}-${job.job_location}`.replace(/\s+/g, "-").toLowerCase()
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    return `${baseId}-${index}-${uniqueSuffix}`
  }

  const applyAdvancedFilters = (): void => {
    setAppliedFilterOptions(advancedFilterOptions)
    // Placeholder: Fetch or filter jobs with new advanced filters
  }

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
    })
    setAppliedFilterOptions({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [0, 250000],
      skills: [],
      companies: [],
      industries: [],
      datePosted: null,
      remoteOptions: [],
    })
  }

  // Fetch jobs from /jobs/all-jobs API
  const fetchJobs = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    setResults([])
    setSelectedJobIndex(null)
    setCurrentPage(1)
    setShowSavedOnly(false)

    try {
      const response = await fetch("/api/jobs/all-jobs")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jobs: Job[] = await response.json()
      // Add unique IDs to each job
      const jobsWithIds: JobWithId[] = jobs.map((job: Job, index: number) => ({
        ...job,
        id: generateJobId(job, index),
      }))
      setResults(jobsWithIds)
      if (jobsWithIds.length > 0) {
        setSelectedJobIndex(0)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on saved status if needed
  const filteredResults: JobWithId[] = showSavedOnly ? results.filter((job) => savedJobs.includes(job.id)) : results

  // Calculate pagination values
  const indexOfLastJob: number = currentPage * jobsPerPage
  const indexOfFirstJob: number = indexOfLastJob - jobsPerPage
  const currentJobs: JobWithId[] = filteredResults.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages: number = Math.ceil(filteredResults.length / jobsPerPage)

  // Change page
  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber)
    if (selectedJobIndex !== null) {
      const globalIndex = indexOfFirstJob + (selectedJobIndex % jobsPerPage)
      if (globalIndex < filteredResults.length) {
        setSelectedJobIndex(globalIndex)
      } else {
        setSelectedJobIndex(indexOfFirstJob)
      }
    }
  }

  const nextPage = (): void => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  const prevPage = (): void => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  // Handle job selection with pagination
  const handleJobSelection = (localIndex: number): void => {
    const globalIndex = results.findIndex((job) => job.id === filteredResults[indexOfFirstJob + localIndex].id)
    setSelectedJobIndex(globalIndex)
  }

  const selectedJob: JobWithId | null = selectedJobIndex !== null ? results[selectedJobIndex] : null

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Custom Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "all-jobs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("all-jobs")}
            >
              All Jobs
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "recommended"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("recommended")}
            >
              <div className="flex items-center">
                Recommended
                <Sparkles className="ml-1 h-4 w-4" />
              </div>
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "filters"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("filters")}
            >
              <div className="flex items-center">
                Advanced Filters
                <Sliders className="ml-1 h-4 w-4" />
              </div>
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "alerts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("alerts")}
            >
              <div className="flex items-center">
                Job Alerts
                <Bell className="ml-1 h-4 w-4" />
              </div>
            </button>
          </div>
        </div>

        {activeTab === "all-jobs" && (
          <div className="space-y-6">
            {/* Main Search Card */}
            <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-center text-gray-900">Find Your Dream Job</h1>
                <p className="text-center text-gray-500 text-base mt-2">
                  Browse all available job listings
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
                <p>Error: {error}</p>
              </div>
            )}

            {/* Job Results Section */}
            {(results.length > 0 || loading) && (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Panel - Job List (wider) */}
                  <div className="md:col-span-7 lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-md mb-6">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center text-gray-900">
                          Job Listings
                          <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {filteredResults.length}
                          </span>
                        </h2>
                        <div className="flex items-center gap-4">
                          {/* Saved Jobs Filter Toggle */}
                          <button
                            onClick={toggleShowSavedOnly}
                            className={`flex items-center text-sm px-3 py-1 rounded-full ${
                              showSavedOnly
                                ? "bg-blue-100 text-blue-700 border border-blue-300"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5 mr-1" />
                            {showSavedOnly ? "All Jobs" : "Saved Jobs"}
                            {!showSavedOnly && savedJobs.length > 0 && (
                              <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {savedJobs.length}
                              </span>
                            )}
                          </button>

                          {/* Results count */}
                          {filteredResults.length > 0 && (
                            <div className="text-sm text-gray-500">
                              Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredResults.length)} of{" "}
                              {filteredResults.length}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        {loading ? (
                          <div className="p-4 space-y-4">
                            {[...Array(10)].map((_, i) => (
                              <JobCardSkeleton key={i} />
                            ))}
                          </div>
                        ) : filteredResults.length === 0 && showSavedOnly ? (
                          <div className="p-8 text-center">
                            <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No saved jobs yet</h3>
                            <p className="text-gray-500">Bookmark jobs you're interested in to find them here later</p>
                          </div>
                        ) : (
                          <div className="p-4 space-y-4">
                            {currentJobs.map((job, index) => (
                              <JobCard
                                key={job.id}
                                job={job}
                                isSelected={selectedJobIndex === results.findIndex((j) => j.id === job.id)}
                                isSaved={savedJobs.includes(job.id)}
                                onClick={() => handleJobSelection(index)}
                                onSave={() => toggleSaveJob(job.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pagination Controls */}
                      {filteredResults.length > 0 && (
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

                  {/* Right Panel - Job Details (narrower and fixed) */}
                  <div className="md:col-span-5 lg:col-span-4">
                    <div
                      className="bg-white rounded-xl shadow-md"
                      style={{
                        position: scrollPosition > 200 ? "fixed" : "relative",
                        top: scrollPosition > 200 ? "20px" : "auto",
                        width: scrollPosition > 200 ? "calc(33.333% - 1.5rem)" : "100%",
                        maxWidth: scrollPosition > 200 ? "400px" : "none",
                        maxHeight: scrollPosition > 200 ? "calc(100vh - 40px)" : "none",
                        overflow: scrollPosition > 200 ? "auto" : "visible",
                      }}
                    >
                      {loading ? (
                        <JobDetailsSkeleton />
                      ) : selectedJob ? (
                        <JobDetails
                          job={selectedJob}
                          isSaved={savedJobs.includes(selectedJob.id)}
                          onSave={() => toggleSaveJob(selectedJob.id)}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64">
                          <p className="text-gray-500">Select a job to view details</p>
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
          <AdvancedFilters
            filterOptions={advancedFilterOptions}
            setFilterOptions={setAdvancedFilterOptions}
            applyFilters={applyAdvancedFilters}
            resetFilters={resetAdvancedFilters}
          />
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
    </div>
  )
}