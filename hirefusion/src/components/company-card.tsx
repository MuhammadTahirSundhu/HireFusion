"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Users,
  Star,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  industry: string;
  location: string;
  employees: string;
  rating: number;
  comp_url?: string;
}

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get industry-specific colors
  const getIndustryColors = (industry: string) => {
    switch (industry) {
      case "technology":
        return {
          bg: "bg-blue-50",
          text: "text-blue-800",
          icon: "text-blue-600",
        };
      case "finance":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-800",
          icon: "text-emerald-600",
        };
      case "telecom":
        return {
          bg: "bg-violet-50",
          text: "text-violet-800",
          icon: "text-violet-600",
        };
      case "energy":
        return {
          bg: "bg-amber-50",
          text: "text-amber-800",
          icon: "text-amber-600",
        };
      case "retail":
        return {
          bg: "bg-rose-50",
          text: "text-rose-800",
          icon: "text-rose-600",
        };
      default:
        return {
          bg: "bg-purple-50",
          text: "text-purple-800",
          icon: "text-purple-600",
        };
    }
  };

  const industryColors = getIndustryColors(company.industry);

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative group h-full">
        {/* Card with white background */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 relative z-0 transition-all duration-300 transform group-hover:shadow-xl h-full flex flex-col">
          {/* Colorful top accent bar based on industry */}
          <div
            className={`h-2 ${industryColors.bg.replace("bg-", "bg-")} w-full`}
          ></div>

          {/* Company header with logo */}
          <div className="p-6 pb-4">
            <div className="flex items-center mb-4">
              <div
                className={`w-14 h-14 ${industryColors.bg} rounded-full flex items-center justify-center text-2xl mr-4 transform transition-transform group-hover:rotate-6 border-2 border-white shadow-md`}
              >
                {company.logo}
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {company.name}
                  </h2>
                  <div className="ml-2 flex items-center bg-yellow-50 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full">
                    <Star
                      className="h-3 w-3 mr-0.5 text-yellow-500"
                      fill="#eab308"
                    />
                    <span>{company.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{company.location}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{company.description}</p>
          </div>

          {/* Company details */}
          <div className="px-6 pb-4 mt-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <div
                className={`flex items-center text-xs ${industryColors.bg} ${industryColors.text} px-2 py-1 rounded-full`}
              >
                <Building2 className={`h-3 w-3 mr-1 ${industryColors.icon}`} />
                <span className="capitalize">{company.industry}</span>
              </div>
              <div className="flex items-center text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full">
                <Users className="h-3 w-3 mr-1 text-blue-600" />
                <span>{company.employees}</span>
              </div>
              <div className="flex items-center text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full">
                <Briefcase className="h-3 w-3 mr-1 text-green-600" />
                <span>Hiring</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-red-200">
              <div>

              <a
                href={company.comp_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${industryColors.text} bg-amber-300 hover:underline text-sm font-medium flex items-center group transition-all hover:cursor-pointer`}
                >
                <span>Company Profile</span>
                <ArrowUpRight className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
                </div>

              <Link
                href={`/companies/${company.id}/jobs`}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
              >
                View Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
