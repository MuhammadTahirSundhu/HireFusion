"use client"
import { useState, useEffect } from "react"
import { Sparkles, Bookmark, Building2, MapPin, Clock } from 'lucide-react'
import { JobCard, type JobWithId, type Job } from "@/components/job-card"
import { JobDetails } from "@/components/job-details"
import { JobCardSkeleton, JobDetailsSkeleton } from "@/components/skeleton-loader"
import { Pagination } from "@/components/pagination"

interface RecommendedJobsProps {
  jobOptions: string[]
  locationOptions: string[]
  savedJobs: string[]
  toggleSaveJob: (jobId: string) => void
}

export function RecommendedJobs({ 
  jobOptions, 
  locationOptions, 
  savedJobs, 
  toggleSaveJob 
}: RecommendedJobsProps) {
  const [recommendedJobs, setRecommendedJobs] = useState<JobWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(5)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Track scroll position for fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Generate a unique ID for a job
  const generateJobId = (job: Job, index: number): string => {
    const baseId = `${job.title}-${job.company}-${job.location}`.replace(/\s+/g, "-").toLowerCase()
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    return `${baseId}-${index}-${uniqueSuffix}`
  }

  // Fetch recommended jobs
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setLoading(true)
      try {
        // Simulate API call with random job titles and locations
        const randomJobs: JobWithId[] = []
        
        // Generate 10 random recommended jobs
        for (let i = 0; i < 10; i++) {
          const randomJobTitle = jobOptions[Math.floor(Math.random() * jobOptions.length)]
          const randomLocation = locationOptions[Math.floor(Math.random() * locationOptions.length)]
          
          const job: Job = {
            title: randomJobTitle,
            company: ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix"][Math.floor(Math.random() * 6)],
            location: randomLocation,
            "job-type": ["Full-time", "Part-time", "Contract"][Math.floor(Math.random() * 3)],
            summary: `This is a great opportunity for a ${randomJobTitle} in ${randomLocation}. Join our team and work on exciting projects.`
          }
          
          randomJobs.push({
            ...job,
            id: generateJobId(job, i)
          })
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setRecommendedJobs(randomJobs)
        if (randomJobs.length > 0) {
          setSelectedJobIndex(0)
        }
      } catch (error) {
        console.error("Error fetching recommended jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecommendedJobs()
  }, [jobOptions, locationOptions])

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = recommendedJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(recommendedJobs.length / jobsPerPage)

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    if (selectedJobIndex !== null) {
      const globalIndex = indexOfFirstJob + (selectedJobIndex % jobsPerPage)
      if (globalIndex < recommendedJobs.length) {
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

  // Handle job selection
  const handleJobSelection = (localIndex: number) => {
    const globalIndex = indexOfFirstJob + localIndex
    setSelectedJobIndex(globalIndex)
  }

  const selectedJob = selectedJobIndex !== null ? recommendedJobs[selectedJobIndex] : null

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Based on your profile, skills, and search history, we've found these jobs that might be a perfect match for you.
        </p>
      </div>

      {/* Job Results Section */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Panel - Job List */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center text-gray-900">
                  Recommended Jobs
                  <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {recommendedJobs.length}
                  </span>
                </h2>
              </div>
              <div>
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <JobCardSkeleton key={i} />
                    ))}
                  </div>
                ) : recommendedJobs.length === 0 ? (
                  <div className="p-8 text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No recommendations yet</h3>
                    <p className="text-gray-500">Complete your profile or search for more jobs to get personalized recommendations</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {currentJobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className={`bg-white border rounded-lg transition-all hover:shadow-md p-4 ${
                          selectedJobIndex === indexOfFirstJob + index ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="cursor-pointer flex-1" onClick={() => handleJobSelection(index)}>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-base truncate text-gray-900">{job.title ?? "N/A"}</h3>
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Recommended</span>
                            </div>
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
                              {savedJobs.includes(job.id) && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                                  <Bookmark className="h-3 w-3 mr-1" />
                                  Saved
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 self-start rounded-md ${
                              savedJobs.includes(job.id) ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
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

              {/* Pagination Controls */}
              {recommendedJobs.length > 0 && (
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

          {/* Right Panel - Job Details */}
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
    </div>
  )
}
