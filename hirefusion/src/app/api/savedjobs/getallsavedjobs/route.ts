import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User"; // Adjust path to your User model
import mongoose from "mongoose";

// GET: Retrieve all saved jobs for a user by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log("Email:", email); // Debugging line

    // Validate email
    if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid or missing email" },
        { status: 400 }
      );
    }

    // Find user and populate savedJobs with job details
    const user = await UserModel.findOne({ email }).populate({
      path: "savedJobs",
      model: "Job", // Ensure this matches your Job model name
      select:
        "job_title company_name job_location job_type salary skills_required description job_link",
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure savedJobs is an array of job objects
    const savedJobs = user.savedJobs || [];

    return NextResponse.json({
      jobs: savedJobs,
      savedJobIds: savedJobs.map((job: any) => job._id.toString()), // Include IDs if needed
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}