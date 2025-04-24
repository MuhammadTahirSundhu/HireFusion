import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

// ---------- Types ----------
interface Experience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface ProfilePayload {
  // required identifier
  email: string;            // or change to _id: string if you prefer
  // optional profile fields
  skills?: string[];
  experience?: Experience[];
  preferences?: string;
  savedJobs?: string[];
  education?: Education[];
}

// ---------- POST /api/user/add-profile ----------
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      email,                 // <-- identifier
      skills,
      experience,
      preferences,
      savedJobs,
      education,
    }: ProfilePayload = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "User email (or id) is required" },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};
    if (skills) update.skills = skills;
    if (experience) update.experience = JSON.stringify(experience);
    if (preferences !== undefined) update.preferences = preferences;
    if (savedJobs) update.savedJobs = savedJobs;
    if (education) update.education = education;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },             // or { _id: id }
      { $set: update },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("add-profile POST error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
