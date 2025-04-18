"use client"
import { Building2, MapPin, BookmarkPlus, BookmarkCheck, DollarSign } from 'lucide-react'

// Define the Job interface directly in this file
export interface Job {
  id: string
  job_title: string
  company_name: string
  job_location: string
  job_type: string
  salary: string
  apply_link: string
  skills_required: string[]
  description: string
  job_link: string
  createdAt: string
  updatedAt: string
}

// We don't need to create a separate ID since the API already provides _id
export type JobWithId = Job

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
          <h3 className="font-semibold text-base truncate text-gray-900">{job.job_title}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Building2 className="h-3 w-3 mr-1" />
            <span className="truncate">{job.company_name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{job.job_location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <DollarSign className="h-3 w-3 mr-1" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{job.job_type}</span>
            {isSaved && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                <BookmarkCheck className="h-3 w-3 mr-1" />
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

export function JobCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
  )
}
