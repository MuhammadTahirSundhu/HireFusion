"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function SignupForm() {
  // Form values
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

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

      setIsOtpVerified(true)
      window.location.href = "/signin"
    } catch (error: any) {
      setOtpError(error.message)
    } finally {
      setIsOtpSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
          <p className="text-gray-600 mt-1">Enter your information to get started</p>
        </div>
        <div className="p-6">
          {isSubmitted ? (
            <div className="space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p className="ml-3 text-green-700">Your account has been created successfully! Please check your email for the OTP.</p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {otpError && <p className="text-red-500 text-sm text-center">{otpError}</p>}
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isOtpSubmitting}
                >
                  {isOtpSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify OTP"}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formValues.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}