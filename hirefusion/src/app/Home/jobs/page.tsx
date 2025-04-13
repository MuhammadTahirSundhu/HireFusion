'use client';
import React, { useState } from 'react';

const jobOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "DevOps Engineer",
];

const locationOptions = [
  "New York",
  "California",
  "Texas",
  "Remote",
  "Canada",
  "United Kingdom",
];

export default function JobsPage() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleJobToggle = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTypes: selectedJobs,
          locations: selectedLocations,
        }),
      });

      const data = await response.json();
      console.log("Fetched jobs:", data);
      setResults(data.data || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Find Your Dream Job</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Titles */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Job Titles</h2>
            <div className="space-y-2">
              {jobOptions.map((job) => (
                <label key={job} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job)}
                    onChange={() => handleJobToggle(job)}
                  />
                  <span>{job}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Locations</h2>
            <div className="space-y-2">
              {locationOptions.map((loc) => (
                <label key={loc} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleLocationToggle(loc)}
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading || selectedJobs.length === 0 || selectedLocations.length === 0}
          >
            {loading ? "Searching..." : "Find Jobs"}
          </button>
        </div>
      </div>

      {/* Job Results */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Job Results</h2>
          {results.map((job, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <a href={job.link} target="_blank" className="text-blue-600 hover:underline">
                View Job
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
