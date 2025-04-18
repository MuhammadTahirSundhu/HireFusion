"use client"
import { useState } from "react"
import type React from "react"

import { FaUserCircle, FaEdit, FaMapMarkerAlt, FaCode, FaSave, FaTimes } from "react-icons/fa"

interface Skill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  current: boolean
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  current: boolean
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "experience" | "education" | "skills">("overview")

  const [profile, setProfile] = useState({
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about:
      "Experienced frontend developer with 5+ years of experience building responsive and accessible web applications. Passionate about user experience and clean code.",
    skills: [
      { id: "1", name: "React", level: "Expert" },
      { id: "2", name: "TypeScript", level: "Advanced" },
      { id: "3", name: "Next.js", level: "Advanced" },
      { id: "4", name: "Tailwind CSS", level: "Expert" },
      { id: "5", name: "Node.js", level: "Intermediate" },
    ] as Skill[],
    experience: [
      {
        id: "1",
        company: "Tech Solutions Inc.",
        position: "Senior Frontend Developer",
        startDate: "2021-03",
        endDate: null,
        description:
          "Leading frontend development for multiple client projects. Implementing responsive designs, optimizing performance, and mentoring junior developers.",
        current: true,
      },
      {
        id: "2",
        company: "WebDev Agency",
        position: "Frontend Developer",
        startDate: "2018-06",
        endDate: "2021-02",
        description:
          "Developed and maintained client websites using React, Redux, and SCSS. Collaborated with designers to implement pixel-perfect UIs.",
        current: false,
      },
    ] as Experience[],
    education: [
      {
        id: "1",
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2014-09",
        endDate: "2018-05",
        current: false,
      },
    ] as Education[],
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    })
  }

  const handleSaveProfile = () => {
    setProfile(editedProfile)
    setIsEditing(false)
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

  const renderSkillLevel = (level: Skill["level"]) => {
    const levels = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
      Expert: 4,
    }

    const dots = []
    for (let i = 0; i < 4; i++) {
      dots.push(
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < levels[level] ? "bg-blue-500 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />,
      )
    }

    return <div className="flex space-x-1">{dots}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
          {isEditing ? (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                <FaSave className="mr-1" /> Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                <FaTimes className="mr-1" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow-md transition-colors"
            >
              <FaEdit />
            </button>
          )}
        </div>

        <div className="relative px-6 py-5">
          <div className="absolute -top-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <FaUserCircle className="h-full w-full" />
            </div>
          </div>

          <div className="ml-36">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedProfile.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editedProfile.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{profile.title}</p>
                <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <FaMapMarkerAlt className="mr-1" />
                    {profile.location}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
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
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About</h2>
              {isEditing ? (
                <textarea
                  name="about"
                  value={editedProfile.about}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{profile.about}</p>
              )}

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Phone:</span> {profile.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Work Experience</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Education</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Skills</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <FaCode className="text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="text-gray-800 dark:text-gray-200">{skill.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{skill.level}</span>
                      {renderSkillLevel(skill.level)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
