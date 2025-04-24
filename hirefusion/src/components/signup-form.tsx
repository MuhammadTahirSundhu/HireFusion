"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Mail,
  Lock,
  CheckCheck,
  Building,
  Calendar,
  FileText,
  Search,
  Sparkles,
  KeyRound,
  ArrowRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SignupForm() {
  // Form steps
  const [currentStep, setCurrentStep] = useState(0)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Basic info state
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // User profile state
  const [profileValues, setProfileValues] = useState({
    skills: [] as string[],
    experience: [] as {
      company: string
      position: string
      description: string
      startDate: string
      endDate: string
      current: boolean
    }[],
    preferences: "",
    savedJobs: [] as string[],
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ],
  })

  // Initialize with one empty experience
  useEffect(() => {
    if (profileValues.experience.length === 0) {
      setProfileValues((prev) => ({
        ...prev,
        experience: [
          {
            company: "",
            position: "",
            description: "",
            startDate: "",
            endDate: "",
            current: false,
          },
        ],
      }))
    }
  }, [])

  // New skill input
  const [newSkill, setNewSkill] = useState("")

  // Touched state
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [apiError, setApiError] = useState("")

  // OTP state
  const [otp, setOtp] = useState("")
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false)
  const [otpError, setOtpError] = useState("")

  // Validation patterns
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  // Validation errors
  const errors = {
    name: touched.name && formValues.name.trim().length < 2 ? "Name must be at least 2 characters" : "",
    email: touched.email && !emailPattern.test(formValues.email) ? "Please enter a valid email address" : "",
    password:
      touched.password && !passwordPattern.test(formValues.password)
        ? "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
        : "",
    confirmPassword:
      touched.confirmPassword && formValues.password !== formValues.confirmPassword ? "Passwords do not match" : "",
  }

  // Check if form is valid
  const isFormValid =
    formValues.name.trim().length >= 2 &&
    emailPattern.test(formValues.email) &&
    passwordPattern.test(formValues.password) &&
    formValues.password === formValues.confirmPassword

  // Check if profile is valid
  const isProfileValid = () => {
    if (currentStep === 1) {
      return profileValues.skills.length > 0
    } else if (currentStep === 2) {
      return profileValues.experience.every(
        (exp) =>
          exp.company.trim().length > 0 &&
          exp.position.trim().length > 0 &&
          exp.description.trim().length > 0 &&
          exp.startDate.trim().length > 0 &&
          (exp.current || exp.endDate.trim().length > 0),
      )
    } else if (currentStep === 3) {
      return profileValues.education.every(
        (edu) =>
          edu.institution.trim().length > 0 &&
          edu.degree.trim().length > 0 &&
          edu.field.trim().length > 0 &&
          edu.startDate.trim().length > 0 &&
          (edu.current || edu.endDate.trim().length > 0),
      )
    }
    return true
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle profile input change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle experience input change
  const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
    setProfileValues((prev) => {
      const newExperience = [...prev.experience]
      newExperience[index] = {
        ...newExperience[index],
        [field]: value,
      }
      return {
        ...prev,
        experience: newExperience,
      }
    })
  }

  // Add new experience
  const addExperience = () => {
    setProfileValues((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          description: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ],
    }))
  }

  // Remove experience
  const removeExperience = (index: number) => {
    if (profileValues.experience.length > 1) {
      setProfileValues((prev) => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index),
      }))
    }
  }

  // Handle education input change
  const handleEducationChange = (index: number, field: string, value: string | boolean) => {
    setProfileValues((prev) => {
      const newEducation = [...prev.education]
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      }
      return {
        ...prev,
        education: newEducation,
      }
    })
  }

  // Add new education
  const addEducation = () => {
    setProfileValues((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ],
    }))
  }

  // Remove education
  const removeEducation = (index: number) => {
    if (profileValues.education.length > 1) {
      setProfileValues((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      }))
    }
  }

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && profileValues.skills.length < 10 && !profileValues.skills.includes(newSkill.trim())) {
      setProfileValues((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  // Remove skill
  const removeSkill = (skill: string) => {
    setProfileValues((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value

    setOtpValues(newOtpValues)
    setOtp(newOtpValues.join(""))

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // Handle OTP input keydown
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (isFormValid) {
      setIsSubmitting(true)
      setApiError("")

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formValues.name,
            email: formValues.email,
            password: formValues.password,
            ...profileValues,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Something went wrong!")
        }

        setIsSubmitted(true)
      } catch (error: any) {
        setApiError(error.message)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsOtpSubmitting(true)
    setOtpError("")

    try {
      const response = await fetch("/api/verifycode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formValues.name,
          code: otp,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Invalid OTP")
      }
      try {
     
        const res = await fetch("/api/users/addprofile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formValues.email,     // ← identifier
            ...profileValues          // ← skills, experience, preferences, etc.
          }),
        });
    
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error updating profile");
    
        // success handling ...
      } catch (err) {
        console.error(err);
      }
      
      setIsOtpVerified(true)
      window.location.href = "/signin"
    } catch (error: any) {
      setOtpError(error.message)
    } finally {
      setIsOtpSubmitting(false)
    }
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 0 && !isFormValid) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      })
      return
    }

    if (!isProfileValid()) return

    if (currentStep === 3) {
      handleSubmit(new Event("submit") as any)
      return
    }

    setCurrentStep((prev) => prev + 1)

    // Scroll to top of form container
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))

    // Scroll to top of form container
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0
    }
  }

  // Step titles
  const stepTitles = ["Account Information", "Skills", "Experience", "Education"]

  // Step icons
  const stepIcons = [
    <User key="user" className="h-5 w-5" />,
    <Code key="code" className="h-5 w-5" />,
    <Briefcase key="briefcase" className="h-5 w-5" />,
    <GraduationCap key="graduation" className="h-5 w-5" />,
  ]

  // Handle key press for skill input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  // Custom styles to replace global.css dependencies
  const styles = {
    scrollbarThin: {
      scrollbarWidth: "thin",
      msOverflowStyle: "none",
    },
    scrollbarThumb: {
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bfdbfe",
        borderRadius: "20px",
      },
    },
    formField: {
      transition: "all 0.2s ease",
      "&:focus": {
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
        borderColor: "#3b82f6",
      },
    },
    button: {
      transition: "all 0.2s ease",
      "&:hover:not(:disabled)": {
        transform: "translateY(-1px)",
      },
      "&:active:not(:disabled)": {
        transform: "translateY(1px)",
      },
    },
  }

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 p-12"
      style={{ padding: "50px" }}
    >
      {/* Left side - Marketing message */}
      <motion.div
        className={`lg:w-1/2 flex flex-col justify-center items-center p-8 text-white ${isMobile ? "py-10" : "py-20"}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="max-w-xl mx-auto" variants={containerVariants}>
          <motion.div className="flex items-center mb-8" variants={itemVariants}>
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center mr-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #93c5fd, #c4b5fd)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
                animation: "gradient 8s ease infinite",
              }}
            >
              HireFusion
            </h1>
          </motion.div>

          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" variants={itemVariants}>
            Your Career Journey <br />
            <span className="text-blue-300">Starts Here</span>
          </motion.h2>

          <motion.p className="text-xl text-blue-100 mb-8" variants={itemVariants}>
            Join thousands of professionals finding their dream jobs through our AI-powered platform.
          </motion.p>

          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div className="flex items-start" variants={itemVariants}>
              <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <Search className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Smart Job Matching</h3>
                <p className="text-blue-200">
                  Our AI analyzes your skills and preferences to find the perfect job matches.
                </p>
              </div>
            </motion.div>

            <motion.div className="flex items-start" variants={itemVariants}>
              <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Personalized Experience</h3>
                <p className="text-blue-200">Get job recommendations tailored to your unique career path and goals.</p>
              </div>
            </motion.div>

            <motion.div className="flex items-start" variants={itemVariants}>
              <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <Building className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Top Companies</h3>
                <p className="text-blue-200">Access opportunities from thousands of top employers across industries.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="mt-12 flex items-center" variants={itemVariants}>
            <div className="flex -space-x-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-blue-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="ml-4 text-blue-200">Join 10,000+ professionals already on HireFusion</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        className="lg:w-1/2 bg-white rounded-3xl overflow-hidden shadow-2xl"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-2xl mx-auto">
          {!isSubmitted ? (
            <>
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  {stepTitles.map((title, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center ${index <= currentStep ? "text-blue-800" : "text-gray-400"}`}
                    >
                      <div
                        className={`flex items-center justify-center h-8 w-8 rounded-full mb-1 ${
                          index < currentStep
                            ? "bg-blue-800 text-white"
                            : index === currentStep
                              ? "bg-white border-2 border-blue-800 text-blue-800"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {index < currentStep ? <CheckCheck className="h-4 w-4" /> : stepIcons[index]}
                      </div>
                      <span className={`text-xs hidden sm:block ${index <= currentStep ? "font-medium" : ""}`}>
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={formContainerRef}
                className="p-6 max-h-[70vh] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  msOverflowStyle: "none",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && (
                      <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h2 className="text-2xl font-bold text-gray-800" variants={itemVariants}>
                          Create your account
                        </motion.h2>

                        {apiError && (
                          <motion.div
                            className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start"
                            variants={fadeInVariants}
                          >
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <p className="ml-3 text-red-700">{apiError}</p>
                          </motion.div>
                        )}

                        <motion.div className="space-y-4" variants={containerVariants}>
                          <motion.div variants={itemVariants}>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <div className="mt-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formValues.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                              />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <div className="mt-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formValues.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                              />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <div className="mt-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="password"
                                name="password"
                                type="password"
                                value={formValues.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                              />
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm Password
                            </label>
                            <div className="mt-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="pl-10 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                              />
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h2 className="text-2xl font-bold text-gray-800" variants={itemVariants}>
                          What are your skills?
                        </motion.h2>

                        <motion.p className="text-gray-600" variants={itemVariants}>
                          Add up to 10 skills that best describe your expertise.
                        </motion.p>

                        <motion.div className="space-y-4" variants={containerVariants}>
                          <motion.div variants={itemVariants}>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                              Skills
                            </label>
                            <div className="mt-1 flex">
                              <input
                                id="skills"
                                name="skills"
                                placeholder="e.g., React, JavaScript, UI Design"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-grow px-4 py-3 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                                disabled={profileValues.skills.length >= 10}
                              />
                              <button
                                type="button"
                                onClick={addSkill}
                                disabled={profileValues.skills.length >= 10 || !newSkill.trim()}
                                className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                                style={{ transition: "all 0.2s ease" }}
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            </div>
                            {profileValues.skills.length >= 10 && (
                              <p className="text-amber-600 text-sm mt-1">Maximum 10 skills allowed</p>
                            )}
                          </motion.div>

                          <motion.div className="flex flex-wrap gap-2 mt-3" variants={containerVariants}>
                            {profileValues.skills.map((skill, index) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </motion.div>
                            ))}
                          </motion.div>

                          {profileValues.skills.length === 0 && (
                            <motion.p className="text-red-500 text-sm" variants={fadeInVariants}>
                              Please add at least one skill
                            </motion.p>
                          )}
                        </motion.div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h2 className="text-2xl font-bold text-gray-800" variants={itemVariants}>
                          Tell us about your work experience
                        </motion.h2>

                        <motion.p className="text-gray-600" variants={itemVariants}>
                          Share your professional experience and job history.
                        </motion.p>

                        <motion.div className="space-y-6" variants={containerVariants}>
                          {profileValues.experience.map((exp, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 border border-blue-100 rounded-lg bg-blue-50 relative"
                            >
                              {profileValues.experience.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeExperience(index)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label
                                    htmlFor={`company-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Company
                                  </label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <Building className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      id={`company-${index}`}
                                      value={exp.company}
                                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                      placeholder="Company name"
                                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`position-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Position
                                  </label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      id={`position-${index}`}
                                      value={exp.position}
                                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                                      placeholder="Job title"
                                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                </div>

                                <div className="md:col-span-2">
                                  <label
                                    htmlFor={`description-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Description
                                  </label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                      id={`description-${index}`}
                                      value={exp.description}
                                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                      placeholder="Describe your responsibilities and achievements"
                                      rows={3}
                                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`startDate-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Start Date
                                  </label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      id={`startDate-${index}`}
                                      type="month"
                                      value={exp.startDate}
                                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center mt-4">
                                  <input
                                    id={`current-${index}`}
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                                    I currently work here
                                  </label>
                                </div>

                                {!exp.current && (
                                  <div>
                                    <label
                                      htmlFor={`endDate-${index}`}
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      End Date
                                    </label>
                                    <div className="mt-1 relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <input
                                        id={`endDate-${index}`}
                                        type="month"
                                        value={exp.endDate}
                                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                        className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ transition: "all 0.2s ease" }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}

                          <motion.button
                            type="button"
                            onClick={addExperience}
                            className="w-full py-2 px-4 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ transition: "all 0.2s ease" }}
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Another Experience
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h2 className="text-2xl font-bold text-gray-800" variants={itemVariants}>
                          Education
                        </motion.h2>

                        <motion.p className="text-gray-600" variants={itemVariants}>
                          Add your educational background.
                        </motion.p>

                        <motion.div className="space-y-6" variants={containerVariants}>
                          {profileValues.education.map((edu, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 border border-blue-100 rounded-lg bg-blue-50 relative"
                            >
                              {profileValues.education.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEducation(index)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label
                                    htmlFor={`institution-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Institution
                                  </label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <GraduationCap className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      id={`institution-${index}`}
                                      value={edu.institution}
                                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                      placeholder="University name"
                                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`degree-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Degree
                                  </label>
                                  <input
                                    id={`degree-${index}`}
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                    placeholder="Bachelor's, Master's, etc."
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ transition: "all 0.2s ease" }}
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`field-${index}`} className="block text-sm font-medium text-gray-700">
                                    Field of Study
                                  </label>
                                  <input
                                    id={`field-${index}`}
                                    value={edu.field}
                                    onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                                    placeholder="Computer Science, Business, etc."
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ transition: "all 0.2s ease" }}
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`startDate-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Start Date
                                  </label>
                                  <input
                                    id={`startDate-${index}`}
                                    type="month"
                                    value={edu.startDate}
                                    onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ transition: "all 0.2s ease" }}
                                  />
                                </div>

                                <div className="flex items-center mt-4">
                                  <input
                                    id={`current-${index}`}
                                    type="checkbox"
                                    checked={edu.current}
                                    onChange={(e) => handleEducationChange(index, "current", e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                                    Currently studying here
                                  </label>
                                </div>

                                {!edu.current && (
                                  <div>
                                    <label
                                      htmlFor={`endDate-${index}`}
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      End Date
                                    </label>
                                    <input
                                      id={`endDate-${index}`}
                                      type="month"
                                      value={edu.endDate}
                                      onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                                      className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ transition: "all 0.2s ease" }}
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}

                          <motion.button
                            type="button"
                            onClick={addEducation}
                            className="w-full py-2 px-4 border border-blue-300 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ transition: "all 0.2s ease" }}
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Another Education
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className={`py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                    currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-700 hover:bg-blue-50"
                  }`}
                  whileHover={currentStep !== 0 ? { scale: 1.05 } : {}}
                  whileTap={currentStep !== 0 ? { scale: 0.95 } : {}}
                  style={{ transition: "all 0.2s ease" }}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 0 && !isFormValid) || (currentStep === 3 && isSubmitting) || !isProfileValid()
                  }
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transition: "all 0.2s ease" }}
                >
                  {currentStep === 3 ? (
                    isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                    )
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                  {currentStep === 3 ? (isSubmitting ? "Submitting..." : "Submit") : ""}
                </motion.button>
              </div>
            </>
          ) : (
            <div className="p-6 space-y-5">
              {/* Modern OTP Verification UI */}
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="h-8 w-8 text-white" />
                </div>

                <motion.h2
                  className="text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Verify your email
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-6 max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  We've sent a verification code to{" "}
                  <span className="font-medium text-blue-600">{formValues.email}</span>
                </motion.p>
              </motion.div>

              {otpError && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="ml-3 text-red-700">{otpError}</p>
                </motion.div>
              )}

              <motion.form
                onSubmit={handleOtpSubmit}
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="flex justify-center space-x-2" variants={itemVariants}>
                  {otpValues.map((digit, index) => (
                    <motion.input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      style={{ transition: "all 0.2s ease" }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                    />
                  ))}
                </motion.div>

                <motion.div className="flex flex-col items-center" variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full max-w-xs py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                    disabled={isOtpSubmitting || otpValues.join("").length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ transition: "all 0.2s ease" }}
                  >
                    {isOtpSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>

                  <motion.p
                    className="mt-6 text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Didn't receive the code?{" "}
                    <button type="button" className="text-blue-600 font-medium hover:underline">
                      Resend
                    </button>
                  </motion.p>
                </motion.div>
              </motion.form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
