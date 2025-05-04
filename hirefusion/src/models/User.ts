import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface and Schema (Unchanged)
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified: boolean;
  name?: string;
  skills?: string[];
  experience?: string;
  preferences?: string;
  savedJobs?: string[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }[];
}

const UserSchema: Schema<User> = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    verifyCode: { type: String, required: true },
    verifyCodeExpire: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    name: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experience: { type: String, trim: true },
    preferences: { type: String, trim: true },
    savedJobs: [{ type: String, trim: true }],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        field: { type: String, trim: true },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);


// Job Scraper Interface and Schema (Unchanged)
export interface JobScraper extends Document {
  sourceWebsite: string;
  scrapingInterval: string;
  lastUpdated: Date;
}

const JobScraperSchema: Schema<JobScraper> = new Schema(
  {
    sourceWebsite: { type: String, required: true, unique: true, trim: true },
    scrapingInterval: { type: String, required: true, trim: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Job Interface and Schema (Updated)
export interface Job extends Document {
  job_title: string;
  company_name: string;
  job_location: string;
  job_type: string;
  salary?: string;
  apply_link?: string;
  skills_required: string[];
  description: string;
  job_link: string;
}

export interface INotification extends Document {
  message: string
  type: "info" | "warning" | "success"
  createdAt: Date
  userEmail: string
}

const NotificationSchema: Schema = new Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "warning", "success"], required: true },
  createdAt: { type: Date, default: Date.now },
  userEmail: { type: String, required: true, index: true },
})


const JobSchema: Schema<Job> = new Schema(
  {
    job_title: { type: String, required: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    job_location: { type: String, required: true, trim: true },
    job_type: { type: String, required: true, trim: true },
    salary: { type: String, trim: true },
    apply_link: { type: String, trim: true },
    skills_required: [{ type: String, trim: true }],
    description: { type: String, required: true, trim: true },
    job_link: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
// Job Application Interface and Schema (Unchanged)
export interface JobApplication extends Document {
  userID: mongoose.Types.ObjectId;
  jobID: mongoose.Types.ObjectId;
  status: string;
  appliedDate: Date;
}

const JobApplicationSchema: Schema<JobApplication> = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobID: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offered", "Rejected"],
      default: "Applied",
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Job Recommendation Interface and Schema (Unchanged)
export interface JobRecommendation extends Document {
  userID: mongoose.Types.ObjectId;
  jobID: mongoose.Types.ObjectId;
  matchPercentage: number;
}

const JobRecommendationSchema: Schema<JobRecommendation> = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobID: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    matchPercentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Password hashing middleware for User and Admin (Unchanged)
UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Model Exports
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

const JobScraperModel =
  (mongoose.models.JobScraper as mongoose.Model<JobScraper>) ||
  mongoose.model<JobScraper>("JobScraper", JobScraperSchema);

const JobModel =
  (mongoose.models.Job as mongoose.Model<Job>) ||
  mongoose.model<Job>("Job", JobSchema);

const JobApplicationModel =
  (mongoose.models.JobApplication as mongoose.Model<JobApplication>) ||
  mongoose.model<JobApplication>("JobApplication", JobApplicationSchema);

const JobRecommendationModel =
  (mongoose.models.JobRecommendation as mongoose.Model<JobRecommendation>) ||
  mongoose.model<JobRecommendation>("JobRecommendation", JobRecommendationSchema);

const NotificationModel = mongoose.models.Notification ||
 mongoose.model<INotification>("Notification", NotificationSchema)

export {
  UserModel,
  JobScraperModel,
  JobModel,
  JobApplicationModel,
  JobRecommendationModel,
  NotificationModel
};