"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  paginate: (pageNumber: number) => void
  prevPage: () => void
  nextPage: () => void
}

export function Pagination({ currentPage, totalPages, paginate, prevPage, nextPage }: PaginationProps) {
  if (totalPages <= 0) return null

  return (
    <div className="p-4 border-t">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-1 rounded ${
            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        <div className="flex flex-wrap justify-center gap-1">
          {totalPages <= 7 ? (
            // Show all pages if 7 or fewer
            Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            ))
          ) : (
            // Show limited pages with ellipsis for larger page counts
            <>
              {/* First page */}
              <button
                onClick={() => paginate(1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                1
              </button>

              {/* Ellipsis or second page */}
              {currentPage > 3 && (
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700">...</button>
              )}

              {/* Pages around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (currentPage <= 3) {
                  // Near start
                  pageNum = i + 2
                } else if (currentPage >= totalPages - 2) {
                  // Near end
                  pageNum = totalPages - 4 + i
                } else {
                  // Middle
                  pageNum = currentPage - 2 + i
                }
                return pageNum > 1 && pageNum < totalPages ? pageNum : null
              })
                .filter(Boolean)
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}

              {/* Ellipsis or second-to-last page */}
              {currentPage < totalPages - 2 && (
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700">...</button>
              )}

              {/* Last page */}
              <button
                onClick={() => paginate(totalPages)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === totalPages ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-1 rounded ${
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  )
}
