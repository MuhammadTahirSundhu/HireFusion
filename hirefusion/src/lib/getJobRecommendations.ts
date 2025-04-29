import { UserModel, JobModel } from "@/models/User";
import { calculateCosineSimilarity } from "./skillsimilarity";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

interface JobRecommendation {
  jobID: string;
  matchPercentage: number;
}

function normalizeSkill(skill: string): string {
  let normalized = skill.toLowerCase().trim();
  normalized = normalized.replace(/\s*\d+(\.\d+)*\s*/g, "");
  const synonyms: { [key: string]: string } = {
    javascript: "javascript",
    js: "javascript",
    node: "nodejs",
    "node.js": "nodejs",
    python3: "python",
    "web development": "web development",
    frontend: "frontend development",
    "front-end": "frontend development",
    backend: "backend development",
    "back-end": "backend development",
  };
  return synonyms[normalized] || normalized;
}

export async function getJobRecommendations(email: string): Promise<JobRecommendation[]> {
  try {
    await dbConnect();
    const user = await UserModel.findOne({ email }).select("skills");
    if (!user) {
      console.error(`No user found with email: ${email}`);
      throw new Error("User not found");
    }
    if (!user.skills || user.skills.length === 0) {
      console.error(`User ${email} has no skills`);
      throw new Error("User has no skills");
    }
    const userSkills = user.skills.map(normalizeSkill);
    const totalJobs = await JobModel.countDocuments();
    if (totalJobs === 0) {
      console.error("No jobs found in the database");
      throw new Error("No jobs available");
    }
    const chunkSize = 50;
    const totalChunks = Math.ceil(totalJobs / chunkSize);
    const chunkPromises = [];
    for (let i = 0; i < totalChunks; i++) {
      chunkPromises.push(
        JobModel.find()
          .skip(i * chunkSize)
          .limit(chunkSize)
          .select("skills_required _id")
          .lean()
      );
    }
    const jobChunks = await Promise.all(chunkPromises);
    const jobs = jobChunks.flat();
    const allSkills = [...new Set([
      ...userSkills,
      ...jobs.flatMap(job => (job.skills_required || []).map(normalizeSkill))
    ])];
    const recommendationPromises = jobs.map(async (job) => {
      const jobSkills = (job.skills_required || []).map(normalizeSkill);
      const userVector = allSkills.map(skill => userSkills.includes(skill) ? 1 : 0);
      const jobVector = allSkills.map(skill => jobSkills.includes(skill) ? 1 : 0);
      let cosineScore = calculateCosineSimilarity(userVector, jobVector);
      cosineScore = Math.pow(cosineScore, 0.5);
      cosineScore = Math.min(cosineScore * 2.0, 1.0);
      cosineScore = Math.max(cosineScore, 0.3);
      const matchPercentage = Math.round(cosineScore * 100);
      return {
        jobID: job._id.toString(),
        matchPercentage,
      };
    });
    let recommendations = await Promise.all(recommendationPromises);
    recommendations = recommendations.filter(rec => rec.matchPercentage >= 50);
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    console.log(recommendations.length, "job recommendations found for user:", email);
    return recommendations;
  } catch (error) {
    console.error("Error generating job recommendations:", error);
    throw new Error("Failed to generate job recommendations");
  }
}