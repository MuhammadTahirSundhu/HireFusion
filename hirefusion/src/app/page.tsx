"use client"
// landing page 
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronRight, Search, X } from "lucide-react"

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <Image
                src="/placeholder.svg?height=36&width=120" /* logo here*/
                alt="Hire Fusion"
                width={120}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <nav className="hidden md:flex">
              <div className="group relative mr-4">
                <Link href="#footer">
                <button className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-purple-900">
                  Features
                </button>
                </Link>
              </div>
              <div className="group relative mr-4">
                <Link href = "#footer">
                <button className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-purple-900">
                  Product
                </button>
                </Link>
              </div>
              <div className="group relative mr-4">
                <Link href="#resources">
                <button className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-purple-900">
                  Resources
                </button>
                </Link>
              </div>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="mr-4 hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 md:flex">
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/signin"
              className="mr-4 hidden text-sm font-medium text-gray-700 hover:text-purple-900 md:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-purple-800 px-4 py-2 text-sm font-medium text-white hover:bg-purple-900"
            >
              GET STARTED
            </Link>
            <button
              className="ml-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="space-y-1.5">
                  <div className="h-0.5 w-6 bg-gray-600"></div>
                  <div className="h-0.5 w-6 bg-gray-600"></div>
                  <div className="h-0.5 w-6 bg-gray-600"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
            <h1 className="text-5xl font-bold md:text-7xl">
              <span className="text-gray-900">Your</span> <span className="text-purple-600">Career Journey</span>{" "}
              <span className="text-gray-900">Starts Here</span>
            </h1>
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/signup"
                className="w-full bg-purple-800 px-6 py-3 text-center font-medium text-white hover:bg-purple-900 sm:w-auto"
              >
                FIND JOBS
              </Link>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center border border-purple-800 px-6 py-3 text-center font-medium text-purple-800 hover:bg-purple-50 sm:w-auto"
              >
                EXPLORE INTERNSHIPS
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <p className="mt-6 text-center text-gray-600">Thousands of new opportunities added daily</p>
          </div>

          {/* Partner Logos */}
          <div className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 grayscale">
              <Image src="/placeholder.svg?height=40&width=40" alt="Google" width={40} height={40} className="h-8 w-auto" />
              <div className="text-xl font-medium">Microsoft</div>
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Amazon"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Meta"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <div className="text-xl font-medium text-blue-400">IBM</div>
              <Image
                src="/placeholder.svg?height=40&width=60"
                alt="Apple"
                width={60}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* App Screenshot */}
          <div className="mx-auto mt-16 max-w-6xl px-4 md:px-6">
            <div className="overflow-hidden rounded-lg bg-purple-900 shadow-xl">
              <div className="flex h-8 items-center space-x-2 bg-purple-950 px-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-4 flex h-8 w-full items-center justify-center rounded-t-md bg-purple-900">
                  <Search className="mr-2 h-4 w-4 text-white/70" />
                  <div className="text-sm text-white/70">Search job titles, companies, or skills</div>
                </div>
              </div>
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-purple-900 p-4">
                  <div className="mb-6 flex items-center">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded bg-purple-700 text-white">
                      HF
                    </div>
                    <div className="text-white">Hire Fusion</div>
                    <ChevronDown className="ml-2 h-4 w-4 text-white" />
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-white/70">Job Categories</div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-white/70">
                        <span className="mr-2">#</span>
                        <span>software-development</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <span className="mr-2">#</span>
                        <span>data-science</span>
                      </div>
                      <div className="flex items-center rounded bg-purple-800 text-white">
                        <span className="mr-2">#</span>
                        <span>marketing-internships</span>
                      </div>
                    </div>
                  </div>
                  {/* Sidebar icons */}
                  <div className="mt-auto space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-800 text-white">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded text-white/70">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Main job area */}
                <div className="flex-1 bg-white p-4">
                  <div className="mb-4 flex items-center">
                    <div className="mr-2 text-lg font-bold"># marketing-internships</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex">
                        <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
                        <div className="h-5 w-5 -ml-1 rounded-full bg-green-500"></div>
                        <div className="h-5 w-5 -ml-1 rounded-full bg-blue-500"></div>
                      </div>
                      <span className="ml-1">84</span>
                    </div>
                  </div>
                  <div className="mb-4 flex">
                    <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                      <Image src="/placeholder.svg?height=40&width=40" alt="Company" width={40} height={40} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <div className="font-medium">Digital Marketing Intern</div>
                      </div>
                      <div>Acme Tech - Remote - $25/hr - Apply by May 15</div>
                      <div className="text-sm text-gray-500">Posted 2 days ago</div>
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 h-8 w-8 rounded bg-purple-800"></div>
                      <div>
                        <div className="font-medium">Marketing Internship Details</div>
                        <div className="text-sm text-gray-500">Position Overview</div>
                      </div>
                    </div>
                    <div className="rounded border p-3">
                      <div className="text-sm font-medium">Acme Tech - Digital Marketing Intern</div>
                      <div className="text-xs text-gray-500">Location: Remote (USA)</div>
                      <div className="text-xs text-gray-500">Duration: 3 months (Summer 2025)</div>
                      <div className="mt-2">
                        <div className="font-medium">Requirements</div>
                        <div className="flex items-center">
                          <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-400 bg-green-500 text-white">
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>Currently enrolled in Marketing or related field</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mx-auto mt-24 max-w-4xl px-4 text-center md:px-6">
            <h2 className="text-4xl font-bold md:text-5xl">
              One platform for all your
              <br />
              job hunting needs.
            </h2>
          </div>

          {/* Feature Icons */}
          <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 md:px-6">
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium uppercase">Job Aggregation</span>
            </div>
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="font-medium uppercase">Application Tracking</span>
            </div>
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor">
                <path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span className="font-medium uppercase">Smart Matching</span>
            </div>
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium uppercase">AI Resume Builder</span>
            </div>
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium uppercase">Quick Apply</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-purple-900 py-16 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
            <h2 className="text-2xl font-medium md:text-3xl">We're connecting talent with opportunity.</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <div className="text-5xl font-bold md:text-6xl">85%</div>
                <p className="mt-4">of users find relevant job opportunities within their first week*</p>
              </div>
              <div>
                <div className="text-5xl font-bold md:text-6xl">10K+</div>
                <p className="mt-4">new jobs and internships added to our platform daily</p>
              </div>
              <div>
                <div className="text-5xl font-bold md:text-6xl">72%</div>
                <p className="mt-4">of users report shorter job search times compared to traditional methods*</p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Millions of opportunities in one place.</h2>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-8">
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold md:text-5xl">5M+</div>
                  <div className="ml-2 text-sm text-gray-500">Active job listings¹</div>
                </div>
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold md:text-5xl">2.5M</div>
                  <div className="ml-2 text-sm text-gray-500">
                    Internship opportunities from top companies worldwide¹
                  </div>
                </div>
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold md:text-5xl">500K</div>
                  <div className="ml-2 text-sm text-gray-500">New job seekers joining monthly¹</div>
                </div>
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold md:text-5xl">15K+</div>
                  <div className="ml-2 text-sm text-gray-500">Partner companies and recruiters¹</div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Don't just take our word for it.</h3>
                  <p className="text-gray-600">Hire Fusion is rated #1 in job search platforms across 25 review sites.*</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded border border-gray-200 p-2 shadow-sm">
                      <div className="mb-2 h-6 w-20 rounded bg-blue-100 text-center text-xs font-medium text-blue-800">
                        {i % 2 === 0 ? "Top Rated" : i === 1 ? "Best Results" : "User Favorite"}
                      </div>
                      <div className="h-12 w-12 rounded-full bg-orange-100"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Resources to power your job search.</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  type: "Guide",
                  title: "How to Optimize Your Resume with AI",
                  color: "bg-teal-700",
                  action: "READ MORE",
                },
                {
                  type: "Webinar",
                  title: "Mastering Technical Interviews: Tips from Industry Experts",
                  color: "bg-blue-100",
                  action: "WATCH NOW",
                },
                {
                  type: "Blog",
                  title: "The Ultimate Guide to Finding Remote Internships in 2025",
                  color: "bg-blue-100",
                  action: "READ NOW",
                },
                {
                  type: "Template",
                  title: "Cover Letter Templates That Get You Noticed",
                  color: "bg-orange-300",
                  action: "DOWNLOAD",
                },
              ].map((item, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <div className={`h-40 ${item.color}`}></div>
                  <div className="p-4">
                    <div className="mb-2 text-sm text-gray-500">{item.type}</div>
                    <h3 className="mb-4 text-lg font-bold">{item.title}</h3>
                    <div className="flex items-center text-sm font-medium text-purple-800">
                      {item.action}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Small print */}
        <section className="bg-gray-50 py-8">
          <div className="mx-auto max-w-7xl px-4 text-xs text-gray-500 md:px-6">
            <p>*Based on Hire Fusion internal data analysis and user surveys.</p>
            <p>
              ¹Hire Fusion platform metrics as of January 2025.
            </p>
            <p>
              ²Based on average time to first interview reported by users who created profiles between June-December 2024.
            </p>
            <p>
              ³Based on verified placement data from partner employers during 2024 fiscal year.
            </p>
            <p>
              ⁴Rankings based on verified user reviews across major job platform review sites.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-purple-900 py-16 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold md:text-4xl">Start your career journey today.</h2>
            <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/signup"
                className="w-full bg-white px-6 py-3 text-center font-medium text-purple-900 hover:bg-gray-100 sm:w-auto"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white"></div>
        </section>
      </main>
{/* Footer */}
<footer id="footer" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <button className="flex items-center text-sm text-gray-500">
              <svg viewBox="0 0 24 24" className="mr-1 h-4 w-4" fill="none" stroke="currentColor">
                <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Change Location
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.648v1.352h2v2h-2v5h-2v-5h-1v-2h1v-1.765c0-.715.28-1.092.7-1.304.43-.214 1.029-.161 1.65-.161h1.65v1.23z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.326 18.266l-4.326-2.314-4.326 2.313.863-4.829-3.537-3.399 4.86-.671 2.14-4.415 2.14 4.415 4.86.671-3.537 3.4.863 4.829z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div>
              <Link href="/" className="mb-6 block">
                <Image
                  src="/placeholder.svg?height=36&width=120"
                  alt="Hire Fusion"
                  width={120}
                  height={36}
                  className="h-9 w-auto"
                />
              </Link>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">WHY HIRE FUSION?</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Job Aggregation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    One-Stop Platform
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    For Students
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    For Professionals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Remote Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Career Growth
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">PRODUCT</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Job AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Free vs Premium
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Custom Job Alerts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Enterprise Solutions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">FEATURES</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Job Search
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Application Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Career Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Interview Prep
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Company Insights
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Salary Comparisons
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">JOB CATEGORIES</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Marketing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Finance
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Healthcare
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Education
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Remote Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Internships
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">RESOURCES</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Career Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Resource Library
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Hire Fusion Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    Career Events
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-700">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-sm text-gray-500">
            <div className="flex flex-wrap items-center justify-between">
              <div className="mb-4 flex space-x-4 md:mb-0">
                <Link href="#" className="hover:text-blue-700">
                  Download App
                </Link>
                <Link href="#" className="hover:text-blue-700">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-blue-700">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-blue-700">
                  Cookie Preferences
                </Link>
              </div>
              <div>
                ©2025 Hire Fusion. All rights reserved. Various trademarks held by
                their respective owners.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}