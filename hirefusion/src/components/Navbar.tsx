"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FaBars,
  FaTachometerAlt,
  FaBriefcase,
  FaBookmark,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaRegBuilding,
  FaRegFileAlt,
  FaRegLightbulb,
} from "react-icons/fa"
import NotificationsBox from "@/components/NotificationBox"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const pathname = usePathname() || "/"
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationButtonRef = useRef<HTMLButtonElement>(null)
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    setIsProfileOpen(false)
    await signOut({ callbackUrl: "/signin" })
  }

  // Fetch notification count
  useEffect(() => {

    if (session?.user?.email) {
      const fetchNotificationCount = async () => {
        try {
          const response = await fetch(`/api/notifications/getAllnotifications?email=${encodeURIComponent(session.user.email)}`)
          if (response.ok) {
            const data = await response.json()
            setNotificationCount(data.notifications?.length || 0)
          }
        } catch (error) {
          console.error("Error fetching notification count:", error)
        }
      }
      fetchNotificationCount()
    }
  }, [session])


  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/Home", label: "Home", icon: <FaTachometerAlt className="text-lg" /> },
    { href: "/Home/jobs", label: "Find Jobs", icon: <FaBriefcase className="text-lg" /> },
    { href: "/Home/Savedjobs", label: "Saved Jobs", icon: <FaBookmark className="text-lg" /> },
    { href: "/Home/Companies", label: "Companies", icon: <FaRegBuilding className="text-lg" /> },
    { href: "/Home/resources", label: "Resources", icon: <FaRegFileAlt className="text-lg" /> },
    { href: "/Home/Career", label: "Career Advice", icon: <FaRegLightbulb className="text-lg" /> },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-gray-900 dark:to-gray-800 shadow-xl sticky top-0 z-50 transition-all duration-300" role="navigation">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/Home" className="flex items-center group">
              <div className="relative h-9 w-9 mr-3">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  <span className="text-blue-700 dark:text-blue-400 font-extrabold text-xl">HF</span>
                </div>
              </div>
              <span className="text-white text-2xl font-semibold hidden sm:block tracking-tight group-hover:text-blue-200 transition-colors duration-200">HireFusion</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${pathname.startsWith(item.href)
                  ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-blue-100 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white"
                  }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                ref={notificationButtonRef}
                className="p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-700 dark:hover:bg-gray-700 transition-all duration-300 relative transform hover:scale-103"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
              >
                <FaBell className="text-xl transition-transform transform duration-300 hover:scale-110" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-semibold text-white bg-red-500 rounded-full shadow-lg ring-2 ring-blue-900 transform translate-x-1/2 -translate-y-1/2 animate-pulse">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>


              <NotificationsBox
                isOpen={isNotificationsOpen}
                setIsOpen={setIsNotificationsOpen}
                buttonRef={notificationButtonRef}
              />
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                className="flex items-center space-x-1 p-1.5 text-blue-100 hover:text-white rounded-full hover:bg-blue-800 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 text-white font-bold text-lg shadow-md">
                  {session?.user?.username?.charAt(0).toUpperCase()}
                </div>
                <FaChevronDown className="text-sm" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {session?.user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/Home/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FaUserCircle className="mr-2.5 text-lg" /> Your Profile
                  </Link>
                  <div className="border-t dark:border-gray-700">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <FaSignOutAlt className="mr-2.5 text-lg" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-800 dark:hover:bg-gray-700 transition-all duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <FaBars className="text-lg" />
            </button>
          </div>
        </div>
      </div >

      {/* Mobile Navigation */}
      < div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`
        }
      >
        <div className="flex flex-col space-y-1 mt-2 px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${pathname.startsWith(item.href)
                ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm"
                : "text-blue-100 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white"
                }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div >
    </nav >
  )
}