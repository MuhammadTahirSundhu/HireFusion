"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  AlertCircle,
  Loader2,
  Briefcase,
  Mail,
  Lock,
  Building,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SigninForm() {
  // Form state
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

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

  // Validation patterns
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Validation errors
  const errors = {
    email: touched.email && !emailPattern.test(formValues.email) ? "Please enter a valid email address" : "",
    password: touched.password && formValues.password.trim().length < 1 ? "Password is required" : "",
  }

  // Check if form is valid
  const isFormValid = emailPattern.test(formValues.email) && formValues.password.trim().length > 0

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    })

    if (!isFormValid) return

    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email: formValues.email,
        password: formValues.password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password.")
        setLoading(false)
      } else if (res?.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          const destination = searchParams.get("redirect") || "/home"
          router.push(destination)
        }, 1500)
      } else {
        throw new Error("Unexpected error occurred")
      }
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.")
      setLoading(false)
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

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-900 to-blue-950"
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
            Welcome Back to <br />
            <span className="text-blue-300">Your Career Journey</span>
          </motion.h2>

          <motion.p className="text-xl text-blue-100 mb-8" variants={itemVariants}>
            Sign in to access your personalized job recommendations and career opportunities.
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
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div
                key="signin-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 md:p-12"
              >
                <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.h2 className="text-3xl font-bold text-gray-800 mb-8" variants={itemVariants}>
                    Sign in to your account
                  </motion.h2>

                  {error && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start"
                      variants={fadeInVariants}
                    >
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <p className="ml-3 text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
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

                    <motion.div className="flex items-center justify-between" variants={itemVariants}>
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot your password?
                        </a>
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                      disabled={loading || !isFormValid}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ transition: "all 0.2s ease" }}
                      variants={itemVariants}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>

                  <motion.div className="relative my-8" variants={itemVariants}>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-2 gap-3" variants={containerVariants}>
                    <motion.button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                      Google
                    </motion.button>
                    <motion.button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </motion.button>
                  </motion.div>

                  <motion.p className="mt-8 text-center text-sm text-gray-600" variants={itemVariants}>
                    Don't have an account?{" "}
                    <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign up now
                    </a>
                  </motion.p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center h-full"
              >
                <motion.div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                >
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold text-gray-800 mb-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Sign in successful!
                </motion.h2>
                <motion.p
                  className="text-gray-600 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Redirecting you to your dashboard...
                </motion.p>
                <motion.div
                  className="mt-6 w-12 h-1 bg-blue-600 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
