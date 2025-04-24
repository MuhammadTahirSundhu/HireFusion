import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import mongoose from "mongoose"
import { NextApiRequest, NextApiResponse } from "next"

// Define the User schema (adjust based on your actual schema)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  isVerified: Boolean,
  skills: [String],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      _id: mongoose.Schema.Types.ObjectId,
    },
  ],
  experience: String, // Stored as JSON string
  preferences: String,
  createdAt: Date,
  updatedAt: Date,
})

const User = mongoose.models.UserModel || mongoose.model("UserModel", userSchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "")
    }

    // Get the session
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized: Please sign in" })
    }

    // Parse request body
    const { email, username, preferences, skills, education, experience } = req.body
    if (!email || email !== session.user.email) {
      return res.status(403).json({ message: "Forbidden: You can only update your own profile" })
    }

    // Validate required fields
    if (!username || !Array.isArray(skills) || !Array.isArray(education) || !Array.isArray(experience)) {
      return res.status(400).json({ message: "Missing or invalid required fields" })
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
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
      return res.status(404).json({ message: "User not found" })
    }

    // Return the updated profile
    res.status(200).json({ profile: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}