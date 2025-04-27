"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FaBars,
  FaTachometerAlt,
  FaBriefcase,
  FaBookmark,
  FaBell,
  FaUserCircle,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaRegBuilding,
  FaRegFileAlt,
  FaRegLightbulb,
  FaMoon,
  FaSun,
} from "react-icons/fa"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname() || "/"
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
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
    { href: "/home", label: "Home", icon: <FaTachometerAlt className="text-lg" /> },
    { href: "/home/jobs", label: "Find Jobs", icon: <FaBriefcase className="text-lg" /> },
    { href: "/home/saved-jobs", label: "Saved Jobs", icon: <FaBookmark className="text-lg" /> },
    { href: "/home/Companies", label: "Companies", icon: <FaRegBuilding className="text-lg" /> },
    { href: "/home/resources", label: "Resources", icon: <FaRegFileAlt className="text-lg" /> },
    { href: "/home/Career", label: "Career Advice", icon: <FaRegLightbulb className="text-lg" /> },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    setIsSearchOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-200" role="navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">HF</span>
                </div>
              </div>
              <span className="text-white text-xl font-bold hidden sm:block">HireFusion</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  pathname.startsWith(item.href)
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-blue-100 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              className="p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* Search Button */}
            <div ref={searchRef} className="relative">
              <button
                className="p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <FaSearch />
              </button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 px-3 z-50">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search jobs, companies..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors relative"
              aria-label="Notifications"
            >
              <FaBell />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
            </button>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                className="flex items-center space-x-1 p-1.5 text-blue-100 hover:text-white rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile"
              >
                <FaUserCircle className="text-xl" />
                <FaChevronDown className="text-xs" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                  </div>
                  <Link
                    href="/home/profile"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FaUserCircle className="mr-2" /> Your Profile
                  </Link>
                  <Link
                    href="/home/settings"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FaCog className="mr-2" /> Settings
                  </Link>
                  <div className="border-t dark:border-gray-700">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <FaSignOutAlt className="mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-2 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith(item.href)
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-blue-100 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
