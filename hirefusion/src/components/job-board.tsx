"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { JobCard, JobCardSkeleton, type JobWithId } from "./job-card"
import { JobDetails, JobDetailsSkeleton } from "./job-details"

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobWithId[]>([])
  const [selectedJob, setSelectedJob] = useState<JobWithId | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  const { data: session, status } = useSession()
  const userEmail = session?.user?.email

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fetch jobs and saved jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/jobs/all-jobs")
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const data = await response.json()
        console.log("Fetched jobs:", data)
        setJobs(data)

        if (data.length > 0) {
          setSelectedJob(data[0])
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchSavedJobs = async () => {
      if (status === "authenticated" && userEmail) {
        try {
          const response = await fetch(`/api/savedjobs/getallsavedjobs?email=${encodeURIComponent(userEmail)}`)
          if (response.ok) {
            const data = await response.json()
            setSavedJobs(new Set(data.savedJobs || []))
          } else {
            console.error("Failed to fetch saved jobs:", await response.json())
          }
        } catch (error) {
          console.error("Error fetching saved jobs:", error)
        }
      }
    }

    Promise.all([fetchJobs(), fetchSavedJobs()])
  }, [status, userEmail])

  // Handle saving/unsaving a job
  const handleSaveJob = async (jobId: string, isSaved: boolean) => {
    if (status !== "authenticated") {
      alert("Please sign in to save jobs")
      return
    }

    // Optimistically update UI
    setSavedJobs((prev) => {
      const newSavedJobs = new Set(prev)
      if (isSaved) {
        newSavedJobs.add(jobId)
      } else {
        newSavedJobs.delete(jobId)
      }
      return newSavedJobs
    })

    // Update on server
    try {
      const endpoint = isSaved ? "/api/savedjobs/addjob" : "/api/savedjobs/deletejob"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          jobId,
        }),
      })

      if (!response.ok) {
        // Revert on failure
        setSavedJobs((prev) => {
          const newSavedJobs = new Set(prev)
          if (isSaved) {
            newSavedJobs.delete(jobId)
          } else {
            newSavedJobs.add(jobId)
          }
          return newSavedJobs
        })
        console.error("Failed to update saved job:", await response.json())
      }
    } catch (error) {
      console.error("Error updating saved job:", error)
    }
  }

  // Get job ID helper function
  const getJobId = (job: JobWithId): string => {
    if (typeof job._id === "string") {
      return job._id
    } else if ("$oid" in job._id) {
      return job._id.$oid
    } else if (typeof job._id === "object" && "toString" in job._id) {
      return job._id.toString()
    }
    return "N/A"
  }

  // Filter jobs based on search and saved status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSaved = !showSavedOnly || savedJobs.has(getJobId(job))

    return matchesSearch && matchesSaved
  })

  // Scroll to details on mobile when a job is selected
  useEffect(() => {
    if (isMobile && selectedJob && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [selectedJob, isMobile])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header and Search */}
      <div className="p-4 border-b border-gray-800 bg-black sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <h1 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse">
          Job Board
        </h1>

        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow group">
            <input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-purple-500/20"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-purple-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              showSavedOnly
                ? "bg-purple-600 text-white shadow-purple-500/50"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-purple-400 hover:shadow-purple-500/20"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 mr-2 ${showSavedOnly ? "text-white" : "text-gray-400"}`}
              fill={showSavedOnly ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {showSavedOnly ? "Showing Saved" : "Show Saved"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-medium text-sm transition-all duration-300 relative ${
              activeTab === "all" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            All Jobs
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full animate-[pulse_2s_ease-in-out_infinite]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("recommended")}
            className={`px-4 py-2 font-medium text-sm transition-all duration-300 relative ${
              activeTab === "recommended" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <span className="flex items-center">
              Recommended
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>
            {activeTab === "recommended" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full animate-[pulse_2s_ease-in-out_infinite]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 font-medium text-sm transition-all duration-300 relative ${
              activeTab === "trending" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Trending
            {activeTab === "trending" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full animate-[pulse_2s_ease-in-out_infinite]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] lg:grid-cols-[400px_1fr] min-h-[calc(100vh-12rem)]">
        {/* Job listings */}
        <div className="border-r border-gray-800 overflow-y-auto max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-gray-800 bg-black sticky top-0 z-10 backdrop-blur-md bg-opacity-80 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-white">Job Listings</h2>
            <span className="text-xs bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full border border-purple-800">
              {filteredJobs.length} jobs
            </span>
          </div>
          <div className="p-4 space-y-4">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => <JobCardSkeleton key={i} />)
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-1">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const jobId = getJobId(job)
                return (
                  <div
                    key={jobId}
                    className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                    style={{
                      opacity: 0,
                      animation: "fadeIn 0.5s forwards",
                      animationDelay: `${filteredJobs.indexOf(job) * 0.05}s`,
                    }}
                  >
                    <JobCard
                      job={job}
                      isSelected={selectedJob ? getJobId(selectedJob) === jobId : false}
                      initialIsSaved={savedJobs.has(jobId)}
                      onClick={() => setSelectedJob(job)}
                      onSave={(id, isSaved) => handleSaveJob(id, isSaved)}
                    />
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Job details */}
        <div ref={detailsRef} className="bg-black overflow-y-auto max-h-[calc(100vh-12rem)]">
          {loading ? (
            <JobDetailsSkeleton />
          ) : selectedJob ? (
            <div
              style={{
                opacity: 0,
                animation: "fadeIn 0.5s forwards",
              }}
            >
              <JobDetails
                job={selectedJob}
                isSaved={savedJobs.has(getJobId(selectedJob))}
                onSave={() => handleSaveJob(getJobId(selectedJob), !savedJobs.has(getJobId(selectedJob)))}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">Select a job</h3>
                <p className="text-gray-500 max-w-md">Choose a job from the list to view its details and apply</p>
              </div>
            </div>
          )}
        </div>
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
      `}</style>
    </div>
  )
}
