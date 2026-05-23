import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "recruiter"],
    default: "student",
    required: true,
  },
  profile:{
    bio: {type: String},
    skills: [{type: String}],
    resume: {type: String},// URL to the resume file
    resumeOriginalName: {type: String}, // Original name of the uploaded resume file
    company: {type: mongoose.Schema.Types.ObjectId, ref: "Company"}, // For recruiters
    profilePhoto:{
      type: String, // URL to the profile photo
      default:""
    }
  },
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);