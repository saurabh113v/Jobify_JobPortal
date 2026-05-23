import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: false,
  },
  customRole: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  qa: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      score: { type: Number, required: true },
      feedback: { type: String, required: true },
      idealAnswer: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);
