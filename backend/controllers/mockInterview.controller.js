import { MockInterview } from "../models/mockInterview.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

// 1. Generate Interview Questions tailored to user resume and job profile/custom role
export const generateQuestions = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;

        const ai = getAIClient();
        if (!ai) {
            return res.status(400).json({
                message: "Gemini API key is missing. Please set GEMINI_API_KEY in backend .env to enable AI Mock Interviews.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        let targetRole = "";
        let targetCompany = "the target company";
        let targetDesc = "General professional capabilities and duties";
        let targetRequirements = "General professional standards and skills";

        if (jobId !== "custom") {
            const job = await Job.findById(jobId).populate("company");
            if (!job) {
                return res.status(404).json({
                    message: "Job not found.",
                    success: false
                });
            }
            targetRole = job.title;
            targetCompany = job.company?.name || "the target company";
            targetDesc = job.description;
            targetRequirements = job.requirements ? job.requirements.join(", ") : "None listed";
        } else {
            // Read custom role from request body
            targetRole = req.body.role || "Software Developer";
        }

        const skillsStr = user.profile?.skills && user.profile.skills.length > 0
            ? user.profile.skills.join(", ")
            : "General skills, standard developer capabilities";

        const bioStr = user.profile?.bio || "No professional summary bio provided yet.";

        const prompt = `
You are a highly experienced Technical Lead and Senior Hiring Manager at ${targetCompany}.
You are conducting a professional mock interview for the candidate applying for the position of "${targetRole}".

Candidate Profile Details:
- Bio/Summary: "${bioStr}"
- Key Skills: ${skillsStr}

Target Job/Role Details:
- Role Title: "${targetRole}"
- Job Description: "${targetDesc}"
- Requirements: "${targetRequirements}"

Your task is to generate exactly 5 tailored, challenging, and professional interview questions for this candidate.
Mix the questions dynamically:
- 3 technical/domain questions covering their core skills and the job's technical demands.
- 2 behavioral/situational questions assessing problem solving, teamwork, or leadership.

Ensure the questions are realistic and feel like a real live interview session.
Return the result strictly as a raw JSON object containing an array of strings under the key "questions".
Do not include any markdown wrappers or code blocks. Do not prefix with \`\`\`json.

JSON Format:
{
  "questions": [
    "Tailored Question 1",
    "Tailored Question 2",
    "Tailored Question 3",
    "Tailored Question 4",
    "Tailored Question 5"
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        let resultText = response.text;
        
        // Remove markdown formatting if the model accidentally includes it despite responseMimeType
        if (resultText.startsWith("```json")) {
            resultText = resultText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (resultText.startsWith("```")) {
            resultText = resultText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(resultText.trim());
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON:", resultText);
            return res.status(500).json({
                message: "AI generated an invalid format. Please try starting the interview again.",
                success: false
            });
        }

        if (!parsedResult.questions || !Array.isArray(parsedResult.questions)) {
            return res.status(500).json({
                message: "No questions generated. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Questions generated successfully.",
            success: true,
            questions: parsedResult.questions
        });

    } catch (error) {
        console.error("Generate Questions Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred while generating interview questions.",
            success: false,
            error: error.message
        });
    }
};

// 2. Evaluate Candidate's Answers, Save Session to MongoDB
export const evaluateAnswers = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;
        const { answers, role } = req.body; // Array of { question: string, answer: string }, custom role optional

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                message: "Answers array is required to run evaluation.",
                success: false
            });
        }

        const ai = getAIClient();
        if (!ai) {
            return res.status(400).json({
                message: "Gemini API key is missing. Please set GEMINI_API_KEY in backend .env to evaluate.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        let targetRole = "";
        let targetCompany = "the target company";
        let targetDesc = "General professional capabilities and duties";

        if (jobId !== "custom") {
            const job = await Job.findById(jobId).populate("company");
            if (!job) {
                return res.status(404).json({
                    message: "Job not found.",
                    success: false
                });
            }
            targetRole = job.title;
            targetCompany = job.company?.name || "the target company";
            targetDesc = job.description;
        } else {
            targetRole = role || "Software Developer";
        }

        const prompt = `
You are a highly demanding and professional hiring director at ${targetCompany}.
You are assessing a candidate's completed mock interview for the position of "${targetRole}".

Target Role details:
- Title: "${targetRole}"
- Description: "${targetDesc}"

Candidate details:
- Fullname: "${user.fullname}"
- Key Skills: ${user.profile?.skills?.join(", ") || "General"}

Here is the transcript of the interview containing the questions and the candidate's typed answers:
${JSON.stringify(answers, null, 2)}

Your task is to grade their answers comprehensively and output a professional scorecard.
Be constructive, rigorous, and highly detailed.
For each question:
1. Grade the answer between 0 and 100 based on technical accuracy, clarity, and communication style.
2. Provide a 2-3 sentence feedback critique detailing what was good or what critical details were missed.
3. Provide a brief "idealAnswer" (2-3 sentences max) that shows how an expert would answer it perfectly, incorporating metrics or best practices.

Calculate an overall score (0 to 100) representing their overall readiness for this job.
Provide a high-impact, motivational qualitative summary "overallFeedback" analyzing their core strengths and biggest areas of improvement.

Return the result strictly as a raw JSON object matching the format below. Do not wrap in markdown tags or include comments.
JSON Format:
{
  "overallScore": <number between 0 and 100>,
  "overallFeedback": "<string: comprehensive overview feedback of performance>",
  "qaDetails": [
    {
      "question": "<string: question text>",
      "answer": "<string: candidate's answer>",
      "score": <number: score for this specific answer out of 100>,
      "feedback": "<string: constructive critique of this answer>",
      "idealAnswer": "<string: best practice expert level response>"
    }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        let resultText = response.text;
        
        if (resultText.startsWith("```json")) {
            resultText = resultText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (resultText.startsWith("```")) {
            resultText = resultText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(resultText.trim());
        } catch (jsonError) {
            console.error("Failed to parse Gemini evaluation response as JSON:", resultText);
            return res.status(500).json({
                message: "AI generated an invalid format for grading. Please try submitting again.",
                success: false
            });
        }

        // Save session in MongoDB
        const qaData = parsedResult.qaDetails.map((q) => ({
            question: q.question,
            answer: q.answer || "No response provided",
            score: Number(q.score) || 0,
            feedback: q.feedback || "No feedback generated",
            idealAnswer: q.idealAnswer || "No ideal answer available"
        }));

        const mockInterview = await MockInterview.create({
            user: userId,
            job: jobId !== "custom" ? jobId : undefined,
            customRole: jobId === "custom" ? targetRole : undefined,
            score: Number(parsedResult.overallScore) || 0,
            feedback: parsedResult.overallFeedback || "Practice session completed.",
            qa: qaData
        });

        return res.status(201).json({
            message: "Interview evaluated and saved successfully.",
            success: true,
            data: mockInterview
        });

    } catch (error) {
        console.error("Evaluate Answers Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred while evaluating the interview.",
            success: false,
            error: error.message
        });
    }
};

// 3. Fetch past mock interviews for the candidate student
export const getInterviewHistory = async (req, res) => {
    try {
        const userId = req.id;
        const interviews = await MockInterview.find({ user: userId })
            .populate({
                path: "job",
                select: "title location company salary",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "History fetched successfully.",
            success: true,
            interviews
        });
    } catch (error) {
        console.error("Get Interview History Error:", error);
        return res.status(500).json({
            message: "Failed to fetch practice log history.",
            success: false
        });
    }
};

// 4. Fetch specific mock interview scorecard session
export const getInterviewSession = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await MockInterview.findById(id)
            .populate({
                path: "job",
                select: "title description location company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            });

        if (!interview) {
            return res.status(404).json({
                message: "Interview session not found.",
                success: false
            });
        }

        // Secure that only the owner can view their practice report
        if (interview.user.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "Unauthorized access to this session report.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        console.error("Get Interview Session Error:", error);
        return res.status(500).json({
            message: "Failed to fetch interview session report.",
            success: false
        });
    }
};
