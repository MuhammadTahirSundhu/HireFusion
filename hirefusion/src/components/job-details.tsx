"use client"
import { useState } from "react"
import { Building2, MapPin, BookmarkCheck, BookmarkPlus, ExternalLink, DollarSign, Briefcase, Calendar, Award } from 'lucide-react'
import type { Job } from "./job-card"
import { motion, AnimatePresence } from "framer-motion"

interface JobDetailsProps {
  job: Job
  isSaved: boolean
  onSave: () => void
}

export function JobDetails({ job, isSaved, onSave }: JobDetailsProps) {
  const [activeSection, setActiveSection] = useState<"description" | "skills">("description")

  // Format the description with proper line breaks
  const formattedDescription = job.description.split("\n").map((line, i) => (
    <p key={i} className={line.trim() === "" ? "my-2" : ""}>
      {line}
    </p>
  ))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full"
    >
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-start">
          <div>
            <motion.h2 initial={{ y: -10 }} animate={{ y: 0 }} className="text-2xl font-bold text-gray-900">
              {job.job_title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-base mt-1 flex items-center"
            >
              <Building2 className="h-4 w-4 mr-1.5 text-gray-500" />
              {job.company_name}
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className={`p-2.5 rounded-full ${
              isSaved ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          >
            {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg text-gray-700">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{job.job_location}</span>
          </div>
          <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg text-gray-700">
            <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{job.job_type}</span>
          </div>
          <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg text-gray-700">
            <DollarSign className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg text-gray-700">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Section tabs */}
        <div className="flex border-b border-gray-200 mt-6">
          <button
            onClick={() => setActiveSection("description")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === "description"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Job Description
          </button>
          <button
            onClick={() => setActiveSection("skills")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === "skills"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Skills Required
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeSection === "description" && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-600 space-y-2 pt-2"
            >
              {formattedDescription}
            </motion.div>
          )}

          {activeSection === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-2"
            >
              <div className="flex flex-wrap gap-2">
                {job.skills_required.slice(1).map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full flex items-center"
                  >
                    <Award className="h-3.5 w-3.5 mr-1.5" />
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 mt-auto">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium inline-block text-center shadow-sm"
          >
            Apply Now
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={job.job_link}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center text-gray-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Original
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export function JobDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-gray-200 rounded-lg w-28"></div>
          ))}
        </div>

        <div className="flex border-b border-gray-200 mt-6">
          <div className="h-9 bg-gray-200 rounded-lg w-32 mr-4"></div>
          <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
        </div>

        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded-lg"
              style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 mt-auto">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="h-11 bg-gray-200 rounded-lg w-full sm:w-1/2"></div>
          <div className="h-11 bg-gray-200 rounded-lg w-full sm:w-1/2"></div>
        </div>
      </div>

      {/* Animated loading effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}
