import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User"; // Adjust path to your models
import mongoose from "mongoose";

// POST handler to save a job for a user
export async function POST(req: NextRequest) {
  try {
    const { email, jobId } = await req.json();
    console.log("Received email:", email); // Debug log
    console.log("Received jobId:", jobId); // Debug log

    // Validate email
    if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid or missing email" },
        { status: 400 }
      );
    }

    // Validate jobId
    if (!jobId || typeof jobId !== "string" || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert jobId to ObjectId for comparison and storage
    const jobObjectId = new mongoose.Types.ObjectId(jobId);

    // Check if the job is already saved
    if (user.savedJobs && user.savedJobs.some((id) => new mongoose.Types.ObjectId(id).equals(jobObjectId))) {
      return NextResponse.json(
        { message: "Job already saved" },
        { status: 400 }
      );
    }

    // Initialize savedJobs array if it doesn't exist
    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    // Add the jobId to savedJobs as an ObjectId
    user.savedJobs.push(jobObjectId.toString());
    await user.save();

    // Serialize savedJobs to strings for the response
    const serializedSavedJobs = user.savedJobs.map((id: string) => id.toString());

    return NextResponse.json({
      message: "Job saved successfully",
      savedJobs: serializedSavedJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}