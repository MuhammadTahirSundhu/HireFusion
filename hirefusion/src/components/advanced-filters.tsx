"use client"
import { useState } from "react"
import { Filter, ChevronDown, ChevronUp, X, Check } from 'lucide-react'

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
  activeFilterCount: number
}

export function AdvancedFilters({
  filterOptions,
  setFilterOptions,
  applyFilters,
  resetFilters,
  activeFilterCount,
}: AdvancedFiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "job-type": true,
    "experience": true,
    "salary": true,
    "skills": false,
    "companies": false,
    "industries": false,
    "remote": false,
    "date-posted": false
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

  const removeFilter = (type: keyof FilterOptions, value: string) => {
    if (type === "salaryRange" || type === "datePosted") return

    setFilterOptions({
      ...filterOptions,
      [type]: (filterOptions[type] as string[]).filter((item) => item !== value),
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button 
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={resetFilters}
            >
              Clear All
            </button>
          )}
          <button
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {filterOptions.jobTypes.map((type) => (
              <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {type}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("jobTypes", type)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.experienceLevels.map((level) => (
              <span key={level} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {level}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("experienceLevels", level)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {skill}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("skills", skill)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.companies.map((company) => (
              <span key={company} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {company}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("companies", company)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.industries.map((industry) => (
              <span key={industry} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {industry}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("industries", industry)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.remoteOptions.map((option) => (
              <span key={option} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {option}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeFilter("remoteOptions", option)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filterOptions.datePosted && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {datePostedOptions.find((o) => o.value === filterOptions.datePosted)?.label}
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleDatePostedChange(null)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filterOptions.salaryRange[0] > 0 || filterOptions.salaryRange[1] < 250000) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {formatSalary(filterOptions.salaryRange[0])} - {formatSalary(filterOptions.salaryRange[1])}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium text-gray-700"
          onClick={() => setMobileFilterOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg">Advanced Filters</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setMobileFilterOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <MobileFilterSection
                title="Job Type"
                options={jobTypeOptions}
                selected={filterOptions.jobTypes}
                onToggle={handleJobTypeToggle}
              />
              <MobileFilterSection
                title="Experience Level"
                options={experienceLevelOptions}
                selected={filterOptions.experienceLevels}
                onToggle={handleExperienceLevelToggle}
              />
              <MobileFilterSection
                title="Skills"
                options={skillOptions}
                selected={filterOptions.skills}
                onToggle={handleSkillToggle}
              />
              <MobileFilterSection
                title="Companies"
                options={companyOptions}
                selected={filterOptions.companies}
                onToggle={handleCompanyToggle}
              />
              <MobileFilterSection
                title="Industries"
                options={industryOptions}
                selected={filterOptions.industries}
                onToggle={handleIndustryToggle}
              />
              <MobileFilterSection
                title="Remote Options"
                options={remoteOptions}
                selected={filterOptions.remoteOptions}
                onToggle={handleRemoteToggle}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date Posted</label>
                <div className="grid grid-cols-2 gap-2">
                  {datePostedOptions.map((option) => (
                    <button
                      key={option.label}
                      className={`px-3 py-1.5 text-sm border rounded-md ${
                        filterOptions.datePosted === option.value
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleDatePostedChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[0]}
                      onChange={(e) => handleSalaryMinChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[1]}
                      onChange={(e) => handleSalaryMaxChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatSalary(filterOptions.salaryRange[0])}</span>
                  <span>{formatSalary(filterOptions.salaryRange[1])}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => {
                    applyFilters()
                    setMobileFilterOpen(false)
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className={`hidden md:block transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-0 overflow-hidden'}`}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Type Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("job-type")}
            >
              Job Type
              {expandedSections["job-type"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["job-type"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {jobTypeOptions.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.jobTypes.includes(type)}
                        onChange={() => handleJobTypeToggle(type)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience Level Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("experience")}
            >
              Experience Level
              {expandedSections["experience"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["experience"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {experienceLevelOptions.map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.experienceLevels.includes(level)}
                        onChange={() => handleExperienceLevelToggle(level)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Salary Range Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("salary")}
            >
              Salary Range
              {expandedSections["salary"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["salary"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[0]}
                      onChange={(e) => handleSalaryMinChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={filterOptions.salaryRange[1]}
                      onChange={(e) => handleSalaryMaxChange(Number(e.target.value))}
                      min="0"
                      max="250000"
                      step="5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatSalary(filterOptions.salaryRange[0])}</span>
                  <span>{formatSalary(filterOptions.salaryRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("skills")}
            >
              Skills
              {expandedSections["skills"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["skills"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Companies Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("companies")}
            >
              Companies
              {expandedSections["companies"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["companies"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {companyOptions.map((company) => (
                    <label key={company} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.companies.includes(company)}
                        onChange={() => handleCompanyToggle(company)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{company}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remote Options Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("remote")}
            >
              Remote Options
              {expandedSections["remote"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["remote"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {remoteOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterOptions.remoteOptions.includes(option)}
                        onChange={() => handleRemoteToggle(option)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Posted Section */}
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50 border-b"
              onClick={() => toggleSection("date-posted")}
            >
              Date Posted
              {expandedSections["date-posted"] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections["date-posted"] && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {datePostedOptions.map((option) => (
                    <button
                      key={option.label}
                      className={`px-3 py-1.5 text-sm border rounded-md ${
                        filterOptions.datePosted === option.value
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
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

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
          <button
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper component for mobile filters
function MobileFilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              selected.includes(option)
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
