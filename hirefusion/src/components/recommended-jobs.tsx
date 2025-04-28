"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { JobCard, type JobWithId, type Job } from "@/components/job-card"
import { JobDetails } from "@/components/job-details"

export default function RecommendedJobs() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [results, setResults] = useState<JobWithId[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [jobsPerPage] = useState<number>(10)

  // Fetch recommended jobs on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchRecommendedJobs()
    }
  }, [status])

  // Generate a unique ID for a job
  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.job_title}-${job.company_name}-${job.job_location}`.replace(/\s+/g, "-").toLowerCase()
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    return `${baseId}-${index}-${uniqueSuffix}`
  }

  // Fetch recommended jobs from /api/recommendations/getjobs
  const fetchRecommendedJobs = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    setResults([])
    setSelectedJobIndex(null)

    try {
      if (!session?.user?.email) {
        throw new Error("User not authenticated")
      }

      const response = await fetch(`/api/recommendations/getjobs?email=${encodeURIComponent(session.user.email)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Recommended jobs data:", data)

      // Handle the API response format
      const jobs: Job[] = data.jobs || data || [] // Handle different possible response formats
      const savedJobIds: string[] = data.savedJobIds || []

      const jobsWithIds: JobWithId[] = jobs.map((job: Job, index: number) => ({
        ...job,
        id: generateJobId(job, index),
      }))

      setResults(jobsWithIds)
      setSavedJobs(savedJobIds)

      if (jobsWithIds.length > 0) {
        setSelectedJobIndex(0)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Save job to saved jobs
  const saveJob = async (jobId: string): Promise<void> => {
    if (!session?.user?.email) {
      setError("Please sign in to save jobs")
      return
    }

    try {
      const response = await fetch(`/api/savedjobs/savejob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email, jobId }),
      })

      if (!response.ok) {
        throw new Error("Failed to save job")
      }

      const updatedSavedJobs = await response.json()
      setSavedJobs(updatedSavedJobs.savedJobIds || [])
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving the job")
    }
  }

  // Handle job selection
  const handleJobSelection = (localIndex: number): void => {
    const globalIndex = indexOfFirstJob + localIndex
    if (globalIndex < results.length) {
      setSelectedJobIndex(globalIndex)
    }
  }

  // Calculate pagination values
  const indexOfLastJob: number = currentPage * jobsPerPage
  const indexOfFirstJob: number = indexOfLastJob - jobsPerPage
  const currentJobs: JobWithId[] = results.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages: number = Math.ceil(results.length / jobsPerPage)

  // Change page
  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber)
    if (selectedJobIndex !== null) {
      const globalIndex = indexOfFirstJob
      if (globalIndex < results.length) {
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

  const selectedJob: JobWithId | null = selectedJobIndex !== null ? results[selectedJobIndex] : null

  // Conditional rendering for unauthenticated users
  if (status === "loading") {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view recommended jobs</p>
          <a href="/auth/signin" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl shadow-lg shadow-purple-500/10 mb-8 overflow-hidden border border-purple-900/30">
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
              Recommended Jobs
            </h1>
            <p className="text-center text-gray-400 text-base mt-2 max-w-2xl mx-auto">
              Jobs tailored to your skills and preferences
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
                      Recommended Jobs
                      <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 px-2.5 py-1 rounded-full border border-purple-800/50">
                        {results.length}
                      </span>
                    </h2>
                    <div className="flex items-center gap-4">
                      {/* Results count */}
                      {results.length > 0 && (
                        <div className="text-sm text-gray-400">
                          Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, results.length)} of {results.length}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-black/20">
                    {loading ? (
                      <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    ) : results.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="h-16 w-16 mx-auto text-purple-900/50 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            <path d="M13.5 1.5 12 3l1.5 1.5"></path>
                            <path d="M21 11.5 19.5 13l-1.5-1.5"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No recommended jobs yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          We're working on finding the perfect jobs for you
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
                                selectedJobIndex === results.findIndex((j) => j._id.toString() === job._id.toString())
                              }
                              onClick={() => handleJobSelection(index)}
                              onSave={() => saveJob(job._id.toString())}
                              // isSaved={savedJobs.includes(job._id.toString())}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {results.length > 0 && (
                    <div className="flex items-center justify-center px-4 py-3 border-t border-purple-900/30 bg-black/30">
                      <nav className="inline-flex space-x-1" aria-label="Pagination">
                        <button
                          className="h-8 w-8 border border-purple-800/50 text-purple-300 hover:bg-purple-950/30 disabled:opacity-50 rounded flex items-center justify-center"
                          onClick={prevPage}
                          disabled={currentPage === 1}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNumber = i + 1
                          return (
                            <button
                              key={`page-${pageNumber}`}
                              className={`h-8 min-w-[2rem] px-2 rounded ${
                                currentPage === pageNumber
                                  ? "bg-purple-600 hover:bg-purple-700 text-white border-none"
                                  : "border border-purple-800/50 text-purple-300 hover:bg-purple-950/30"
                              }`}
                              onClick={() => paginate(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          )
                        })}

                        {totalPages > 5 && <span className="px-3 py-1 text-gray-500">...</span>}

                        {totalPages > 5 && (
                          <button
                            className={`h-8 min-w-[2rem] px-2 rounded border border-purple-800/50 text-purple-300 hover:bg-purple-950/30`}
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </button>
                        )}

                        <button
                          className="h-8 w-8 border border-purple-800/50 text-purple-300 hover:bg-purple-950/30 disabled:opacity-50 rounded flex items-center justify-center"
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </nav>
                    </div>
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
                    <div className="p-5 animate-pulse">
                      <div className="h-7 w-3/4 bg-gray-800 mb-2 rounded"></div>
                      <div className="h-5 w-1/2 bg-gray-800 mb-3 rounded"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-5 w-24 bg-gray-800 rounded"></div>
                        <div className="h-5 w-28 bg-gray-800 rounded"></div>
                      </div>
                      <div className="h-10 w-full bg-gray-800 rounded mb-4"></div>
                      <div className="h-5 w-1/4 bg-gray-800 mb-3 rounded"></div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="h-6 w-16 bg-gray-800 rounded-full"></div>
                        <div className="h-6 w-20 bg-gray-800 rounded-full"></div>
                        <div className="h-6 w-24 bg-gray-800 rounded-full"></div>
                      </div>
                      <div className="h-px w-full bg-gray-800 my-4"></div>
                      <div className="h-5 w-1/4 bg-gray-800 mb-3 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-800 rounded"></div>
                        <div className="h-4 w-full bg-gray-800 rounded"></div>
                        <div className="h-4 w-full bg-gray-800 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                      </div>
                    </div>
                  ) : selectedJob ? (
                    <JobDetails
                      job={selectedJob}
                      isSaved={savedJobs.includes(selectedJob._id.toString())}
                      onSave={() => saveJob(selectedJob._id.toString())}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 p-8 text-center">
                      <div>
                        <div className="w-16 h-16 bg-purple-900/20 rounded-full mx-auto flex items-center justify-center mb-4 border border-purple-800/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-purple-500/70"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
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
  )
}
