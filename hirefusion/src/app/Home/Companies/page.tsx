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
      comp_url: "https://www.hbl.com",
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
      comp_url: "https://www.jazz.com.pk",
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

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouching) return
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPointerPosition({ x, y })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsTouching(true)
        const touch = e.touches[0]
        const rect = container.getBoundingClientRect()
        const x = ((touch.clientX - rect.left) / rect.width) * 100
        const y = ((touch.clientY - rect.top) / rect.height) * 100
        setPointerPosition({ x, y })
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      setIsTouching(true)
      handleTouchMove(e)
    }

    const handleTouchEnd = () => {
      setIsTouching(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd)
    container.addEventListener("touchcancel", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [isTouching])

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
      className="min-h-screen bg-black relative overflow-hidden"
      style={
        {
          "--mouse-x": `${pointerPosition.x}%`,
          "--mouse-y": `${pointerPosition.y}%`,
          "--touch-active": isTouching ? "1" : "0",
        } as React.CSSProperties
      }
    >
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 h-0.5 bg-purple-600 z-50" style={{ width: `${scrollProgress}%` }}></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={headerVariants}>
          <h1 className="text-3xl md:text-4xl font-semibold text-purple-100 mb-4">
            Explore Top Companies
          </h1>
          <p className="text-base text-purple-200 max-w-xl mx-auto mb-8">
            Connect with leading organizations hiring in Pakistan.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-8 group">
            <div className="absolute inset-0 bg-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-gray-900 rounded-lg shadow-md border border-purple-700">
              <Search className="h-5 w-5 text-purple-400 ml-4" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full py-3 px-4 bg-transparent text-purple-100 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <motion.button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 mr-2 rounded-md text-sm transition-all"
                  onClick={() => setSearchQuery("")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>

          {/* Industry filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {industryFilters.map((filter) => (
              <motion.button
                key={filter.id}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                  activeFilter === filter.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-900 text-purple-300 border border-purple-700 hover:bg-purple-800"
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
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-100">Featured Companies</h2>
            <Link
              href="/companies/featured"
              className="text-purple-400 hover:text-purple-300 flex items-center group text-sm"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <motion.div
                key={company.id}
                className="relative bg-gray-900 rounded-lg shadow-md border border-purple-700 group"
                whileHover={{ y: -4, boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * company.id }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center text-2xl border border-purple-600">
                      {company.logo}
                    </div>
                    <div className="bg-purple-900 rounded-full px-2 py-1 flex items-center text-xs">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" fill="#facc15" />
                      <span className="text-yellow-400">{company.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-purple-100 mb-2">{company.name}</h3>
                  <p className="text-purple-300 text-sm mb-3 line-clamp-2">{company.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-xs bg-purple-950 text-purple-200 px-2 py-1 rounded-md">
                      <Building2 className="h-3 w-3 mr-1 text-purple-400" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center text-xs bg-purple-950 text-purple-200 px-2 py-1 rounded-md">
                      <MapPin className="h-3 w-3 mr-1 text-purple-400" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center text-xs bg-purple-950 text-purple-200 px-2 py-1 rounded-md">
                      <Users className="h-3 w-3 mr-1 text-purple-400" />
                      <span>{company.employees}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      href={company.comp_url}
                      target="_blank"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center group"
                    >
                      <span>Website</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                    <Link
                      href={company.comp_url}
                      target="_blank"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
                    >
                      Explore
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-12 bg-gray-900 rounded-lg p-6 shadow-md border border-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-purple-100 mb-6 text-center">Pakistan's Leading Job Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "500+", label: "Companies", color: "purple-600" },
              { value: "10K+", label: "Jobs Posted", color: "purple-500" },
              { value: "50K+", label: "Job Seekers", color: "purple-400" },
              { value: "25K+", label: "Successful Hires", color: "purple-300" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`text-center p-4 bg-gray-950 rounded-md border border-${stat.color}`}
                whileHover={{ scale: 1.03 }}
              >
                <div className={`text-2xl font-semibold text-${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Companies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-100">All Companies</h2>
            <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-400 text-sm">
              <Filter className="h-4 w-4" />
              <span>Sort by</span>
            </button>
          </div>

          <CompanyGrid searchQuery={searchQuery} industryFilter={activeFilter} />
        </motion.div>

  {/* Enhanced Join as Employer CTA */}
  <motion.div
          className="bg-gradient-to-r from-purple-900 to-gray-900 rounded-xl shadow-2xl border border-purple-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="md:flex items-center">
            <div className="p-8 md:p-12 md:w-3/5">
              <div className="text-purple-300 text-sm font-semibold tracking-wider mb-3">FOR EMPLOYERS</div>
              <h3 className="text-2xl md:text-3xl font-bold text-purple-100 mb-4">
                Elevate Your Hiring with HireFusion
              </h3>
              <p className="text-purple-200 text-base mb-6">
                edilir
                Post jobs, connect with top talent, and build your dream team with our cutting-edge platform.
              </p>
              <motion.button
                className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-md text-base font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Hiring Now
                <ChevronRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Professional team"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-900/50"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}