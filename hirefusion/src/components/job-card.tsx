"use client"
import { Building2, MapPin, BookmarkPlus, BookmarkCheck, Bookmark } from "lucide-react"

export interface Job {
  title: string | null
  company: string | null
  location: string | null
  "job-type": string | null
  summary: string | null
}

// Create a unique ID for each job to use for bookmarking
export type JobWithId = Job & { id: string }

interface JobCardProps {
  job: JobWithId
  isSelected: boolean
  isSaved: boolean
  onClick: () => void
  onSave: () => void
}

export function JobCard({ job, isSelected, isSaved, onClick, onSave }: JobCardProps) {
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
