"use client"
import { useState, useEffect } from "react"
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  BookmarkPlus,
  ExternalLink,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"

interface Job {
  title: string | null
  company: string | null
  location: string | null
  "job-type": string | null
  summary: string | null
}

// Create a unique ID for each job to use for bookmarking
type JobWithId = Job & { id: string }

const jobOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "DevOps Engineer",
]

const locationOptions = ["New York", "California", "Texas", "Remote", "Canada", "United Kingdom"]

export default function JobsPage() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [results, setResults] = useState<JobWithId[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null)
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [savedJobs, setSavedJobs] = useState<string[]>([]) // Array of job IDs
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(10)

  // Load saved jobs from localStorage on initial render
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem("savedJobs")
    if (savedJobsFromStorage) {
      setSavedJobs(JSON.parse(savedJobsFromStorage))
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

  const handleJobToggle = (job: string) => {
    setSelectedJobs((prev) => (prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]))
  }

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  // Toggle job bookmark status
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  // Toggle showing only saved jobs
  const toggleShowSavedOnly = () => {
    setShowSavedOnly((prev) => !prev)
    setCurrentPage(1) // Reset to first page when toggling filter
  }

  // Generate a unique ID for a job - FIXED to avoid duplicates
  const generateJobId = (job: Job, index: number): string => {
    // Create a base ID from job properties
    const baseId = `${job.title}-${job.company}-${job.location}`.replace(/\s+/g, "-").toLowerCase()

    // Add a random component to ensure uniqueness
    // Using a combination of timestamp and random number
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)

    // Combine with the index to further ensure uniqueness
    return `${baseId}-${index}-${uniqueSuffix}`
  }

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    setSelectedJobIndex(null)
    setCurrentPage(1) // Reset to first page when fetching new results
    setShowSavedOnly(false) // Reset saved filter when searching
    const numPages = 5

    try {
      const allJobs: JobWithId[] = []

      for (const jobTitle of selectedJobs) {
        for (const location of selectedLocations) {
          for (let page = 0; page < numPages; page++) {
            const start = page * 10
            const response = await fetch(
              `/api/jobs?jobTitle=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&start=${start}`,
            )

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            // Add unique IDs to each job
            const jobsWithIds = data.jobs.map((job: Job, index: number) => ({
              ...job,
              id: generateJobId(job, allJobs.length + index),
            }))
            allJobs.push(...jobsWithIds)
          }
        }
      }

      // Ensure no duplicate IDs in the results
      const uniqueJobs = allJobs.reduce((acc: JobWithId[], job: JobWithId) => {
        if (!acc.some((j) => j.id === job.id)) {
          acc.push(job)
        }
        return acc
      }, [])

      setResults(uniqueJobs)
      if (uniqueJobs.length > 0) {
        setSelectedJobIndex(0)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on saved status if needed
  const filteredResults = showSavedOnly ? results.filter((job) => savedJobs.includes(job.id)) : results

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredResults.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredResults.length / jobsPerPage)

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Adjust selected job index to match the new page
    if (selectedJobIndex !== null) {
      const globalIndex = indexOfFirstJob + (selectedJobIndex % jobsPerPage)
      if (globalIndex < filteredResults.length) {
        setSelectedJobIndex(globalIndex)
      } else {
        setSelectedJobIndex(indexOfFirstJob)
      }
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  // Handle job selection with pagination
  const handleJobSelection = (localIndex: number) => {
    const globalIndex = results.findIndex((job) => job.id === filteredResults[indexOfFirstJob + localIndex].id)
    setSelectedJobIndex(globalIndex)
  }

  const selectedJob = selectedJobIndex !== null ? results[selectedJobIndex] : null

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Search Card */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="p-6 pb-4">
            <h1 className="text-3xl font-bold text-center text-gray-900">Find Your Dream Job</h1>
            <p className="text-center text-gray-500 text-base mt-2">
              Select job titles and locations to start your search
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Mobile Filter Button */}
              <button
                className="md:hidden w-full mb-2 py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium text-gray-700"
                onClick={() => setFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter Options
              </button>

              {/* Mobile Filter Sidebar */}
              {filterOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                  <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold text-lg text-gray-900">Filter Jobs</h2>
                      <button onClick={() => setFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">Select your preferences to find the perfect job</p>

                    <div className="space-y-6">
                      {/* Job Titles */}
                      <div>
                        <h3 className="font-medium mb-3 text-gray-800">Job Titles</h3>
                        <div className="space-y-2">
                          {jobOptions.map((job) => (
                            <div key={job} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`mobile-job-${job}`}
                                checked={selectedJobs.includes(job)}
                                onChange={() => handleJobToggle(job)}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`mobile-job-${job}`} className="text-sm text-gray-700">
                                {job}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Locations */}
                      <div>
                        <h3 className="font-medium mb-3 text-gray-800">Locations</h3>
                        <div className="space-y-2">
                          {locationOptions.map((loc) => (
                            <div key={loc} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`mobile-loc-${loc}`}
                                checked={selectedLocations.includes(loc)}
                                onChange={() => handleLocationToggle(loc)}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`mobile-loc-${loc}`} className="text-sm text-gray-700">
                                {loc}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Filters */}
              <div className="hidden md:grid md:grid-cols-2 gap-8 w-full">
                {/* Job Titles */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Job Titles</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {jobOptions.map((job) => (
                      <div key={job} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`job-${job}`}
                          checked={selectedJobs.includes(job)}
                          onChange={() => handleJobToggle(job)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`job-${job}`} className="text-sm text-gray-700">
                          {job}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Locations</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {locationOptions.map((loc) => (
                      <div key={loc} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`loc-${loc}`}
                          checked={selectedLocations.includes(loc)}
                          onChange={() => handleLocationToggle(loc)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`loc-${loc}`} className="text-sm text-gray-700">
                          {loc}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={fetchJobs}
                className={`px-8 py-3 rounded-md text-white font-medium flex items-center justify-center ${
                  loading || selectedJobs.length === 0 || selectedLocations.length === 0
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading || selectedJobs.length === 0 || selectedLocations.length === 0}
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Jobs
                  </>
                )}
              </button>
            </div>
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
                    <div className="p-4 border-t">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`flex items-center px-3 py-1 rounded ${
                            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </button>

                        <div className="flex flex-wrap justify-center gap-1">
                          {totalPages <= 7 ? (
                            // Show all pages if 7 or fewer
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                  currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {number}
                              </button>
                            ))
                          ) : (
                            // Show limited pages with ellipsis for larger page counts
                            <>
                              {/* First page */}
                              <button
                                onClick={() => paginate(1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                  currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                1
                              </button>

                              {/* Ellipsis or second page */}
                              {currentPage > 3 && (
                                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700">
                                  ...
                                </button>
                              )}

                              {/* Pages around current page */}
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (currentPage <= 3) {
                                  // Near start
                                  pageNum = i + 2
                                } else if (currentPage >= totalPages - 2) {
                                  // Near end
                                  pageNum = totalPages - 4 + i
                                } else {
                                  // Middle
                                  pageNum = currentPage - 2 + i
                                }
                                return pageNum > 1 && pageNum < totalPages ? pageNum : null
                              })
                                .filter(Boolean)
                                .map((number) => (
                                  <button
                                    key={number}
                                    onClick={() => paginate(number as number)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                      currentPage === number
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {number}
                                  </button>
                                ))}

                              {/* Ellipsis or second-to-last page */}
                              {currentPage < totalPages - 2 && (
                                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700">
                                  ...
                                </button>
                              )}

                              {/* Last page */}
                              <button
                                onClick={() => paginate(totalPages)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                  currentPage === totalPages
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center px-3 py-1 rounded ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
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
    </div>
  )
}

// Job Card Component
function JobCard({
  job,
  isSelected,
  isSaved,
  onClick,
  onSave,
}: {
  job: JobWithId
  isSelected: boolean
  isSaved: boolean
  onClick: () => void
  onSave: () => void
}) {
  return (
    <div
      className={`bg-white border rounded-lg transition-all hover:shadow-md p-4 ${
        isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between">
        <div className="cursor-pointer flex-1" onClick={onClick}>
          <h3 className="font-semibold text-base truncate text-gray-900">{job.title ?? "N/A"}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Building2 className="h-3 w-3 mr-1" />
            <span className="truncate">{job.company ?? "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{job.location ?? "N/A"}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{job["job-type"] ?? "N/A"}</span>
            {isSaved && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                <Bookmark className="h-3 w-3 mr-1" />
                Saved
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          className={`p-2 self-start rounded-md ${
            isSaved ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
          }`}
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
        >
          {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

// Job Details Component
function JobDetails({
  job,
  isSaved,
  onSave,
}: {
  job: JobWithId
  isSaved: boolean
  onSave: () => void
}) {
  return (
    <>
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title ?? "N/A"}</h2>
            <p className="text-gray-500 text-base mt-1 flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {job.company ?? "N/A"}
            </p>
          </div>
          <button
            onClick={onSave}
            className={`p-2 border rounded-md ${
              isSaved ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100" : "hover:bg-gray-50 text-gray-700"
            }`}
            aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span>{job.location ?? "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{job["job-type"] ?? "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
            <span>Full Time</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Job Description</h3>
          <div className="text-gray-600 space-y-2">
            <p>{job.summary ?? "No description available"}</p>
            <p>
              We're looking for a talented professional to join our growing team. This role offers competitive
              compensation, benefits, and opportunities for career advancement.
            </p>
            <p>
              The ideal candidate will have strong communication skills, be a team player, and have a passion for
              innovation.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800">Requirements</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Bachelor's degree in Computer Science or related field</li>
            <li>3+ years of experience in software development</li>
            <li>Proficiency in relevant programming languages</li>
            <li>Strong problem-solving skills</li>
            <li>Excellent communication and teamwork abilities</li>
          </ul>
        </div>
      </div>
      <div className="px-6 py-4 border-t flex justify-between">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Apply Now</button>
        <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center text-gray-700">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Original
        </button>
      </div>
    </>
  )
}

// Skeleton Loaders
function JobCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
  )
}

function JobDetailsSkeleton() {
  return (
    <>
      <div className="p-6 border-b">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex gap-4">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div>
          <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t flex justify-between">
        <div className="h-10 bg-gray-200 rounded w-28"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </>
  )
}
