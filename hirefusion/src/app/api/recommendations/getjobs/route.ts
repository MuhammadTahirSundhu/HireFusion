import { JobRecommendationModel } from "@/models/User";
import { JobModel } from "@/models/User";
import { UserModel } from "@/models/User"; // Make sure UserModel is imported
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email");

  console.log("Fetching recommended jobs for user:", userEmail);
  
  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  await dbConnect();

  try {
    // Step 1: Find the user by email
    const user = await UserModel.findOne({ email: userEmail }).select("_id"); // Only select _id, faster

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    // Step 2: Find all job recommendations for the user
    const recommendations = await JobRecommendationModel.find({ userID: userId }).select("jobID");

    if (recommendations.length === 0) {
      return NextResponse.json({ error: "No recommendations found for this user" }, { status: 404 });
    }

    // Step 3: Extract all job IDs
    const jobIds = recommendations.map(rec => rec.jobID);

    // Step 4: Fetch all matching jobs
    const jobs = await JobModel.find({ _id: { $in: jobIds } });

    return NextResponse.json(jobs, { status: 200 });

  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
