import { JobRecommendationModel } from "@/models/User";
import { UserModel } from "@/models/User"; // Import your User model here
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    const { email, jobRecommendations } = await request.json();

    if (!email || !Array.isArray(jobRecommendations) || jobRecommendations.length === 0) {
      return NextResponse.json({ error: "Missing email or jobRecommendations array" }, { status: 400 });
    }

    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found with provided email" }, { status: 404 });
    }

    // Validate each job recommendation
    for (const recommendation of jobRecommendations) {
      if (!recommendation.jobID || typeof recommendation.matchPercentage !== "number" || recommendation.matchPercentage < 0 || recommendation.matchPercentage > 100) {
        return NextResponse.json({ error: "Invalid job recommendation data" }, { status: 400 });
      }
    }

    // Prepare an array of job recommendations to insert
    const recommendations = jobRecommendations.map((rec) => ({
      userID: user._id, // Use found user ID
      jobID: new mongoose.Types.ObjectId(rec.jobID),
      matchPercentage: rec.matchPercentage,
    }));

    // Insert multiple job recommendations at once
    await JobRecommendationModel.insertMany(recommendations);

    return NextResponse.json({ message: "Job recommendations added successfully", recommendations }, { status: 201 });
  } catch (error) {
    console.error("Error adding recommendations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
