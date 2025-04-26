"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";

interface ResourceLink {
  name: string;
  url: string;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  links: ResourceLink[];
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group ${isHovered ? "z-10" : "z-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-2xl thin-animated-border ${
          isHovered ? "border-active" : ""
        }`}
      ></div>

      {/* Glass Card content */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-md relative z-0 transition-all duration-300 transform group-hover:shadow-xl group-hover:-translate-y-2">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-200/30 backdrop-blur-sm p-3 rounded-full mr-4">
              {resource.icon}
            </div>
            <h2 className="text-xl font-semibold text-white">{resource.title}</h2>
          </div>
          <p className="text-gray-200 mb-6">{resource.description}</p>
          <div className="space-y-2">
            <h3 className="font-medium text-purple-300 mb-2">Popular Resources:</h3>
            <ul className="space-y-1">
              {resource.links.map((link, index) => (
                <li key={index} className="text-sm">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white hover:underline flex items-center"
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
  );
}
