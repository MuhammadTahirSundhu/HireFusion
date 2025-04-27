// File: app/api/saved-jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User"; // Adjust path to your models
import mongoose from "mongoose";

  
// GET: Retrieve all saved jobs for a user by email
export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");
      console.log("Email:", email); // Debugging line
      
      if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
        return NextResponse.json(
          { message: "Invalid or missing email" },
          { status: 400 }
        );
      }
  
      const user = await UserModel.findOne({ email }).populate({
        path: "savedJobs",
        select:
          "job_title company_name job_location job_type salary skills_required description job_link",
      });
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ savedJobs: user.savedJobs });
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: (error as Error).message },
        { status: 500 }
      );
    }
  }