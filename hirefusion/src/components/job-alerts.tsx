"use client"
import { useState, useEffect } from "react"
import { Bell, BellOff, Edit, Trash2, Plus, X, AlertTriangle } from "lucide-react"

export interface JobAlert {
  id: string
  name: string
  jobTitle: string
  frequency: "daily" | "weekly" | "instant"
  active: boolean
  createdAt: number
}

interface JobAlertsProps {
  jobOptions: string[]
}

export function JobAlerts({ jobOptions }: JobAlertsProps) {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null)
  const [newAlertName, setNewAlertName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [alertFrequency, setAlertFrequency] = useState<"daily" | "weekly" | "instant">("daily")
  const [showModal, setShowModal] = useState(false)
  const [hasNewAlerts, setHasNewAlerts] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const savedAlerts = localStorage.getItem("jobAlerts")
    if (savedAlerts) {
      setJobAlerts(JSON.parse(savedAlerts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("jobAlerts", JSON.stringify(jobAlerts))
  }, [jobAlerts])

  useEffect(() => {
    const interval = setInterval(() => {
      if (jobAlerts.length > 0 && Math.random() > 0.7) {
        setHasNewAlerts(true)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [jobAlerts])

  const resetForm = () => {
    setNewAlertName("")
    setJobTitle("")
    setAlertFrequency("daily")
    setFormError(null)
  }

  const handleCreateJobAlert = () => {
    if (!newAlertName.trim() || !jobTitle.trim()) {
      setFormError("Please enter both an alert name and job title")
      return
    }

    const newJobAlert: JobAlert = {
      id: Date.now().toString(),
      name: newAlertName,
      jobTitle,
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
    if (!editingAlertId || !newAlertName.trim() || !jobTitle.trim()) {
      setFormError("Please enter both an alert name and job title")
      return
    }

    setJobAlerts((prev) =>
      prev.map((jobAlert) =>
        jobAlert.id === editingAlertId
          ? {
              ...jobAlert,
              name: newAlertName,
              jobTitle,
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
    setJobAlerts((prev) => prev

.filter((jobAlert) => jobAlert.id !== id))
  }

  const handleToggleJobAlert = (id: string) => {
    setJobAlerts((prev) =>
      prev.map((jobAlert) => (jobAlert.id === id ? { ...jobAlert, active: !jobAlert.active } : jobAlert)),
    )
  }

  const handleEditJobAlert = (jobAlert: JobAlert) => {
    setEditingAlertId(jobAlert.id)
    setNewAlertName(jobAlert.name)
    setJobTitle(jobAlert.jobTitle)
    setAlertFrequency(jobAlert.frequency)
    setShowModal(true)
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
    <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20">
      <div className="p-6 border-b border-purple-500/30 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center text-white">
          Job Alerts
          {hasNewAlerts && (
            <span className="ml-2 relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          )}
        </h2>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md"
          onClick={openCreateModal}
        >
          <Plus className="h-5 w-5" />
          New Alert
        </button>
      </div>

      <div className="p-6">
        {hasNewAlerts && (
          <div className="mb-6 p-4 bg-purple-900/50 border border-purple-500/30 rounded-lg flex items-center justify-between transition-all duration-200">
            <div className="flex items-center text-purple-200">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <span>New job matches found for your alerts!</span>
            </div>
            <button
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
              onClick={handleNewAlertsClick}
            >
              View
            </button>
          </div>
        )}

        {jobAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto text-purple-400/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No job alerts yet</h3>
            <p className="text-purple-300 mb-6">Create alerts to get notified about new job postings</p>
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
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
                className={`border border-purple-500/30 rounded-xl p-5 ${
                  jobAlert.active ? "bg-gray-800" : "bg-gray-800/50"
                } transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      {jobAlert.name}
                      {!jobAlert.active && (
                        <span className="ml-2 text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full">Paused</span>
                      )}
                    </h3>
                    <div className="text-sm text-purple-300 mt-1">
                      {jobAlert.frequency === "instant"
                        ? "Instant alerts"
                        : jobAlert.frequency === "daily"
                          ? "Daily digest"
                          : "Weekly digest"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleJobAlert(jobAlert.id)}
                      className={`p-2 rounded-full ${
                        jobAlert.active
                          ? "text-purple-400 hover:bg-purple-900/50"
                          : "text-purple-600 hover:bg-purple-900/50"
                      } transition-all duration-200`}
                      aria-label={jobAlert.active ? "Pause alert" : "Activate alert"}
                    >
                      {jobAlert.active ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleEditJobAlert(jobAlert)}
                      className="p-2 text-purple-400 hover:bg-purple-900/50 rounded-full transition-all duration-200"
                      aria-label="Edit alert"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteJobAlert(jobAlert.id)}
                      className="p-2 text-purple-400 hover:bg-purple-900/50 rounded-full transition-all duration-200"
                      aria-label="Delete alert"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex text-xs bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full">
                    {jobAlert.jobTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-purple-500/30 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-10">
            <div className="p-6 border-b border-purple-500/30 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {isCreating ? "Create New Job Alert" : "Edit Job Alert"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                  setEditingAlertId(null)
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="alert-name" className="block text-sm font-medium text-purple-200 mb-2">
                  Alert Name
                </label>
                <input
                  type="text"
                  id="alert-name"
                  value={newAlertName}
                  onChange={(e) => setNewAlertName(e.target.value)}
                  placeholder="e.g., Frontend Developer Alert"
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-purple-200 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="job-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Frontend Developer"
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Alert Frequency</label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value as "daily" | "weekly" | "instant")}
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-purple-500/30 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                  setEditingAlertId(null)
                }}
                className="px-6 py-3 bg-gray-800 border border-purple-500/50 rounded-lg text-purple-200 hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isCreating ? handleCreateJobAlert : handleUpdateJobAlert}
                className="px-6 py-3 bg-purple-600 border border-purple-500 rounded-lg text-white hover:bg-purple-700 transition-all duration-200"
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