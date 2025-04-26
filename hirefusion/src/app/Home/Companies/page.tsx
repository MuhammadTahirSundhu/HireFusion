 "use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import CompanyGrid from "@/components/company-grid"
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Star,
  Users,
  ArrowUpRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { url } from "inspector"

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Featured companies for the showcase section
  const featuredCompanies = [
    {
      id: 1,
      name: "Systems Limited",
      logo: "💻",
      description: "Leading technology and business process outsourcing company",
      employees: "1000+",
      industry: "Technology",
      location: "Lahore, Pakistan",
      rating: 4.7,
      comp_url: "https://www.systemsltd.com",
  
    },
    {
      id: 2,
      name: "Habib Bank Limited",
      logo: "🏦",
      description: "Pakistan's largest banking network with international presence",
      employees: "10000+",
      industry: "Finance",
      location: "Karachi, Pakistan",
      rating: 4.5,
      comp_url: "https://www.systemsltd.com",

    },
    {
      id: 3,
      name: "Jazz",
      logo: "📱",
      description: "Pakistan's leading digital communications company",
      employees: "5000+",
      industry: "Telecommunications",
      location: "Islamabad, Pakistan",
      rating: 4.6,
      comp_url: "https://www.systemsltd.com",

    },
  ]

  // Industry filters
  const industryFilters = [
    { id: "all", name: "All Industries", icon: <Building2 className="h-4 w-4" /> },
    { id: "technology", name: "Technology", icon: <Briefcase className="h-4 w-4" /> },
    { id: "finance", name: "Finance", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "telecom", name: "Telecommunications", icon: <Users className="h-4 w-4" /> },
    { id: "energy", name: "Energy", icon: <Star className="h-4 w-4" /> },
    { id: "retail", name: "Retail", icon: <MapPin className="h-4 w-4" /> },
  ]

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouching) return // Skip if currently touching (prevents conflicts)

      const rect = container.getBoundingClientRect()
      // Calculate mouse position relative to the container (0-100)
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPointerPosition({ x, y })
    }

    // Handle touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsTouching(true)
        const touch = e.touches[0]
        const rect = container.getBoundingClientRect()
        // Calculate touch position relative to the container (0-100)
        const x = ((touch.clientX - rect.left) / rect.width) * 100
        const y = ((touch.clientY - rect.top) / rect.height) * 100
        setPointerPosition({ x, y })
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      setIsTouching(true)
      handleTouchMove(e) // Process the initial touch position
    }

    const handleTouchEnd = () => {
      setIsTouching(false)
    }

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd)
    container.addEventListener("touchcancel", handleTouchEnd)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [isTouching])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-900 dark:to-gray-900 relative overflow-hidden"
      style={
        {
          "--mouse-x": `${pointerPosition.x}%`,
          "--mouse-y": `${pointerPosition.y}%`,
          "--touch-active": isTouching ? "1" : "0",
        } as React.CSSProperties
      }
    >
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 h-1 bg-purple-600 z-50" style={{ width: `${scrollProgress}%` }}></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-300 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>

        {/* Animated lines */}
        <div className="animated-lines">
          <div className="line line-1 mouse-reactive"></div>
          <div className="line line-2 mouse-reactive"></div>
          <div className="line line-3 mouse-reactive"></div>
          <div className="line line-4 mouse-reactive"></div>
          <div className="line line-5 mouse-reactive"></div>
          <div className="line line-6 mouse-reactive"></div>
          <div className="diagonal-line diagonal-line-1 mouse-reactive"></div>
          <div className="diagonal-line diagonal-line-2 mouse-reactive"></div>
          <div className={`pointer-follower ${isTouching ? "touch-active" : ""}`}></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/5 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-float-slow"></div>
        <div className="absolute top-3/4 left-2/3 w-16 h-16 bg-purple-300 rounded-full opacity-30 animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-float-fast"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-float-medium"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={headerVariants}>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500 mb-6">
            Explore Companies
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover top companies hiring in Pakistan. Explore company profiles, read reviews, and find your dream job
            at leading organizations.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full py-4 px-4 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mr-2 rounded-md transition-all"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Industry filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {industryFilters.map((filter) => (
              <motion.button
                key={filter.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeFilter === filter.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                }`}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.icon}
                <span>{filter.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Companies Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Companies</h2>
            <Link
              href="/companies/featured"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center group"
            >
              <span>View all</span>
              <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <motion.div
                key={company.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * company.id }}
              >
                {/* Company header with gradient */}
                <div className="h-24 bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50"></div>
                  <div className="absolute top-1/2 left-6 transform -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                    {company.logo}
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-50 rounded-full px-2 py-1 text-xs flex items-center shadow-md">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="#eab308" />
                    <span className="text-yellow-700">{company.rating}</span>
                  </div>
                </div>

                {/* Company content */}
                <div className="p-6 pt-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{company.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full">
                      <Building2 className="h-3 w-3 mr-1 text-blue-600" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-full">
                      <MapPin className="h-3 w-3 mr-1 text-purple-600" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full">
                      <Users className="h-3 w-3 mr-1 text-green-600" />
                      <span>{company.employees}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      href={company.comp_url}
                      target="_blank"
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center group"
                    >
                      <span>Company Profile</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                    <Link
                      href={`/companies/${company.id}/jobs`}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
                    >
                      View Jobs
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-16 bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Pakistan's Leading Job Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-4xl font-bold text-amber-600 mb-2">25K+</div>
              <div className="text-gray-600">Successful Hires</div>
            </div>
          </div>
        </motion.div>

        {/* All Companies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Companies</h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Sort by</span>
              </button>
            </div>
          </div>

          <CompanyGrid searchQuery={searchQuery} industryFilter={activeFilter} />
        </motion.div>

        {/* Join as Employer CTA */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="md:flex items-center">
            <div className="p-8 md:w-2/3">
              <div className="text-purple-200 text-sm font-semibold tracking-wider mb-2">FOR EMPLOYERS</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Join HireFusion as an Employer</h3>
              <p className="text-purple-100 mb-6">
                Post jobs, find top talent, and build your employer brand with HireFusion. Connect with thousands of
                qualified candidates today.
              </p>
              <motion.button
                className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ChevronRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-600 z-10 md:hidden"></div>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Employer Services"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute animate-ping-slow opacity-70 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute animate-ping-slow animation-delay-1000 opacity-70 w-24 h-24 rounded-full bg-white top-4 left-4"></div>
                  <div className="relative z-20 text-purple-700 font-bold text-xl">EMPLOYER</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
