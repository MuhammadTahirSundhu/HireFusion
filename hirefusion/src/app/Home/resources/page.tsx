 "use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Code,
  FileText,
  Lightbulb,
  MessageSquare,
  Users,
  Search,
  ChevronRight,
  Star,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ResourcesPage() {
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredResource, setHoveredResource] = useState<number | null>(null)

  useEffect(() => {
    setIsLoaded(true)
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

  const resources = [
    {
      id: 1,
      title: "Job Boards",
      category: "search",
      description: "Discover the best job boards to find opportunities matching your skills and experience.",
      icon: <FileText className="h-10 w-10 text-purple-600" />,
      bgColor: "bg-purple-50",
      rating: 4.8,
      users: 12500,
      links: [
        { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
        { name: "Indeed", url: "https://www.indeed.com/" },
        { name: "Glassdoor", url: "https://www.glassdoor.com/" },
        { name: "AngelList", url: "https://angel.co/jobs" },
      ],
    },
    {
      id: 2,
      title: "Resume Building",
      category: "preparation",
      description: "Create a standout resume with these professional tools and templates.",
      icon: <FileText className="h-10 w-10 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      rating: 4.7,
      users: 9800,
      links: [
        { name: "Resume.io", url: "https://resume.io/" },
        { name: "Canva Resume Templates", url: "https://www.canva.com/resumes/templates/" },
        { name: "Zety", url: "https://zety.com/" },
        { name: "Resume Genius", url: "https://resumegenius.com/" },
      ],
    },
    {
      id: 3,
      title: "Interview Preparation",
      category: "preparation",
      description: "Ace your interviews with comprehensive preparation resources.",
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      bgColor: "bg-blue-50",
      rating: 4.9,
      users: 15200,
      links: [
        { name: "Pramp", url: "https://www.pramp.com/" },
        { name: "Interview Cake", url: "https://www.interviewcake.com/" },
        { name: "LeetCode", url: "https://leetcode.com/" },
        { name: "Big Interview", url: "https://biginterview.com/" },
      ],
    },
    {
      id: 4,
      title: "Skill Development",
      category: "learning",
      description: "Enhance your skills with these learning platforms and courses.",
      icon: <Code className="h-10 w-10 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      rating: 4.6,
      users: 18700,
      links: [
        { name: "Coursera", url: "https://www.coursera.org/" },
        { name: "Udemy", url: "https://www.udemy.com/" },
        { name: "edX", url: "https://www.edx.org/" },
        { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning/" },
      ],
    },
    {
      id: 5,
      title: "Networking",
      category: "networking",
      description: "Build your professional network with these platforms and communities.",
      icon: <Users className="h-10 w-10 text-violet-600" />,
      bgColor: "bg-violet-50",
      rating: 4.5,
      users: 11300,
      links: [
        { name: "LinkedIn", url: "https://www.linkedin.com/" },
        { name: "Meetup", url: "https://www.meetup.com/" },
        { name: "Slack Communities", url: "https://slack.com/community" },
        { name: "Twitter", url: "https://twitter.com/" },
      ],
    },
    {
      id: 6,
      title: "Career Advice",
      category: "advice",
      description: "Get expert career guidance and advice from industry professionals.",
      icon: <Lightbulb className="h-10 w-10 text-amber-600" />,
      bgColor: "bg-amber-50",
      rating: 4.7,
      users: 8900,
      links: [
        { name: "The Muse", url: "https://www.themuse.com/" },
        { name: "Career Sidekick", url: "https://careersidekick.com/" },
        { name: "Harvard Business Review", url: "https://hbr.org/topic/career-planning" },
        { name: "Vault", url: "https://www.vault.com/" },
      ],
    },
    {
      id: 7,
      title: "Industry Research",
      category: "research",
      description: "Research companies and industries to make informed career decisions.",
      icon: <BookOpen className="h-10 w-10 text-rose-600" />,
      bgColor: "bg-rose-50",
      rating: 4.4,
      users: 7600,
      links: [
        { name: "Crunchbase", url: "https://www.crunchbase.com/" },
        { name: "IBISWorld", url: "https://www.ibisworld.com/" },
        { name: "Statista", url: "https://www.statista.com/" },
        { name: "Bloomberg", url: "https://www.bloomberg.com/" },
      ],
    },
    {
      id: 8,
      title: "Freelance Opportunities",
      category: "search",
      description: "Find freelance work and gigs to build your portfolio and experience.",
      icon: <FileText className="h-10 w-10 text-teal-600" />,
      bgColor: "bg-teal-50",
      rating: 4.6,
      users: 10200,
      links: [
        { name: "Upwork", url: "https://www.upwork.com/" },
        { name: "Fiverr", url: "https://www.fiverr.com/" },
        { name: "Freelancer", url: "https://www.freelancer.com/" },
        { name: "Toptal", url: "https://www.toptal.com/" },
      ],
    },
  ]

  const categories = [
    { id: "all", name: "All Resources", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "search", name: "Job Search", icon: <Search className="h-4 w-4" /> },
    { id: "preparation", name: "Preparation", icon: <FileText className="h-4 w-4" /> },
    { id: "learning", name: "Learning", icon: <Code className="h-4 w-4" /> },
    { id: "networking", name: "Networking", icon: <Users className="h-4 w-4" /> },
    { id: "advice", name: "Career Advice", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "research", name: "Research", icon: <BookOpen className="h-4 w-4" /> },
  ]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.links.some((link) => link.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || resource.category === activeCategory

    return matchesSearch && matchesCategory
  })

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
      className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-900 dark:to-gray-900 relative overflow-hidden touch-none"
      style={
        {
          "--mouse-x": `${pointerPosition.x}%`,
          "--mouse-y": `${pointerPosition.y}%`,
          "--touch-active": isTouching ? "1" : "0",
        } as React.CSSProperties
      }
    >
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
            Career Resources
          </h1>
          <p className="text-lg text-gray-200  max-w-3xl mx-auto mb-8">
            Discover the best tools, websites, and resources to help you in your job search journey. We've curated these
            resources to help you find opportunities, prepare for interviews, and develop your career.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <div className="relative flex items-center bg-white  rounded-lg shadow-lg overflow-hidden">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full py-4 px-4 bg-transparent text-gray-700  focus:outline-none"
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

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white  text-gray-700  hover:bg-purple-100 "
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <AnimatePresence>
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                className="relative group"
                variants={itemVariants}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => setHoveredResource(resource.id)}
                onHoverEnd={() => setHoveredResource(null)}
              >
                {/* Animated border */}
                <div
                  className={`absolute inset-0 rounded-lg thin-animated-border ${hoveredResource === resource.id ? "border-active" : ""}`}
                ></div>

                {/* Card content */}
                <div className="bg-white rounded-lg overflow-hidden shadow-md border border-transparent relative z-0 transition-all duration-300 transform group-hover:shadow-xl group-hover:-translate-y-2">
                  {/* Top rating banner */}
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-transparent text-white text-xs py-1 px-3 rounded-bl-lg flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-300" fill="#fde047" />
                    <span>{resource.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{resource.users.toLocaleString()} users</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`${resource.bgColor} p-3 rounded-full mr-4 transform transition-transform group-hover:rotate-6`}
                      >
                        {resource.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 ">{resource.title}</h2>
                    </div>
                    <p className="text-gray-600  mb-6">{resource.description}</p>
                    <div className="space-y-2">
                      <h3 className="font-medium text-purple-800  mb-2 flex items-center">
                        Popular Resources
                        <span className="ml-1 text-xs bg-purple-100  text-purple-800  px-2 py-0.5 rounded-full">
                          {resource.links.length}
                        </span>
                      </h3>
                      <ul className="space-y-1">
                        {resource.links.map((link, index) => (
                          <motion.li
                            key={index}
                            className="text-sm"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Link
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600  hover:text-purple-800  hover:underline flex items-center group"
                            >
                              <ArrowUpRight className="h-3 w-3 mr-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                              {link.name}
                              <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* View all button */}
                    <div className="mt-6 text-right">
                      <motion.button
                        className="text-purple-600  hover:text-purple-800  text-sm font-medium flex items-center ml-auto"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results message */}
        {filteredResources.length === 0 && (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto shadow-lg">
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We couldn't find any resources matching your search criteria.
              </p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Featured resource banner */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="md:flex items-center">
            <div className="p-8 md:w-2/3">
              <div className="text-purple-200 text-sm font-semibold tracking-wider mb-2">FEATURED RESOURCE</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">HireFusion Premium Resources</h3>
              <p className="text-purple-100 mb-6">
                Get exclusive access to premium resources, personalized career coaching, and advanced job matching
                algorithms.
              </p>
              <motion.button
                className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Premium
                <ChevronRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-600 z-10 md:hidden"></div>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Premium Resources"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute animate-ping-slow opacity-70 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute animate-ping-slow animation-delay-1000 opacity-70 w-24 h-24 rounded-full bg-white top-4 left-4"></div>
                  <div className="relative z-20 text-purple-700 font-bold text-xl">PREMIUM</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
