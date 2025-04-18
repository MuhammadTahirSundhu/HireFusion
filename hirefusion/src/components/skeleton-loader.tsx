"use client"
import { motion } from "framer-motion"

export function JobCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 rounded-xl p-5 relative overflow-hidden"
    >
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>

      <div className="flex flex-wrap gap-2 mt-3">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/5"></div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Animated loading effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
      />
    </motion.div>
  )
}

export function JobDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-gray-200 rounded-lg w-28"></div>
          ))}
        </div>

        <div className="flex border-b border-gray-200 mt-6">
          <div className="h-9 bg-gray-200 rounded-lg w-32 mr-4"></div>
          <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
        </div>

        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded-lg"
              style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 mt-auto">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="h-11 bg-gray-200 rounded-lg w-full sm:w-1/2"></div>
          <div className="h-11 bg-gray-200 rounded-lg w-full sm:w-1/2"></div>
        </div>
      </div>

      {/* Animated loading effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// Shimmer effect component that can be reused
export function ShimmerEffect() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      animate={{ x: ["-100%", "100%"] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
    />
  )
}
