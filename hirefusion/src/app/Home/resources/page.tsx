 "use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import ResourceCard from "@/components/resource-card"
import { BookOpen, Code, FileText, Lightbulb, MessageSquare, Users } from "lucide-react"

export default function ResourcesPage() {
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTouching, setIsTouching] = useState(false)

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
      // Optional: Reset to center or keep last position
      // setPointerPosition({ x: 50, y: 50 })
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
      description: "Discover the best job boards to find opportunities matching your skills and experience.",
      icon: <FileText className="h-10 w-10 text-purple-600" />,
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
      description: "Create a standout resume with these professional tools and templates.",
      icon: <FileText className="h-10 w-10 text-purple-600" />,
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
      description: "Ace your interviews with comprehensive preparation resources.",
      icon: <MessageSquare className="h-10 w-10 text-purple-600" />,
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
      description: "Enhance your skills with these learning platforms and courses.",
      icon: <Code className="h-10 w-10 text-purple-600" />,
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
      description: "Build your professional network with these platforms and communities.",
      icon: <Users className="h-10 w-10 text-purple-600" />,
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
      description: "Get expert career guidance and advice from industry professionals.",
      icon: <Lightbulb className="h-10 w-10 text-purple-600" />,
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
      description: "Research companies and industries to make informed career decisions.",
      icon: <BookOpen className="h-10 w-10 text-purple-600" />,
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
      description: "Find freelance work and gigs to build your portfolio and experience.",
      icon: <FileText className="h-10 w-10 text-purple-600" />,
      links: [
        { name: "Upwork", url: "https://www.upwork.com/" },
        { name: "Fiverr", url: "https://www.fiverr.com/" },
        { name: "Freelancer", url: "https://www.freelancer.com/" },
        { name: "Toptal", url: "https://www.toptal.com/" },
      ],
    },
  ]

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-pattern relative overflow-hidden touch-none"
      style={
        {
          "--mouse-x": `${pointerPosition.x}%`,
          "--mouse-y": `${pointerPosition.y}%`,
          "--touch-active": isTouching ? "1" : "0",
        } as React.CSSProperties
      }
    >
      {/* Animated lines */}
      <div className="animated-lines">
        <div className="line line-1 mouse-reactive"></div>
        <div className="line line-2 mouse-reactive"></div>
        <div className="line line-3 mouse-reactive"></div>
        <div className="line line-4 mouse-reactive"></div>
        <div className="line line-5 mouse-reactive"></div>
        <div className="line line-6 mouse-reactive"></div>

        {/* Diagonal lines */}
        <div className="diagonal-line diagonal-line-1 mouse-reactive"></div>
        <div className="diagonal-line diagonal-line-2 mouse-reactive"></div>

        {/* Mouse/touch follower effect */}
        <div className={`pointer-follower ${isTouching ? "touch-active" : ""}`}></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-300 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/5 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-float-slow"></div>
        <div className="absolute top-3/4 left-2/3 w-16 h-16 bg-purple-300 rounded-full opacity-30 animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-float-fast"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-float-medium"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">Career Resources</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the best tools, websites, and resources to help you in your job search journey. We've curated these
            resources to help you find opportunities, prepare for interviews, and develop your career.
          </p>
          {/* Removed the instructional text as requested */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}
