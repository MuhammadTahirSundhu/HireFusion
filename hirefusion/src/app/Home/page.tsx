 "use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Briefcase,
  Star,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Bell,
  Bookmark,
  Settings,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("recommended")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin") // Redirect to signin
    }

    // Animation timing
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="pulse-animation">
          <div className="h-16 w-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!session) return null

  // Mock data for demonstration
  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "Remote",
      salary: "$90K - $120K",
      posted: "2 days ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 95,
      skills: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "New York, NY",
      salary: "$100K - $130K",
      posted: "1 day ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 92,
      skills: ["Node.js", "React", "MongoDB"],
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "San Francisco, CA",
      salary: "$85K - $110K",
      posted: "3 days ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 88,
      skills: ["Figma", "Adobe XD", "User Research"],
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataInsights Inc.",
      location: "Boston, MA",
      salary: "$95K - $125K",
      posted: "5 days ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 85,
      skills: ["Python", "Machine Learning", "SQL"],
    },
  ]

  const recentJobs = [
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Chicago, IL",
      salary: "$110K - $140K",
      posted: "Just now",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 82,
      skills: ["AWS", "Docker", "Kubernetes"],
    },
    {
      id: 6,
      title: "Product Manager",
      company: "ProductFirst",
      location: "Austin, TX",
      salary: "$105K - $135K",
      posted: "3 hours ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 79,
      skills: ["Agile", "Product Strategy", "User Stories"],
    },
    {
      id: 7,
      title: "Mobile Developer (iOS)",
      company: "AppWorks",
      location: "Seattle, WA",
      salary: "$95K - $125K",
      posted: "5 hours ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 76,
      skills: ["Swift", "iOS", "Mobile Architecture"],
    },
    {
      id: 8,
      title: "Backend Engineer",
      company: "ServerSide Inc.",
      location: "Remote",
      salary: "$100K - $130K",
      posted: "1 day ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 74,
      skills: ["Java", "Spring Boot", "PostgreSQL"],
    },
  ]

  const savedJobs = [
    {
      id: 9,
      title: "Machine Learning Engineer",
      company: "AI Innovations",
      location: "Remote",
      salary: "$115K - $145K",
      posted: "1 week ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 90,
      skills: ["TensorFlow", "Python", "Deep Learning"],
    },
    {
      id: 10,
      title: "Technical Project Manager",
      company: "ProjectPro",
      location: "Denver, CO",
      salary: "$100K - $130K",
      posted: "3 days ago",
      logo: "/placeholder.svg?height=50&width=50",
      matchScore: 87,
      skills: ["Agile", "Scrum", "JIRA"],
    },
  ]

  const activeJobs = activeTab === "recommended" ? recommendedJobs : activeTab === "recent" ? recentJobs : savedJobs
  const stats = [
    { icon: <Briefcase className="h-5 w-5 text-purple-600" />, label: "Jobs Viewed", value: "124" },
    { icon: <Star className="h-5 w-5 text-yellow-500" />, label: "Applications", value: "18" },
    { icon: <Bookmark className="h-5 w-5 text-blue-500" />, label: "Saved Jobs", value: "32" },
  
  ];
  
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-white transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section with Animation */}
        <section className="mb-10">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="p-8 md:w-2/3">
                <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold slide-in-left">
                  PERSONALIZED JOB MATCHING
                </div>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 slide-in-left" style={{ animationDelay: "0.1s" }}>
                  Welcome back, {session.user?.username || "User"}!
                </h1>
                <p className="mt-3 text-gray-600 slide-in-left" style={{ animationDelay: "0.2s" }}>
                  We've found <span className="text-purple-600 font-semibold">24 new jobs</span> matching your profile
                  since your last visit.
                </p>
                <div className="mt-6 flex space-x-4 slide-in-left" style={{ animationDelay: "0.3s" }}>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Explore Jobs
                  </button>
                  <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg transition-all">
                    Update Profile
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 relative overflow-hidden bg-purple-100 fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute animate-ping-slow opacity-70 w-48 h-48 rounded-full bg-purple-300"></div>
                      <div className="absolute animate-ping-slow animation-delay-1000 opacity-70 w-40 h-40 rounded-full bg-purple-400 top-4 left-4"></div>
                      <div className="absolute animate-ping-slow animation-delay-2000 opacity-70 w-32 h-32 rounded-full bg-purple-500 top-8 left-8"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Briefcase className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-10 fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <div className="bg-purple-50 p-3 rounded-lg mr-4">{stat.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="mb-10">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 slide-in-left" style={{ animationDelay: "0.5s" }}>
                Job Opportunities
              </h2>
              <div className="flex space-x-2 slide-in-right" style={{ animationDelay: "0.5s" }}>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6 slide-in-left" style={{ animationDelay: "0.6s" }}>
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === "recommended" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("recommended")}
              >
                Recommended
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === "recent" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("recent")}
              >
                Recent
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === "saved" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </button>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 job-card-animation"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 overflow-hidden">
                        <Image src={job.logo || "/placeholder.svg"} alt={job.company} width={50} height={50} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          job.matchScore >= 90
                            ? "bg-green-100 text-green-800"
                            : job.matchScore >= 80
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.matchScore}% Match
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{job.posted}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700 font-medium">{job.salary}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Bookmark className="h-5 w-5 text-gray-400 hover:text-purple-600" />
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center slide-in-bottom" style={{ animationDelay: "1.1s" }}>
              <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center mx-auto">
                View All Job Opportunities
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-10 slide-in-bottom" style={{ animationDelay: "1.2s" }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/profile"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-800">Update Profile</h3>
              <p className="text-sm text-gray-500 mt-1">Enhance your match score</p>
            </Link>

            <Link
              href="/search"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Advanced Search</h3>
              <p className="text-sm text-gray-500 mt-1">Find specific opportunities</p>
            </Link>

            <Link
              href="/saved"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="bg-yellow-100 p-3 rounded-full mb-3">
                <Bookmark className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-800">Saved Jobs</h3>
              <p className="text-sm text-gray-500 mt-1">Review your bookmarks</p>
            </Link>

            <Link
              href="/applications"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-800">Applications</h3>
              <p className="text-sm text-gray-500 mt-1">Track your progress</p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 Hire Fusion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
