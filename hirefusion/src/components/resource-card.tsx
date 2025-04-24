"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

interface ResourceLink {
  name: string
  url: string
}

interface Resource {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  links: ResourceLink[]
}

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative group ${isHovered ? "z-10" : "z-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border */}
      <div className={`absolute inset-0 rounded-lg thin-animated-border ${isHovered ? "border-active" : ""}`}></div>

      {/* Card content */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md border border-transparent relative z-0 transition-all duration-300 transform group-hover:shadow-xl group-hover:-translate-y-2">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">{resource.icon}</div>
            <h2 className="text-xl font-semibold text-purple-900">{resource.title}</h2>
          </div>
          <p className="text-gray-600 mb-6">{resource.description}</p>
          <div className="space-y-2">
            <h3 className="font-medium text-purple-800 mb-2">Popular Resources:</h3>
            <ul className="space-y-1">
              {resource.links.map((link, index) => (
                <li key={index} className="text-sm">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 hover:underline flex items-center"
                  >
                    <span className="mr-1">→</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
