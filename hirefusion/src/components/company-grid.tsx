 "use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CompanyCard from "./company-card"
import { Building2 } from "lucide-react"

interface CompanyGridProps {
  searchQuery: string
  industryFilter: string
}

export default function CompanyGrid({ searchQuery, industryFilter }: CompanyGridProps) {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Systems Limited",
      logo: "💻",
      description: "Hiring software engineers and IT consultants",
      industry: "technology",
      location: "Lahore",
      employees: "1000+",
      rating: 4.7,
    },
    {
      id: 2,
      name: "Habib Bank Limited",
      logo: "🏦",
      description: "Looking for finance professionals and digital banking experts",
      industry: "finance",
      location: "Karachi",
      employees: "10000+",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Jazz",
      logo: "📱",
      description: "Recruiting telecom engineers and customer service specialists",
      industry: "telecom",
      location: "Islamabad",
      employees: "5000+",
      rating: 4.6,
    },
    {
      id: 4,
      name: "K-Electric",
      logo: "⚡",
      description: "Seeking electrical engineers and energy analysts",
      industry: "energy",
      location: "Karachi",
      employees: "3000+",
      rating: 4.3,
    },
    {
      id: 5,
      name: "Engro Corporation",
      logo: "🏭",
      description: "Hiring chemical engineers and business development managers",
      industry: "energy",
      location: "Karachi",
      employees: "4500+",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Daraz",
      logo: "🛒",
      description: "Looking for e-commerce specialists and logistics managers",
      industry: "retail",
      location: "Lahore",
      employees: "2000+",
      rating: 4.4,
    },
    {
      id: 7,
      name: "Lucky Cement",
      logo: "🏗️",
      description: "Recruiting civil engineers and supply chain professionals",
      industry: "energy",
      location: "Karachi",
      employees: "2500+",
      rating: 4.2,
    },
    {
      id: 8,
      name: "TCS",
      logo: "📦",
      description: "Seeking logistics coordinators and delivery operations managers",
      industry: "retail",
      location: "Karachi",
      employees: "1500+",
      rating: 4.1,
    },
    {
      id: 9,
      name: "10Pearls",
      logo: "🌐",
      description: "Hiring full-stack developers and UX designers",
      industry: "technology",
      location: "Karachi",
      employees: "800+",
      rating: 4.6,
    },
    {
      id: 10,
      name: "Meezan Bank",
      logo: "💰",
      description: "Looking for Islamic banking experts and financial analysts",
      industry: "finance",
      location: "Karachi",
      employees: "7000+",
      rating: 4.7,
    },
    {
      id: 11,
      name: "Telenor Pakistan",
      logo: "📞",
      description: "Recruiting network engineers and digital product managers",
      industry: "telecom",
      location: "Islamabad",
      employees: "4000+",
      rating: 4.5,
    },
    {
      id: 12,
      name: "Nestle Pakistan",
      logo: "🍫",
      description: "Hiring food technologists and supply chain specialists",
      industry: "retail",
      location: "Lahore",
      employees: "3500+",
      rating: 4.4,
    },
  ])

  const [filteredCompanies, setFilteredCompanies] = useState(companies)

  useEffect(() => {
    let filtered = companies

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply industry filter
    if (industryFilter && industryFilter !== "all") {
      filtered = filtered.filter((company) => company.industry === industryFilter)
    }

    setFilteredCompanies(filtered)
  }, [searchQuery, industryFilter, companies])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredCompanies.map((company) => (
            <motion.div key={company.id} variants={itemVariants} layout>
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No results message */}
      {filteredCompanies.length === 0 && (
        <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg border border-gray-100">
            <div className="text-purple-600 mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any companies matching your search criteria.</p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all"
              onClick={() => {
                // Reset filters
              }}
            >
              Clear filters
            </button>
          </div>
        </motion.div>
      )}
    </>
  )
}
