import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import {Job, JobModel} from "@/models/User"; // Adjust the path to your Job model

// Define the FilterOptions interface
interface FilterOptions {
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: [number, number];
  skills: string[];
  companies: string[];
  industries: string[];
  datePosted: string | null;
  remoteOptions: string[];
}

// Helper function to parse salary string and check if it falls within the range
const isSalaryInRange = (salary: string | undefined, range: [number, number]): boolean => {
  if (!salary) return true; // No salary filter if salary is not provided

  // Example salary format: "$50,000 - $100,000" or "$75,000"
  const cleanSalary = salary.replace(/[^0-9-]/g, ""); // Remove non-numeric characters except "-"
  const [min, max] = cleanSalary.includes("-")
    ? cleanSalary.split("-").map((s) => parseInt(s) || 0)
    : [parseInt(cleanSalary) || 0, parseInt(cleanSalary) || 0];

  const [filterMin, filterMax] = range;

  // Check if the salary range overlaps with the filter range
  return (min <= filterMax && max >= filterMin) || (min >= filterMin && max <= filterMax);
};

// Helper function to calculate date range for datePosted
const getDatePostedFilter = (datePosted: string | null): Date | null => {
  if (!datePosted) return null;

  const now = new Date();
  switch (datePosted) {
    case "last_24_hours":
      return new Date(now.setDate(now.getDate() - 1));
    case "last_7_days":
      return new Date(now.setDate(now.getDate() - 7));
    case "last_30_days":
      return new Date(now.setDate(now.getDate() - 30));
    default:
      return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const filters: FilterOptions = await req.json();

    // Build the MongoDB query
    const query: any = {};

    // Job Types
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query.job_type = { $in: filters.jobTypes };
    }

    // Companies
    if (filters.companies && filters.companies.length > 0) {
      query.company_name = { $in: filters.companies.map((c) => new RegExp(c, "i")) };
    }

    // Skills
    if (filters.skills && filters.skills.length > 0) {
      query.skills_required = { $all: filters.skills };
    }

    // Remote Options
    if (filters.remoteOptions && filters.remoteOptions.length > 0) {
      query.job_location = { $regex: "Remote", $options: "i" };
    }

    // Date Posted
    const datePostedFilter = getDatePostedFilter(filters.datePosted);
    if (datePostedFilter) {
      query.createdAt = { $gte: datePostedFilter };
    }

    // Salary Range (custom logic since salary is a string)
    const jobs = await JobModel.find(query).lean();
    const filteredJobs = jobs.filter((job: Job) =>
      isSalaryInRange(job.salary, filters.salaryRange)
    );

    // Note: experienceLevels and industries are not in the Job schema
    // If they are stored elsewhere or need specific logic, extend the query here
    // For now, we skip them or assume they are optional

    return NextResponse.json(filteredJobs, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/advancedfilteredjob:", error);
    return NextResponse.json(
      { error: "Failed to fetch filtered jobs" },
      { status: 500 }
    );
  }
}
