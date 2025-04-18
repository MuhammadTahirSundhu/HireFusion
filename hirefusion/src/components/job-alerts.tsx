"use client"
import { useState, useEffect } from "react"
import { Bell, BellOff, Edit, Trash2, Plus, X, AlertTriangle } from "lucide-react"

export interface JobAlert {
  id: string
  name: string
  keywords: string[]
  locations: string[]
  jobTypes: string[]
  experienceLevels: string[]
  salaryMin: number
  salaryMax: number
  frequency: "daily" | "weekly" | "instant"
  active: boolean
  createdAt: number
}

interface JobAlertsProps {
  jobOptions: string[]
  locationOptions: string[]
  jobTypeOptions: string[]
  experienceLevelOptions: string[]
}

export function JobAlerts({ jobOptions, locationOptions, jobTypeOptions, experienceLevelOptions }: JobAlertsProps) {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null)
  const [newAlertName, setNewAlertName] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState(40000)
  const [salaryMax, setSalaryMax] = useState(120000)
  const [alertFrequency, setAlertFrequency] = useState<"daily" | "weekly" | "instant">("daily")
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [hasNewAlerts, setHasNewAlerts] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Load alerts from localStorage on initial render
  useEffect(() => {
    const savedAlerts = localStorage.getItem("jobAlerts")
    if (savedAlerts) {
      setJobAlerts(JSON.parse(savedAlerts))
    }
  }, [])

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jobAlerts", JSON.stringify(jobAlerts))
  }, [jobAlerts])

  // Simulate new alerts (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (jobAlerts.length > 0 && Math.random() > 0.7) {
        setHasNewAlerts(true)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [jobAlerts])

  const resetForm = () => {
    setNewAlertName("")
    setSelectedKeywords([])
    setSelectedLocations([])
    setSelectedJobTypes([])
    setSelectedExperienceLevels([])
    setSalaryMin(40000)
    setSalaryMax(120000)
    setAlertFrequency("daily")
    setKeyword("")
    setLocation("")
    setFormError(null)
  }

  const handleCreateJobAlert = () => {
    // Validate form
    if (!newAlertName.trim()) {
      setFormError("Please enter a name for your alert")
      return
    }

    const newJobAlert: JobAlert = {
      id: Date.now().toString(),
      name: newAlertName,
      keywords: selectedKeywords,
      locations: selectedLocations,
      jobTypes: selectedJobTypes,
      experienceLevels: selectedExperienceLevels,
      salaryMin,
      salaryMax,
      frequency: alertFrequency,
      active: true,
      createdAt: Date.now(),
    }

    setJobAlerts((prev) => [...prev, newJobAlert])
    resetForm()
    setIsCreating(false)
    setShowModal(false)
  }

  const handleUpdateJobAlert = () => {
    if (!editingAlertId || !newAlertName.trim()) {
      setFormError("Please enter a name for your alert")
      return
    }

    setJobAlerts((prev) =>
      prev.map((jobAlert) =>
        jobAlert.id === editingAlertId
          ? {
              ...jobAlert,
              name: newAlertName,
              keywords: selectedKeywords,
              locations: selectedLocations,
              jobTypes: selectedJobTypes,
              experienceLevels: selectedExperienceLevels,
              salaryMin,
              salaryMax,
              frequency: alertFrequency,
            }
          : jobAlert,
      ),
    )
    resetForm()
    setEditingAlertId(null)
    setShowModal(false)
  }

  const handleDeleteJobAlert = (id: string) => {
    setJobAlerts((prev) => prev.filter((jobAlert) => jobAlert.id !== id))
  }

  const handleToggleJobAlert = (id: string) => {
    setJobAlerts((prev) =>
      prev.map((jobAlert) => (jobAlert.id === id ? { ...jobAlert, active: !jobAlert.active } : jobAlert)),
    )
  }

  const handleEditJobAlert = (jobAlert: JobAlert) => {
    setEditingAlertId(jobAlert.id)
    setNewAlertName(jobAlert.name)
    setSelectedKeywords(jobAlert.keywords)
    setSelectedLocations(jobAlert.locations)
    setSelectedJobTypes(jobAlert.jobTypes)
    setSelectedExperienceLevels(jobAlert.experienceLevels)
    setSalaryMin(jobAlert.salaryMin)
    setSalaryMax(jobAlert.salaryMax)
    setAlertFrequency(jobAlert.frequency)
    setShowModal(true)
  }

  const addKeyword = () => {
    if (keyword && !selectedKeywords.includes(keyword)) {
      setSelectedKeywords((prev) => [...prev, keyword])
      setKeyword("")
    }
  }

  const removeKeyword = (kw: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== kw))
  }

  const addLocation = () => {
    if (location && !selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location])
      setLocation("")
    }
  }

  const removeLocation = (loc: string) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== loc))
  }

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleExperienceLevel = (level: string) => {
    setSelectedExperienceLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleNewAlertsClick = () => {
    setHasNewAlerts(false)
  }

  const openCreateModal = () => {
    setIsCreating(true)
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center text-gray-900">
          Job Alerts
          {hasNewAlerts && (
            <span className="ml-2 relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </h2>
        <button
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
          onClick={openCreateModal}
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      </div>

      <div className="p-4">
        {hasNewAlerts && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
            <div className="flex items-center text-blue-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>New job matches found for your alerts!</span>
            </div>
            <button
              className="px-2 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded"
              onClick={handleNewAlertsClick}
            >
              View
            </button>
          </div>
        )}

        {jobAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No job alerts yet</h3>
            <p className="text-gray-500 mb-4">Create alerts to get notified about new job postings</p>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
              onClick={openCreateModal}
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobAlerts.map((jobAlert) => (
              <div
                key={jobAlert.id}
                className={`border rounded-lg p-4 ${
                  jobAlert.active ? "border-gray-200" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {jobAlert.name}
                      {!jobAlert.active && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Paused</span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {jobAlert.frequency === "instant"
                        ? "Instant alerts"
                        : jobAlert.frequency === "daily"
                          ? "Daily digest"
                          : "Weekly digest"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleJobAlert(jobAlert.id)}
                      className={`p-1.5 rounded-md ${
                        jobAlert.active ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"
                      }`}
                      aria-label={jobAlert.active ? "Pause alert" : "Activate alert"}
                    >
                      {jobAlert.active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEditJobAlert(jobAlert)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                      aria-label="Edit alert"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJobAlert(jobAlert.id)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                      aria-label="Delete alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {jobAlert.keywords.length > 0 &&
                    jobAlert.keywords.map((kw) => (
                      <span key={kw} className="inline-flex text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  {jobAlert.locations.length > 0 &&
                    jobAlert.locations.map((loc) => (
                      <span key={loc} className="inline-flex text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {loc}
                      </span>
                    ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formatSalary(jobAlert.salaryMin)} - {formatSalary(jobAlert.salaryMax)}
                  {jobAlert.jobTypes.length > 0 && ` • ${jobAlert.jobTypes.join(", ")}`}
                  {jobAlert.experienceLevels.length > 0 && ` • ${jobAlert.experienceLevels.join(", ")}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for creating/editing alerts */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {isCreating ? "Create New Job Alert" : "Edit Job Alert"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                  setEditingAlertId(null)
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="alert-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Name
                </label>
                <input
                  type="text"
                  id="alert-name"
                  value={newAlertName}
                  onChange={(e) => setNewAlertName(e.target.value)}
                  placeholder="e.g., Frontend Developer in New York"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Add keyword"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addLocation()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {loc}
                      <button
                        type="button"
                        onClick={() => removeLocation(loc)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Types</label>
                <div className="flex flex-wrap gap-2">
                  {jobTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleJobType(type)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedJobTypes.includes(type)
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleExperienceLevel(level)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedExperienceLevels.includes(level)
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(Number.parseInt(e.target.value) || 0)}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(Number.parseInt(e.target.value) || 0)}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatSalary(salaryMin)}</span>
                  <span>{formatSalary(salaryMax)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Frequency</label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value as "daily" | "weekly" | "instant")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                  setEditingAlertId(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isCreating ? handleCreateJobAlert : handleUpdateJobAlert}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {isCreating ? "Create Alert" : "Update Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
