"use client"
import { useState, useEffect } from "react"
import { JobCard, JobCardSkeleton, type JobWithId } from "./job-card"
import { JobDetails, JobDetailsSkeleton } from "./job-details"

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobWithId[]>([])
  const [selectedJob, setSelectedJob] = useState<JobWithId | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved jobs from localStorage
    const savedJobsFromStorage = localStorage.getItem("savedJobs")
    if (savedJobsFromStorage) {
      setSavedJobs(new Set(JSON.parse(savedJobsFromStorage)))
    }

    // Fetch jobs from API
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/all-jobs")
        const data = await response.json()
        setJobs(data)

        // Set the first job as selected by default
        if (data.length > 0) {
          setSelectedJob(data[0])
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(Array.from(savedJobs)))
  }, [savedJobs])

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSavedJobs = new Set(prev)
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId)
      } else {
        newSavedJobs.add(jobId)
      }
      return newSavedJobs
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] h-[calc(100vh-4rem)] bg-gray-50">
      <div className="border-r overflow-y-auto">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-lg">Job Listings</h2>
        </div>
        <div className="p-4 space-y-3">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  isSaved={savedJobs.has(job.id)}
                  onClick={() => setSelectedJob(job)}
                  onSave={() => toggleSaveJob(job.id)}
                />
              ))}
        </div>
      </div>
      <div className="bg-white overflow-y-auto">
        {loading ? (
          <JobDetailsSkeleton />
        ) : selectedJob ? (
          <JobDetails
            job={selectedJob}
            isSaved={savedJobs.has(selectedJob.id)}
            onSave={() => toggleSaveJob(selectedJob.id)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
