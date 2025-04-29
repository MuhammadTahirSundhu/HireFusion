import { JobRecommendationModel } from "@/models/User";
import { UserModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { getJobRecommendations } from "@/lib/getJobRecommendations";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found with provided email" }, { status: 404 });
    }

    // Get job recommendations
    const jobRecommendations = await getJobRecommendations(email);

    if (jobRecommendations.length === 0) {
      return NextResponse.json({ message: "No job recommendations found" }, { status: 200 });
    }

    // Prepare recommendations for insertion
    const recommendations = jobRecommendations.map((rec) => ({
      userID: user._id,
      jobID: new mongoose.Types.ObjectId(rec.jobID),
      matchPercentage: rec.matchPercentage,
    }));

    // Clear the JobRecommendationModel collection
    await JobRecommendationModel.deleteMany({});

    // Insert new recommendations into the database
    await JobRecommendationModel.insertMany(recommendations);

    return NextResponse.json({ message: "Job recommendations added successfully", recommendations }, { status: 201 });
  } catch (error) {
    console.error("Error adding recommendations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}