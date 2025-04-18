"use client"
import { X } from "lucide-react"

interface JobFiltersProps {
  jobOptions: string[]
  locationOptions: string[]
  selectedJobs: string[]
  selectedLocations: string[]
  handleJobToggle: (job: string) => void
  handleLocationToggle: (location: string) => void
  filterOpen: boolean
  setFilterOpen: (open: boolean) => void
}

export function MobileFilters({
  jobOptions,
  locationOptions,
  selectedJobs,
  selectedLocations,
  handleJobToggle,
  handleLocationToggle,
  filterOpen,
  setFilterOpen,
}: JobFiltersProps) {
  if (!filterOpen) return null

  return (
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
  )
}

export function DesktopFilters({
  jobOptions,
  locationOptions,
  selectedJobs,
  selectedLocations,
  handleJobToggle,
  handleLocationToggle,
}: Omit<JobFiltersProps, "filterOpen" | "setFilterOpen">) {
  return (
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
  )
}
