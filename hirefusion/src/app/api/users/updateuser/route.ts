import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { UserModel } from "@/models/User" // Adjust the import path as necessary

// ... your User schema setup here

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, username, preferences, skills, education, experience } = body

    if (!email || !username || !Array.isArray(skills) || !Array.isArray(education) || !Array.isArray(experience)) {
      return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 })
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "")
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        username,
        preferences,
        skills,
        education: education.map((edu: any) => ({
          ...edu,
          _id: edu._id.startsWith("temp-") ? new mongoose.Types.ObjectId() : edu._id,
        })),
        experience: JSON.stringify(experience),
        updatedAt: new Date(),
      },
      { new: true, lean: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    try {

  
      // Call the addjob API
      const response = await fetch('http://localhost:3000/api/recommendations/addjob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return NextResponse.json({ error: data.error || 'Failed to add job recommendations' }, { status: response.status });
      }
  
    } catch (error) {
      console.error('Error triggering add job:', error);
      return NextResponse.json({ error: 'Internal server error while jobrecommendation in update profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: updatedUser }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
