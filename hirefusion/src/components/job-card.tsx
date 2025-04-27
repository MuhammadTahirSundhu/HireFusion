"use client"
import { useState, useEffect } from "react"
import { Building2, MapPin, BookmarkPlus, BookmarkCheck, DollarSign, Clock } from "lucide-react"
import { useSession } from "next-auth/react"

// Define the Job interface to handle different _id formats
export interface Job {
  _id: { $oid: string } | string | { toString(): string }
  job_title: string
  company_name: string
  job_location: string
  job_type: string
  salary: string
  apply_link: string
  skills_required: string[]
  description: string
  job_link: string
  createdAt?: { $date: { $numberLong: string } }
  updatedAt?: { $date: { $numberLong: string } }
}

export type JobWithId = Job

interface JobCardProps {
  job: JobWithId
  isSelected: boolean
  initialIsSaved?: boolean
  onClick: () => void
  onSave?: (jobId: string, isSaved: boolean) => void
}

export function JobCard({ job, isSelected, initialIsSaved = false, onClick, onSave }: JobCardProps) {
  // Safely extract the _id as a string
  let uniqueId = "N/A"
  if (typeof job._id === "string") {
    uniqueId = job._id
  } else if ("$oid" in job._id) {
    uniqueId = job._id.$oid
  } else if (typeof job._id === "object" && "toString" in job._id) {
    uniqueId = job._id.toString()
  }

  // Get the user's session to retrieve the email
  const { data: session, status } = useSession()
  const userEmail = session?.user?.email

  // Manage local saved state
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Update saved state if initialIsSaved changes
  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

  // Function to handle saving the job
  const handleSave = async () => {
    if (status === "loading" || !userEmail) {
      console.log("User not authenticated or session loading")
      alert("Please sign in to save jobs")
      return
    }

    setIsLoading(true)
    try {
      const endpoint = !isSaved ? "/api/savedjobs/addjob" : "/api/savedjobs/deletejob"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          jobId: uniqueId,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log("Job saved/unsaved successfully:", data)
        setIsSaved(!isSaved)
        if (onSave) {
          onSave(uniqueId, !isSaved)
        }
      } else {
        console.error("Failed to save/unsave job:", data.message)
        alert(data.message || "Failed to update job")
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error)
      alert("An error occurred while updating the job")
    } finally {
      setIsLoading(false)
    }
  }

  // Format the date for display
  const getTimeAgo = () => {
    if (!job.createdAt) return "Recently"

    let timestamp
    if (typeof job.createdAt === "string") {
      timestamp = new Date(job.createdAt).getTime()
    } else if ("$date" in job.createdAt && job.createdAt.$date.$numberLong) {
      timestamp = Number.parseInt(job.createdAt.$date.$numberLong)
    } else {
      return "Recently"
    }

    const now = new Date().getTime()
    const diff = now - timestamp

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days}d ago`

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h ago`

    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes > 0 ? minutes : 1}m ago`
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-900 border rounded-xl transition-all duration-300 p-4 cursor-pointer group ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
          : "border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-purple-900/10 to-purple-600/5 opacity-0 transition-opacity duration-500 ${
          isHovered || isSelected ? "opacity-100" : ""
        }`}
      ></div>

      <div className="flex justify-between relative z-10">
        <div className="flex-1" onClick={onClick}>
          <div className="flex justify-between items-start mb-2">
            <h3
              className={`font-semibold text-base transition-all duration-300 ${
                isSelected ? "text-purple-400" : "text-white group-hover:text-purple-300"
              }`}
            >
              {job.job_title}
            </h3>
            <span
              className={`ml-2 text-xs px-3 py-1 rounded-full border transition-all duration-300 ${
                isSelected
                  ? "bg-purple-900/40 text-purple-300 border-purple-700"
                  : "bg-gray-800 text-gray-300 border-gray-700 group-hover:bg-purple-900/20 group-hover:text-purple-300 group-hover:border-purple-800/50"
              }`}
            >
              {job.job_type}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
            <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-500 group-hover:text-purple-400 transition-colors duration-300" />
            <span className="truncate">{job.company_name}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400 mt-1.5 group-hover:text-gray-300 transition-colors duration-300">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-500 group-hover:text-purple-400 transition-colors duration-300" />
            <span className="truncate">{job.job_location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400 mt-1.5 group-hover:text-gray-300 transition-colors duration-300">
            <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-500 group-hover:text-purple-400 transition-colors duration-300" />
            <span className="truncate">{job.salary}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400 mt-1.5 group-hover:text-gray-300 transition-colors duration-300">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500 group-hover:text-purple-400 transition-colors duration-300" />
            <span className="truncate">{getTimeAgo()}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills_required.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? "bg-purple-900/30 text-purple-300 border-purple-700"
                    : "bg-gray-800 text-gray-300 border-gray-700 group-hover:bg-purple-900/20 group-hover:text-purple-300 group-hover:border-purple-800/50"
                }`}
              >
                {skill}
              </span>
            ))}
            {job.skills_required.length > 3 && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? "bg-purple-900/30 text-purple-400 border-purple-700"
                    : "bg-gray-800 text-gray-400 border-gray-700 group-hover:bg-purple-900/20 group-hover:text-purple-400 group-hover:border-purple-800/50"
                }`}
              >
                +{job.skills_required.length - 3} more
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          className={`p-2 self-start rounded-full transition-all duration-300 ${
            isSaved
              ? "text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
              : "text-gray-500 hover:bg-gray-800 hover:text-purple-400"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          disabled={isLoading}
          title={isSaved ? "Remove from saved jobs" : "Save job"}
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 transform transition-transform duration-300 hover:scale-110" />
          ) : (
            <BookmarkPlus className="h-5 w-5 transform transition-transform duration-300 hover:scale-110" />
          )}
        </button>
      </div>

      {/* New job indicator */}
      {getTimeAgo().includes("h") || getTimeAgo().includes("m") ? (
        <div className="absolute top-0 right-0 mt-1 mr-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
            New
          </span>
        </div>
      ) : null}
    </div>
  )
}

export function JobCardSkeleton() {
  return (
    <div className="border border-gray-800 rounded-xl p-4 bg-gray-900 overflow-hidden relative">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-800/20 to-transparent"></div>

      <div className="flex justify-between">
        <div className="w-full">
          <div className="h-5 bg-gray-800 rounded-md w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-800 rounded-md w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded-md w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded-md w-1/3 mb-2"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-5 bg-gray-800 rounded-full w-16"></div>
            <div className="h-5 bg-gray-800 rounded-full w-16"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
