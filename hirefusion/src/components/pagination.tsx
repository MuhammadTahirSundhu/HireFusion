"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  paginate: (pageNumber: number) => void
  prevPage: () => void
  nextPage: () => void
  maxPageButtons?: number
}

export function Pagination({
  currentPage,
  totalPages,
  paginate,
  prevPage,
  nextPage,
  maxPageButtons = 5,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    
    // If we have fewer pages than the max buttons, show all pages
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }
    
    // Always show first page
    pageNumbers.push(1)
    
    // Calculate start and end of the middle section
    let startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2) + 1)
    let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3)
    
    // Adjust if we're near the start
    if (startPage > 2) {
      pageNumbers.push("...")
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    
    // Adjust if we're near the end
    if (endPage < totalPages - 1) {
      pageNumbers.push("...")
    }
    
    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center py-4 border-t border-gray-100">
      <nav className="flex items-center space-x-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                ...
              </span>
            )
          }

          const page = pageNumber as number
          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </motion.button>
          )
        })}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </nav>
    </div>
  )
}
