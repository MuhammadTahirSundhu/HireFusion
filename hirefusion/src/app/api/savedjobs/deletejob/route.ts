// File: app/api/saved-jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User"; // Adjust path to your models
import mongoose from "mongoose";

  // File: app/api/saved-jobs/remove/route.ts
  export async function POST(req: NextRequest) {
    try {
      const { email, jobId } = await req.json();
  
      if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
        return NextResponse.json(
          { message: "Invalid or missing email" },
          { status: 400 }
        );
      }
  
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
      }
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      if (!user.savedJobs) {
        return NextResponse.json(
          { message: "User has no saved jobs" },
          { status: 400 }
        );
      }
      const jobIndex = user.savedJobs.indexOf(jobId);
      if (jobIndex === -1) {
        return NextResponse.json(
          { message: "Job not found in saved jobs" },
          { status: 400 }
        );
      }
  
      user.savedJobs.splice(jobIndex, 1);
      await user.save();
  
      return NextResponse.json({
        message: "Job removed successfully",
        savedJobs: user.savedJobs,
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: (error as Error).message },
        { status: 500 }
      );
    }
  }