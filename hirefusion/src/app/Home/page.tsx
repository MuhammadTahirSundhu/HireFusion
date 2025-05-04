"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Briefcase,
  Building,
  BookOpen,
  FileText,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react"

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [notifications, setNotifications] = useState(3)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Find which section is currently in view for highlighting in the nav
      const sections = document.querySelectorAll("section[id]")
      let currentSection = ""

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = section.clientHeight
        if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
          currentSection = section.getAttribute("id") || ""
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false)
      setShowUserMenu(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Mock user data
  const user = {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
    role: "UX Designer",
    completionRate: 85,
  }

  // Navigation links
  const navLinks = [
    { name: "Jobs", href: "/home/jobs", icon: <Briefcase className="h-5 w-5" />, id: "jobs" },
    { name: "Saved Jobs", href: "/home/Savedjobs", icon: <Heart className="h-5 w-5" />, id: "saved" },
    { name: "Companies", href: "/home/companies", icon: <Building className="h-5 w-5" />, id: "companies" },
    { name: "Profile", href: "/home/profile", icon: <User className="h-5 w-5" />, id: "profile" },
    { name: "Career Advice", href: "/home/career", icon: <FileText className="h-5 w-5" />, id: "career" },
    { name: "Resources", href: "/home/resources", icon: <BookOpen className="h-5 w-5" />, id: "resources" },
  ]

  // Mock recommended jobs
  const recommendedJobs = [
    {
      id: 1,
      title: "Senior UX Designer",
      company: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
      location: "Remote",
      salary: "$120K - $150K",
      posted: "2 days ago",
      matchRate: 95,
      isNew: true,
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
      location: "Hybrid",
      salary: "$130K - $160K",
      posted: "1 week ago",
      matchRate: 92,
      isNew: false,
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2048px-Meta_Platforms_Inc._logo.svg.png",
      location: "Remote",
      salary: "$110K - $140K",
      posted: "3 days ago",
      matchRate: 88,
      isNew: true,
    },
  ]

  // Mock upcoming interviews
  const upcomingInterviews = [
    {
      id: 1,
      company: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
      position: "Senior Product Designer",
      date: "May 10, 2025",
      time: "2:00 PM",
      interviewer: "Sarah Chen",
      type: "Technical Interview",
    },
    {
      id: 2,
      company: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
      position: "UX Researcher",
      date: "May 15, 2025",
      time: "11:30 AM",
      interviewer: "Michael Rodriguez",
      type: "Portfolio Review",
    },
  ]

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: "application",
      company: "Adobe",
      position: "UI Designer",
      time: "Yesterday at 3:45 PM",
      status: "Application Submitted",
    },
    {
      id: 2,
      type: "view",
      company: "Spotify",
      position: "Product Designer",
      time: "Yesterday at 1:20 PM",
      status: "Profile Viewed",
    },
    {
      id: 3,
      type: "save",
      company: "Airbnb",
      position: "UX Engineer",
      time: "May 3 at 10:15 AM",
      status: "Job Saved",
    },
  ]

  // Mock trending skills
  const trendingSkills = [
    { name: "Figma", growth: "+28%" },
    { name: "React", growth: "+24%" },
    { name: "AI/ML", growth: "+45%" },
    { name: "TypeScript", growth: "+32%" },
    { name: "UI/UX", growth: "+18%" },
  ]

  // Mock notifications
  const notificationsList = [
    {
      id: 1,
      title: "Interview Scheduled",
      message: "Your interview with Amazon has been confirmed for May 10",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Application Update",
      message: "Google has reviewed your application for Senior UX Designer",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      title: "New Job Match",
      message: "We found a new job that matches your profile: UX Lead at Dropbox",
      time: "2 days ago",
      read: false,
    },
  ]

  // Handle menu clicks with stopPropagation to prevent closing from outside click handler
  interface MenuClickEvent extends React.MouseEvent<HTMLButtonElement> {
    stopPropagation: () => void;
  }

  type MenuType = "notifications" | "user";

  const handleMenuClick = (e: MenuClickEvent, menu: MenuType): void => {
    e.stopPropagation();
    if (menu === "notifications") {
      setShowNotifications(!showNotifications);
      setShowUserMenu(false);
    } else if (menu === "user") {
      setShowUserMenu(!showUserMenu);
      setShowNotifications(false);
    }
  };

  // Smooth scroll to section
  interface ScrollToSectionProps {
    sectionId: string;
  }

  const scrollToSection = (sectionId: ScrollToSectionProps["sectionId"]): void => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-700 filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-900 filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-purple-800 filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] bg-cover opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-purple-950/20"></div>
      </div>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Find Your</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 animate-gradient-x">
                  Dream Career
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
                Connect with thousands of opportunities tailored to your skills and aspirations
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/home/jobs"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-md font-medium text-white transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 hover:-translate-y-1 flex items-center justify-center"
                >
                  <Search className="mr-2 h-5 w-5" />
                  EXPLORE JOBS
                </Link>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-3 border border-purple-700 hover:border-purple-500 rounded-md font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-all duration-300 flex items-center justify-center group"
                >
                  CREATE ACCOUNT
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="relative mt-16 md:mt-24 max-w-4xl mx-auto">
              <div className="absolute -top-10 -left-10 w-20 h-20 md:w-32 md:h-32 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 md:w-32 md:h-32 bg-purple-800/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

              <div className="relative bg-gradient-to-r from-purple-900/40 to-black/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-purple-900/30 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-purple-300">JobHub Platform</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: <Briefcase className="h-6 w-6" />, count: "10K+", label: "Jobs" },
                    { icon: <Building className="h-6 w-6" />, count: "5K+", label: "Companies" },
                    { icon: <User className="h-6 w-6" />, count: "1M+", label: "Users" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-purple-900/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="h-12 w-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-3">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold">{stat.count}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
                  {["Google", "Microsoft", "Amazon", "Meta", "Apple", "IBM"].map((company, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-2 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-gray-300">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="jobs" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/20 z-0"></div>
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                  Find Your Perfect Job
                </h2>
                <p className="text-gray-400 max-w-xl">
                  Browse thousands of job listings tailored to your skills and career goals
                </p>
              </div>
              <Link
                href="/home/jobs"
                className="mt-6 md:mt-0 inline-flex items-center px-4 py-2 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
              >
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Senior UX Designer",
                  company: "Google",
                  location: "Remote",
                  salary: "$120K - $150K",
                  tags: ["Full-time", "Design", "Senior"],
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
                  isNew: true,
                },
                {
                  title: "Frontend Developer",
                  company: "Microsoft",
                  location: "Hybrid",
                  salary: "$110K - $140K",
                  tags: ["Full-time", "Development", "Mid-level"],
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
                  isNew: true,
                },
                {
                  title: "Product Manager",
                  company: "Amazon",
                  location: "On-site",
                  salary: "$130K - $160K",
                  tags: ["Full-time", "Management", "Senior"],
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
                  isNew: false,
                },
              ].map((job, index) => (
                <Link
                  key={index}
                  href="/home/jobs"
                  className="group bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1"
                >
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-white p-1 flex-shrink-0">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={job.company}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium group-hover:text-purple-300 transition-colors duration-200">
                          {job.title}
                        </h3>
                        {job.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300">New</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <span>{job.company}</span>
                        <span className="mx-2">•</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="mt-3 text-sm text-purple-300">{job.salary}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-900/30 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-700/30 text-white">
                <Star className="h-5 w-5 text-purple-400 mr-2" />
                <span>Join thousands of professionals who've found their dream jobs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Jobs Section */}
        <section id="saved" className="py-20 relative">
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                  Never Lose Track of Opportunities
                </h2>
                <p className="text-gray-400 mb-6">
                  Save jobs you're interested in and come back to them later. Organize your job search and keep track of
                  your applications.
                </p>
                <ul className="space-y-4">
                  {[
                    "Save jobs with a single click",
                    "Organize jobs by priority",
                    "Set reminders for application deadlines",
                    "Compare saved opportunities",
                    "Track application status",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/home/Savedjobs"
                  className="mt-8 inline-flex items-center px-6 py-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
                >
                  Manage Saved Jobs
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-800/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

                <div className="relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-lg flex items-center">
                      <Heart className="h-5 w-5 text-purple-400 mr-2" />
                      Saved Jobs
                    </h3>
                    <div className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300">Example UI</div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Senior Product Designer",
                        company: "Netflix",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
                        deadline: "2 days left",
                      },
                      {
                        title: "UX Researcher",
                        company: "Spotify",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png",
                        deadline: "5 days left",
                      },
                      {
                        title: "UI Engineer",
                        company: "Airbnb",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
                        deadline: "1 week left",
                      },
                    ].map((job, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-black/30 rounded-lg hover:bg-purple-900/20 transition-all duration-200"
                      >
                        <div className="h-10 w-10 rounded-lg bg-white p-1 flex-shrink-0">
                          <Image
                            src={job.logo || "/placeholder.svg"}
                            alt={job.company}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-sm">{job.title}</h4>
                          <p className="text-xs text-gray-400">{job.company}</p>
                        </div>
                        <div className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300">
                          {job.deadline}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-900/30 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Showing 3 of 12 saved jobs</span>
                    <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section id="companies" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-black z-0"></div>
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                Discover Top Companies
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Research and connect with leading companies across industries
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Google",
                  industry: "Technology",
                  location: "Mountain View, CA",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png",
                  coverImage: "https://images.unsplash.com/photo-1516387938699-a93567ec168e",
                  openPositions: 45,
                },
                {
                  name: "Microsoft",
                  industry: "Technology",
                  location: "Redmond, WA",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
                  coverImage: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931",
                  openPositions: 38,
                },
                {
                  name: "Amazon",
                  industry: "E-commerce, Technology",
                  location: "Seattle, WA",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
                  coverImage: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107",
                  openPositions: 72,
                },
              ].map((company, index) => (
                <Link
                  key={index}
                  href="/home/companies"
                  className="group relative overflow-hidden rounded-xl border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1 h-64"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={company.coverImage || "/placeholder.svg"}
                      alt={company.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                  </div>

                  <div className="absolute top-4 left-4 h-12 w-12 rounded-lg bg-white p-1">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors duration-200">
                      {company.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <span>{company.industry}</span>
                      <span className="mx-2">•</span>
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-300">{company.openPositions} open positions</span>
                      <span className="text-sm text-white flex items-center group-hover:text-purple-300 transition-colors duration-200">
                        View Profile
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/home/companies"
                className="inline-flex items-center px-6 py-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
              >
                Explore All Companies
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile" className="py-20 relative">
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pl-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                  Showcase Your Professional Profile
                </h2>
                <p className="text-gray-400 mb-6">
                  Create a compelling profile that highlights your skills, experience, and career aspirations to stand
                  out to employers.
                </p>
                <ul className="space-y-4">
                  {[
                    "Highlight your key skills and expertise",
                    "Showcase your work experience and achievements",
                    "Display your education and certifications",
                    "Share your portfolio and projects",
                    "Set your job preferences and career goals",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/home/profile"
                  className="mt-8 inline-flex items-center px-6 py-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
                >
                  Manage Your Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-800/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

                <div className="relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-xl overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-purple-900 to-purple-700"></div>
                  <div className="px-6 pb-6 relative">
                    <div className="absolute -top-12 left-6 h-24 w-24 rounded-xl bg-black p-1 border-4 border-black">
                      <Image
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-lg object-cover h-full w-full"
                      />
                    </div>

                    <div className="mt-14">
                      <h3 className="text-xl font-bold">Alex Johnson</h3>
                      <p className="text-gray-400">Senior UX Designer</p>

                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {["UI/UX Design", "Figma", "Prototyping", "User Research", "Wireframing"].map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Experience</h4>
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded bg-white p-0.5 flex-shrink-0 mt-0.5">
                                <Image
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
                                  alt="Google"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium">UX Designer at Google</div>
                                <div className="text-xs text-gray-400">2020 - Present</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-purple-900/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Profile Strength</span>
                          <span className="text-sm text-purple-300">85%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-purple-400 h-1.5 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Advice Section */}
        <section id="career" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/20 z-0"></div>
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                Expert Career Advice
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get insights and guidance from industry experts to advance your career
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Mastering the Technical Interview",
                  excerpt: "Learn strategies to ace your next technical interview with confidence.",
                  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                  category: "Interviews",
                  readTime: "5 min read",
                },
                {
                  title: "Building a Portfolio That Stands Out",
                  excerpt: "Tips for creating a compelling portfolio that showcases your best work.",
                  image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
                  category: "Portfolio",
                  readTime: "7 min read",
                },
                {
                  title: "Negotiating Your Salary: A Complete Guide",
                  excerpt: "How to confidently negotiate the compensation you deserve.",
                  image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
                  category: "Negotiation",
                  readTime: "8 min read",
                },
              ].map((article, index) => (
                <Link
                  key={index}
                  href="/home/career"
                  className="group relative overflow-hidden rounded-xl border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-900/70 text-purple-200">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{article.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <span className="text-sm text-purple-400 group-hover:text-purple-300 flex items-center transition-colors duration-200">
                        Read More
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/home/career"
                className="inline-flex items-center px-6 py-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
              >
                Explore All Career Advice
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-20 relative">
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                  Resources to Power Your Job Search
                </h2>
                <p className="text-gray-400 mb-6">
                  Access templates, guides, and tools to help you stand out in your job search and career development.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Resume Templates",
                      description: "Professional templates to help you stand out",
                      icon: <FileText className="h-5 w-5" />,
                    },
                    {
                      title: "Cover Letter Guides",
                      description: "Write compelling cover letters that get noticed",
                      icon: <FileText className="h-5 w-5" />,
                    },
                    {
                      title: "Interview Preparation",
                      description: "Practice with common interview questions",
                      icon: <MessageSquare className="h-5 w-5" />,
                    },
                    {
                      title: "Salary Negotiation",
                      description: "Get the compensation you deserve",
                      icon: <TrendingUp className="h-5 w-5" />,
                    },
                  ].map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-black/30 rounded-lg hover:bg-purple-900/20 transition-all duration-200"
                    >
                      <div className="h-10 w-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                        {resource.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-sm">{resource.title}</h4>
                        <p className="text-xs text-gray-400">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/home/resources"
                  className="mt-8 inline-flex items-center px-6 py-3 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 rounded-lg text-white transition-all duration-300 group"
                >
                  Explore All Resources
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-800/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

                <div className="relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-lg flex items-center">
                      <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
                      Featured Resource
                    </h3>
                    <div className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300">Premium</div>
                  </div>

                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
                      alt="Resume Masterclass"
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">Resume Masterclass</h4>
                        <p className="text-sm text-gray-300">Learn how to craft a resume that gets you interviews</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-black overflow-hidden">
                            <Image
                              src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`}
                              alt="User"
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-400">1,200+ enrolled</span>
                    </div>
                    <Link
                      href="/home/resources"
                      className="inline-flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white text-sm transition-colors duration-200"
                    >
                      Access Now
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692')] bg-cover opacity-10"></div>
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Ready to Take the Next Step in Your Career?
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Create your profile today and connect with opportunities that match your skills and aspirations
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 rounded-md font-medium text-white transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 hover:-translate-y-1 text-lg"
                >
                  GET STARTED NOW
                </Link>
                <Link
                  href="/home/jobs"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-md font-medium text-white transition-all duration-300 text-lg"
                >
                  BROWSE JOBS
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-900/30 py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center mr-2">
                  <span className="font-bold text-white">JH</span>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
                  JobHub
                </span>
              </Link>
              <p className="text-gray-400 mb-4">
                Your all-in-one platform for job search, career development, and professional networking.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Features</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/home/jobs"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Job Search
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/Savedjobs"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/companies"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Company Profiles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/profile"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Profile Management
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/home/resources"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Resume Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/resources"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Cover Letters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/career"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Career Advice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home/resources"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Interview Prep
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-900/30 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} JobHub. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Add some CSS animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  )
}
