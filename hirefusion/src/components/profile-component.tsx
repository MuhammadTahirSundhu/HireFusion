"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Calendar,
  Mail,
  CheckCircle,
  Edit2,
  Plus,
  X,
  Save,
  ChevronRight,
} from "lucide-react"

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
        method: "Post",
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[60vh]"
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </motion.div>
    )
  }

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[60vh]"
      >
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested profile could not be loaded.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6">
      <AnimatePresence>
        {toast && toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            } text-white flex items-center gap-2`}
          >
            {toast.type === "success" ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-7xl mx-auto"
      >
        {/* Header Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-800 dark:to-cyan-700">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

            {isEditing ? (
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-3 rounded-full shadow-lg transition-all"
              >
                <Edit2 className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          <div className="relative px-6 py-5 md:px-8 md:py-6">
            <div className="absolute -top-16 left-6 md:left-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900 dark:to-cyan-900 overflow-hidden shadow-lg"
              >
                <div className="h-full w-full flex items-center justify-center text-purple-600 dark:text-purple-300 text-4xl font-bold">
                  {getInitials(profile.username)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20"></div>
              </motion.div>
            </div>

            <div className="ml-36 md:ml-40 pt-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={editedProfile?.username || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="preferences"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Preferences
                    </label>
                    <textarea
                      id="preferences"
                      name="preferences"
                      value={editedProfile?.preferences || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {profile.username}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 dark:text-gray-400 flex items-center gap-1"
                  >
                    {profile.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Verified User</span>
                      </>
                    ) : (
                      "Unverified User"
                    )}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
                <nav className="space-y-1">
                  {["overview", "experience", "education", "skills"].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {tab === "overview" && <User className="h-5 w-5 mr-3" />}
                      {tab === "experience" && <Briefcase className="h-5 w-5 mr-3" />}
                      {tab === "education" && <GraduationCap className="h-5 w-5 mr-3" />}
                      {tab === "skills" && <Code className="h-5 w-5 mr-3" />}
                      <span className="capitalize">{tab}</span>
                      {activeTab === tab && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </motion.button>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Verification Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profile.isVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Joined</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(profile.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-9"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  {activeTab === "overview" && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm border border-purple-500 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </motion.button>
                        )}
                      </div>

                      {isEditing ? (
                        <textarea
                          name="preferences"
                          value={editedProfile?.preferences || ""}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6"
                        >
                          <p className="text-gray-700 dark:text-gray-300">
                            {profile.preferences || "No preferences provided."}
                          </p>
                        </motion.div>
                      )}

                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Experience</h4>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {profile.experience.length}
                            </p>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Education</h4>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {profile.education.length}
                            </p>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Skills</h4>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {profile.skills.length}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "experience" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm border border-purple-500 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </motion.button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-6">
                          {editedProfile?.experience.map((exp, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-purple-200 dark:border-purple-800 p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Experience {index + 1}
                                </h3>
                                <motion.button
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeExperience(index)}
                                  className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30"
                                >
                                  <X className="h-5 w-5" />
                                </motion.button>
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                                    disabled={exp.current}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <input
                                      type="checkbox"
                                      checked={exp.current}
                                      onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    Current Position
                                  </label>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={addExperience}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl shadow-md"
                          >
                            <Plus className="h-5 w-5" />
                            Add Experience
                          </motion.button>
                        </div>
                      ) : profile.experience && profile.experience.length > 0 ? (
                        <div className="space-y-8">
                          {profile.experience.map((exp, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-cyan-500"
                            >
                              <div className="absolute -left-[6px] top-1.5 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-md"></div>
                              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-md text-gray-800 dark:text-gray-200 mb-2 font-medium">
                                  {exp.company}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                  {exp.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/20 rounded-xl"
                        >
                          <Briefcase className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 mb-4">No work experience added yet.</p>
                          {!isEditing && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setIsEditing(true)
                                addExperience()
                              }}
                              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Add Experience
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === "education" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm border border-purple-500 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </motion.button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-6">
                          {editedProfile?.education.map((edu, index) => (
                            <motion.div
                              key={edu._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-purple-200 dark:border-purple-800 p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Education {index + 1}
                                </h3>
                                <motion.button
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeEducation(index)}
                                  className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30"
                                >
                                  <X className="h-5 w-5" />
                                </motion.button>
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                                    disabled={edu.current}
                                  />
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <input
                                      type="checkbox"
                                      checked={edu.current}
                                      onChange={(e) => handleEducationChange(index, "current", e.target.checked)}
                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    Current
                                  </label>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={addEducation}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl shadow-md"
                          >
                            <Plus className="h-5 w-5" />
                            Add Education
                          </motion.button>
                        </div>
                      ) : profile.education && profile.education.length > 0 ? (
                        <div className="space-y-8">
                          {profile.education.map((edu, index) => (
                            <motion.div
                              key={edu._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-cyan-500"
                            >
                              <div className="absolute -left-[6px] top-1.5 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-md"></div>
                              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {edu.institution}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-md text-gray-800 dark:text-gray-200">
                                  {edu.degree} in {edu.field}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/20 rounded-xl"
                        >
                          <GraduationCap className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 mb-4">No education history added yet.</p>
                          {!isEditing && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setIsEditing(true)
                                addEducation()
                              }}
                              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Add Education
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm border border-purple-500 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </motion.button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          {editedProfile?.skills.map((skill, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                                placeholder="Skill name"
                              />
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeSkill(index)}
                                className="text-rose-500 hover:text-rose-700 p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30"
                              >
                                <X className="h-5 w-5" />
                              </motion.button>
                            </motion.div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={addSkill}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl shadow-md"
                          >
                            <Plus className="h-5 w-5" />
                            Add Skill
                          </motion.button>
                        </div>
                      ) : profile.skills && profile.skills.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                          {profile.skills.map((skill, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, type: "spring" }}
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              }}
                              className="relative group flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border border-purple-200 dark:border-purple-800 shadow-sm transition-all duration-300"
                            >
                              <div className="p-2 mr-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20">
                                <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium text-gray-800 dark:text-white text-lg">{skill.name}</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 dark:from-purple-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/20 rounded-xl"
                        >
                          <Code className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 mb-4">No skills added yet.</p>
                          {!isEditing && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setIsEditing(true)
                                addSkill()
                              }}
                              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Add Skill
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 animate-pulse">
          <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="p-4">
                <div className="h-6 w-32 mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-32 mb-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-20 w-full mb-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-6 w-48 mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
