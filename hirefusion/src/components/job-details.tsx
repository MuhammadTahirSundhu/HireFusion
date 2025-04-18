"use client"
import { Building2, MapPin, Clock, Briefcase, BookmarkCheck, BookmarkPlus, ExternalLink } from "lucide-react"
import type { JobWithId } from "./job-card"

interface JobDetailsProps {
  job: JobWithId
  isSaved: boolean
  onSave: () => void
}

export function JobDetails({ job, isSaved, onSave }: JobDetailsProps) {
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
