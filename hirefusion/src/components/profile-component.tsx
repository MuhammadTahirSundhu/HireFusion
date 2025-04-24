"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Skill {
  name: string
}

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  current: boolean
}

interface Education {
  _id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  current: boolean
}

interface UserProfile {
  _id?: string
  username: string
  email: string
  isVerified: boolean
  skills: Skill[]
  education: Education[]
  experience: Experience[]
  createdAt: string
  updatedAt: string
  preferences?: string
}

export default function ProfileComponent() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        setError("Please sign in to view your profile.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const email = session.user.email
        console.log("Fetching profile for email:", email)
        const response = await fetch(`/api/users/getuser?email=${encodeURIComponent(email)}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        const profileData: UserProfile = {
          ...data.profile,
          skills: data.profile.skills.map((skill: string) => ({ name: skill })),
          experience: JSON.parse(data.profile.experience || "[]"),
          education: data.profile.education || [],
          preferences: data.profile.preferences || "",
        }

        setProfile(profileData)
        setEditedProfile(profileData)
        setError(null)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError(error instanceof Error ? error.message : "Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedProfile) return

    const { name, value } = e.target
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    })
  }

  const handleSkillChange = (index: number, value: string) => {
    if (!editedProfile) return
    const newSkills = [...editedProfile.skills]
    newSkills[index] = { name: value }
    setEditedProfile({ ...editedProfile, skills: newSkills })
  }

  const addSkill = () => {
    if (!editedProfile) return
    setEditedProfile({
      ...editedProfile,
      skills: [...editedProfile.skills, { name: "" }],
    })
  }

  const removeSkill = (index: number) => {
    if (!editedProfile) return
    const newSkills = editedProfile.skills.filter((_, i) => i !== index)
    setEditedProfile({ ...editedProfile, skills: newSkills })
  }

  const handleEducationChange = (index: number, field: string, value: string | boolean) => {
    if (!editedProfile) return
    const newEducation = [...editedProfile.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setEditedProfile({ ...editedProfile, education: newEducation })
  }

  const addEducation = () => {
    if (!editedProfile) return
    setEditedProfile({
      ...editedProfile,
      education: [
        ...editedProfile.education,
        {
          _id: `temp-${Date.now()}`,
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    if (!editedProfile) return
    const newEducation = editedProfile.education.filter((_, i) => i !== index)
    setEditedProfile({ ...editedProfile, education: newEducation })
  }

  const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
    if (!editedProfile) return
    const newExperience = [...editedProfile.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setEditedProfile({ ...editedProfile, experience: newExperience })
  }

  const addExperience = () => {
    if (!editedProfile) return
    setEditedProfile({
      ...editedProfile,
      experience: [
        ...editedProfile.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        },
      ],
    })
  }

  const removeExperience = (index: number) => {
    if (!editedProfile) return
    const newExperience = editedProfile.experience.filter((_, i) => i !== index)
    setEditedProfile({ ...editedProfile, experience: newExperience })
  }

  const handleSaveProfile = async () => {
    if (!editedProfile || !session?.user?.email) return

    try {
      const response = await fetch("/api/users/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: session.user.email,
          username: editedProfile.username,
          preferences: editedProfile.preferences,
          skills: editedProfile.skills.map((skill) => skill.name),
          education: editedProfile.education,
          experience: editedProfile.experience,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedData = await response.json()
      const updatedProfile: UserProfile = {
        ...updatedData.profile,
        skills: updatedData.profile.skills.map((skill: string) => ({ name: skill })),
        experience: updatedData.profile.experience,
        education: updatedData.profile.education || [],
        preferences: updatedData.profile.preferences || "",
      }

      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setIsEditing(false)
      setToast({
        visible: true,
        message: "Profile updated successfully",
        type: "success",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      setToast({
        visible: true,
        message: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        type: "error",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The requested profile could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {toast && toast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
          {isEditing ? (
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="relative px-6 py-5">
          <div className="absolute -top-16 left-6">
            <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-4xl font-bold">
                {getInitials(profile.username)}
              </div>
            </div>
          </div>

          <div className="ml-36 pt-2">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={editedProfile?.username || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedProfile?.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferences
                  </label>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={editedProfile?.preferences || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
                <p className="text-gray-600 dark:text-gray-400">{profile.isVerified ? "Verified User" : "Unverified User"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {profile.email}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "experience"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "education"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "skills"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("skills")}
            >
              Skills
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
              {isEditing ? (
                <textarea
                  name="preferences"
                  value={editedProfile?.preferences || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {profile.preferences || "No preferences provided."}
                </p>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Profile Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Verification Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profile.isVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Joined</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm border border-blue-500 px-3 py-1 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  {editedProfile?.experience.map((exp, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Experience {index + 1}</h3>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Position
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={exp.endDate || ""}
                            onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                              className="h-4 w-4 text-blue-600"
                            />
                            Current
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                  </button>
                </div>
              ) : profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-8">
                  {profile.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      <p className="text-md text-gray-800 dark:text-gray-200 mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No work experience added yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm border border-blue-500 px-3 py-1 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  {editedProfile?.education.map((edu, index) => (
                    <div key={edu._id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education {index + 1}</h3>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Field
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={edu.endDate || ""}
                            onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={edu.current}
                              onChange={(e) => handleEducationChange(index, "current", e.target.checked)}
                              className="h-4 w-4 text-blue-600"
                            />
                            Current
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Education
                  </button>
                </div>
              ) : profile.education && profile.education.length > 0 ? (
                <div className="space-y-8">
                  {profile.education.map((edu) => (
                    <div
                      key={edu._id}
                      className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </span>
                        </div>
                      </div>
                      <p className="text-md text-gray-800 dark:text-gray-200">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No education history added yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm border border-blue-500 px-3 py-1 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {editedProfile?.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        placeholder="Skill name"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              ) : profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="relative group flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 border border-blue-300 dark:border-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500 dark:text-blue-300 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <span className="font-semibold text-gray-800 dark:text-white text-lg">{skill.name}</span>
                      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-6 pt-20">
          <div className="absolute -top-16 left-10">
            <div className="h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div className="ml-36">
            <div className="h-8 w-48 mb-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-32 mb-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex gap-4">
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-10 w-full mb-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="h-6 w-32 mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-20 w-full mb-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-48 mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="space-y-3">
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}