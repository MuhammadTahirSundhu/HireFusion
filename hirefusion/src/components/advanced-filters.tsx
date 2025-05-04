"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"

export interface FilterOptions {
  jobTypes: string[]
  experienceLevels: string[]
  salaryRange: [number, number]
  skills: string[]
  companies: string[]
  industries: string[]
  datePosted: string | null
  remoteOptions: string[]
}

interface AdvancedFiltersProps {
  filterOptions: FilterOptions
  setFilterOptions: (options: FilterOptions) => void
  applyFilters: () => void
  resetFilters: () => void
}

export function AdvancedFilters({ filterOptions, setFilterOptions, applyFilters, resetFilters }: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "job-type": true,
    experience: true,
    salary: true,
    skills: false,
    companies: false,
    industries: false,
    remote: false,
    "date-posted": false,
  })

  const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelance"]

  const experienceLevelOptions = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"]

  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "HTML/CSS",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
  ]

  const companyOptions = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "Spotify",
    "Airbnb",
    "Uber",
    "Twitter",
    "Salesforce",
  ]

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Media",
    "Government",
    "Nonprofit",
    "Transportation",
  ]

  const datePostedOptions = [
    { label: "Any time", value: null },
    { label: "Past 24 hours", value: "24h" },
    { label: "Past week", value: "1w" },
    { label: "Past month", value: "1m" },
  ]

  const remoteOptions = ["Remote", "Hybrid", "On-site"]

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleJobTypeToggle = (type: string) => {
    setFilterOptions({
      ...filterOptions,
      jobTypes: filterOptions.jobTypes.includes(type)
        ? filterOptions.jobTypes.filter((t) => t !== type)
        : [...filterOptions.jobTypes, type],
    })
  }

  const handleExperienceLevelToggle = (level: string) => {
    setFilterOptions({
      ...filterOptions,
      experienceLevels: filterOptions.experienceLevels.includes(level)
        ? filterOptions.experienceLevels.filter((l) => l !== level)
        : [...filterOptions.experienceLevels, level],
    })
  }

  const handleSalaryMinChange = (value: number) => {
    setFilterOptions({
      ...filterOptions,
      salaryRange: [value, filterOptions.salaryRange[1]],
    })
  }

  const handleSalaryMaxChange = (value: number) => {
    setFilterOptions({
      ...filterOptions,
      salaryRange: [filterOptions.salaryRange[0], value],
    })
  }

  const handleSkillToggle = (skill: string) => {
    setFilterOptions({
      ...filterOptions,
      skills: filterOptions.skills.includes(skill)
        ? filterOptions.skills.filter((s) => s !== skill)
        : [...filterOptions.skills, skill],
    })
  }

  const handleCompanyToggle = (company: string) => {
    setFilterOptions({
      ...filterOptions,
      companies: filterOptions.companies.includes(company)
        ? filterOptions.companies.filter((c) => c !== company)
        : [...filterOptions.companies, company],
    })
  }

  const handleIndustryToggle = (industry: string) => {
    setFilterOptions({
      ...filterOptions,
      industries: filterOptions.industries.includes(industry)
        ? filterOptions.industries.filter((i) => i !== industry)
        : [...filterOptions.industries, industry],
    })
  }

  const handleDatePostedChange = (value: string | null) => {
    setFilterOptions({
      ...filterOptions,
      datePosted: value,
    })
  }

  const handleRemoteToggle = (option: string) => {
    setFilterOptions({
      ...filterOptions,
      remoteOptions: filterOptions.remoteOptions.includes(option)
        ? filterOptions.remoteOptions.filter((o) => o !== option)
        : [...filterOptions.remoteOptions, option],
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getActiveFilterCount = () => {
    return (
      filterOptions.jobTypes.length +
      filterOptions.experienceLevels.length +
      filterOptions.skills.length +
      filterOptions.companies.length +
      filterOptions.industries.length +
      filterOptions.remoteOptions.length +
      (filterOptions.datePosted ? 1 : 0) +
      (filterOptions.salaryRange[0] > 0 || filterOptions.salaryRange[1] < 250000 ? 1 : 0)
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/90 backdrop-blur-md rounded-xl shadow-lg shadow-purple-900/20 p-6 border border-purple-900/30">
        <h2 className="text-2xl font-bold text-white mb-4">Advanced Filters</h2>
        <p className="text-gray-400 mb-6">Refine your job search with detailed filters</p>

        {getActiveFilterCount() > 0 && (
          <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-purple-800/30">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-purple-300">Active Filters</h3>
              <button
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                onClick={resetFilters}
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.jobTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {type}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleJobTypeToggle(type)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.experienceLevels.map((level) => (
                <span
                  key={level}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {level}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleExperienceLevelToggle(level)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {skill}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.companies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {company}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleCompanyToggle(company)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.industries.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {industry}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleIndustryToggle(industry)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.remoteOptions.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50"
                >
                  {option}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleRemoteToggle(option)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filterOptions.datePosted && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50">
                  {datePostedOptions.find((o) => o.value === filterOptions.datePosted)?.label}
                  <button
                    className="ml-1 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                    onClick={() => handleDatePostedChange(null)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filterOptions.salaryRange[0] > 0 || filterOptions.salaryRange[1] < 250000) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 border border-purple-700/50">
                  {formatSalary(filterOptions.salaryRange[0])} - {formatSalary(filterOptions.salaryRange[1])}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Type Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("job-type")}
            >
              <span className="text-white">Job Type</span>
              {expandedSections["job-type"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["job-type"] && (
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {jobTypeOptions.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterOptions.jobTypes.includes(type)}
                        onChange={() => handleJobTypeToggle(type)}
                        className="h-4 w-4 text-purple-600 border-gray-700 rounded focus:ring-purple-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience Level Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("experience")}
            >
              <span className="text-white">Experience Level</span>
              {expandedSections["experience"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["experience"] && (
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {experienceLevelOptions.map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterOptions.experienceLevels.includes(level)}
                        onChange={() => handleExperienceLevelToggle(level)}
                        className="h-4 w-4 text-purple-600 border-gray-700 rounded focus:ring-purple-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Salary Range Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("salary")}
            >
              <span className="text-white">Salary Range</span>
              {expandedSections["salary"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["salary"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[0]}
                      onChange={(e) => handleSalaryMinChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-purple-800/50 rounded-md text-sm bg-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[1]}
                      onChange={(e) => handleSalaryMaxChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-purple-800/50 rounded-md text-sm bg-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>{formatSalary(filterOptions.salaryRange[0])}</span>
                  <span>{formatSalary(filterOptions.salaryRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("skills")}
            >
              <span className="text-white">Skills</span>
              {expandedSections["skills"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["skills"] && (
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterOptions.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 text-purple-600 border-gray-700 rounded focus:ring-purple-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Companies Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("companies")}
            >
              <span className="text-white">Companies</span>
              {expandedSections["companies"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["companies"] && (
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {companyOptions.map((company) => (
                    <label key={company} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterOptions.companies.includes(company)}
                        onChange={() => handleCompanyToggle(company)}
                        className="h-4 w-4 text-purple-600 border-gray-700 rounded focus:ring-purple-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {company}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remote Options Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("remote")}
            >
              <span className="text-white">Remote Options</span>
              {expandedSections["remote"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["remote"] && (
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {remoteOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filterOptions.remoteOptions.includes(option)}
                        onChange={() => handleRemoteToggle(option)}
                        className="h-4 w-4 text-purple-600 border-gray-700 rounded focus:ring-purple-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Posted Section */}
          <div className="border border-purple-800/30 rounded-md overflow-hidden bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-700/50">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-purple-900/20 border-b border-purple-800/30"
              onClick={() => toggleSection("date-posted")}
            >
              <span className="text-white">Date Posted</span>
              {expandedSections["date-posted"] ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            {expandedSections["date-posted"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {datePostedOptions.map((option) => (
                    <button
                      key={option.label}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                        filterOptions.datePosted === option.value
                          ? "bg-purple-900/70 border-purple-700 text-purple-100"
                          : "border-gray-700 text-gray-300 hover:bg-purple-900/30 hover:border-purple-700/50"
                      }`}
                      onClick={() => handleDatePostedChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-purple-800/50 rounded-md text-sm font-medium text-gray-300 hover:bg-purple-900/30 hover:text-white transition-all duration-200"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-500 border border-transparent rounded-md text-sm font-medium text-white hover:from-purple-600 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-900/30"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
