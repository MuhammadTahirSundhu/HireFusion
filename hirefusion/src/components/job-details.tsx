"use client";
import { useState } from "react";
import { BookmarkPlus, BookmarkCheck, ExternalLink, Clock, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import type { JobWithId } from "./job-card";

interface JobDetailsProps {
  job: JobWithId;
  isSaved: boolean;
  onSave: () => void;
}

export function JobDetails({ job, isSaved, onSave }: JobDetailsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isApplyHovered, setIsApplyHovered] = useState(false);

  // Safely extract createdAt and updatedAt as timestamps
  const getTimestamp = (field: JobWithId["createdAt"] | JobWithId["updatedAt"]): string => {
    if (!field) return "N/A";
    if (typeof field === "string") return new Date(field).toLocaleString();
    if ("$date" in field && field.$date.$numberLong) {
      return new Date(Number.parseInt(field.$date.$numberLong)).toLocaleString();
    }
    return "N/A";
  };

  const createdAt = getTimestamp(job.createdAt);
  const updatedAt = getTimestamp(job.updatedAt);

  // Format the date for display
  const getTimeAgo = () => {
    if (!job.createdAt) return "Recently posted";

    let timestamp;
    if (typeof job.createdAt === "string") {
      timestamp = new Date(job.createdAt).getTime();
    } else if ("$date" in job.createdAt && job.createdAt.$date.$numberLong) {
      timestamp = Number.parseInt(job.createdAt.$date.$numberLong);
    } else {
      return "Recently posted";
    }

    const now = new Date().getTime();
    const diff = now - timestamp;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days ago`;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hours ago`;

    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes > 0 ? minutes : 1} minutes ago`;
  };

  // Truncate description for initial view
  const truncateDescription = (text: string, maxLength = 300) => {
    if (text.length <= maxLength) return text;
    return showFullDescription ? text : `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start flex-wrap">
            <div className="max-w-full break-words pr-2">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent break-words">
                {job.job_title}
              </h1>
              <div className="flex items-center mt-2 text-gray-300 flex-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-purple-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium truncate max-w-[calc(100%-1.5rem)]">{job.company_name}</span>
              </div>
              <div className="flex items-center mt-1.5 text-gray-400 flex-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-purple-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate max-w-[calc(100%-1.5rem)]">{job.job_location}</span>
              </div>
              <div className="flex items-center mt-1.5 text-gray-400 flex-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-purple-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="truncate max-w-[calc(100%-1.5rem)]">{job.salary}</span>
              </div>
              <div className="flex items-center mt-1.5 text-gray-400 flex-wrap">
                <Clock className="h-4 w-4 mr-1.5 text-purple-500 flex-shrink-0" />
                <span className="truncate max-w-[calc(100%-1.5rem)]">{getTimeAgo()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className="p-2 rounded-full border bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 border-gray-700 hover:border-purple-700"
                onClick={() => {
                  navigator.clipboard.writeText(job.job_link || window.location.href);
                  alert("Job link copied to clipboard!");
                }}
                title="Copy job link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              <button
                className={`p-2 rounded-full border transition-all duration-300 transform hover:scale-110 ${
                  isSaved
                    ? "bg-purple-900/50 border-purple-700 text-purple-400 hover:bg-purple-900"
                    : "bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-purple-400 hover:border-purple-700"
                }`}
                onClick={onSave}
                title={isSaved ? "Remove from saved jobs" : "Save job"}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 pt-0">
        <div className="mt-6">
          {/* Tabs */}
          <div className="border-b border-gray-800 mb-4 overflow-x-auto hide-scrollbar">
            <div className="flex -mb-px">
              <button
                className={`py-2 px-4 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === "description"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === "skills"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                }`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button>
              <button
                className={`py-2 px-4 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === "details"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 shadow-lg">
            {activeTab === "description" && (
              <div className="animate-fadeIn">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed break-words">
                  {truncateDescription(job.description)}
                </p>
                {job.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 text-purple-400 hover:text-purple-300 flex items-center text-sm group transition-all duration-300"
                  >
                    {showFullDescription ? (
                      <>
                        Show less
                        <ChevronUp className="ml-1 h-4 w-4 group-hover:translate-y-[-2px] transition-transform duration-300" />
                      </>
                    ) : (
                      <>
                        Show more
                        <ChevronDown className="ml-1 h-4 w-4 group-hover:translate-y-[2px] transition-transform duration-300" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="animate-fadeIn">
                <h2 className="text-lg font-semibold text-white mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-900/30 text-purple-300 border border-purple-800 px-3 py-1.5 rounded-2xl text-sm break-words max-w-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="animate-fadeIn">
                <h2 className="text-lg font-semibold text-white mb-4">Job Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300 p-3 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden">
                    <Calendar className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-white block">Posted</span>
                      <span className="text-gray-400 break-words">{createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300 p-3 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden">
                    <Clock className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-white block">Updated</span>
                      <span className="text-gray-400 break-words">{updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300 p-3 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-white block">Salary</span>
                      <span className="text-gray-400 break-words">{job.salary}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300 p-3 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-white block">Location</span>
                      <span className="text-gray-400 break-words">{job.job_location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-purple-500/30 overflow-hidden group"
              onMouseEnter={() => setIsApplyHovered(true)}
              onMouseLeave={() => setIsApplyHovered(false)}
            >
              <span className="relative z-10 flex items-center justify-center">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div
                className={`absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-transform duration-500 transform ${
                  isApplyHovered ? "translate-x-0" : "translate-x-[-100%]"
                }`}
                style={{ zIndex: 0 }}
              ></div>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="p-6">
      {/* Shimmer effect container */}
      <div className="relative overflow-hidden">
        {/* Shimmer animation */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-800/20 to-transparent"></div>

        <div className="h-8 bg-gray-800 rounded-lg w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-1/3 mb-4"></div>

        <div className="h-10 bg-gray-800 rounded-lg w-full mb-4"></div>

        <div className="space-y-2 mt-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-4 bg-gray-800 rounded-lg w-full"></div>
            ))}
        </div>

        <div className="mt-6">
          <div className="h-6 bg-gray-800 rounded-lg w-1/3 mb-3"></div>
          <div className="flex gap-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-6 bg-gray-800 rounded-full w-16"></div>
              ))}
          </div>
        </div>

        <div className="h-12 bg-gray-800 rounded-lg w-full mt-6"></div>
      </div>
    </div>
  );
}