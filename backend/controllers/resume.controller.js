import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Refine Summary using Gemini AI
export const refineSummary = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({
                message: "Gemini API key is missing. Please set GEMINI_API_KEY in your backend .env file.",
                success: false
            });
        }

        const { role, skills, draftSummary } = req.body;

        const prompt = `
You are a highly experienced professional resume writer and career coach.
Your task is to write a highly compelling, punchy, ATS-friendly, and professional resume summary statement for a candidate.

Target Role: ${role || "Software Engineer / Professional"}
Key Skills: ${skills && Array.isArray(skills) ? skills.join(", ") : skills || "None specified"}
Candidate's Draft/Details: "${draftSummary || "A highly motivated professional looking to grow."}"

Rewrite this summary to be outstanding, high-impact, and professional. 
Keep it concise, between 2 to 4 sentences maximum. Focus on value delivered, skills, and professional drive.

Return the result as a raw JSON object only. No markdown formatting.
JSON Format:
{
  "summary": "<the professional summary text generated>"
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
        
        if (resultText.startsWith("\`\`\`json")) {
            resultText = resultText.replace(/^\`\`\`json\s*/, "").replace(/\s*\`\`\`$/, "");
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(resultText);
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON for summary:", resultText);
            return res.status(500).json({
                message: "Failed to generate summary via AI. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Resume summary refined successfully.",
            success: true,
            data: parsedResult
        });

    } catch (error) {
        console.error("Refine Summary Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred while refining summary.",
            success: false,
            error: error.message
        });
    }
};

// Refine Bullet Points for Work Experience using Gemini AI
export const refineBulletPoints = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({
                message: "Gemini API key is missing. Please set GEMINI_API_KEY in your backend .env file.",
                success: false
            });
        }

        const { role, company, rawBullets } = req.body;

        if (!rawBullets) {
            return res.status(400).json({
                message: "Raw details or drafts are required to refine bullet points.",
                success: false
            });
        }

        const prompt = `
You are an expert technical CV writer and senior recruiter.
Your task is to take a draft job description or a list of raw tasks and rewrite them into 3 to 4 professional, action-oriented, and high-impact resume bullet points.

Job Title: ${role || "Software Developer / Professional"}
Company: ${company || "Tech Company"}
Candidate's Draft Tasks/Achievements:
"""
${rawBullets}
"""

Guidelines for writing bullet points:
1. Start each bullet point with a strong, active verb (e.g., "Led", "Architected", "Optimized", "Spearheaded"). Avoid passive descriptions like "Responsible for...".
2. Focus on achievements, results, and business value rather than just listing day-to-day duties.
3. Where possible, make them look impact-driven or metric-driven (using the X-Y-Z formula: Accomplished [X], measured by [Y], by doing [Z]).
4. Keep each bullet point clean, concise, and focused.

Return the result as a raw JSON object only. No markdown formatting.
JSON Format:
{
  "bullets": [
    "<bullet point 1>",
    "<bullet point 2>",
    "<bullet point 3>",
    "<bullet point 4 (optional)>"
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
        
        if (resultText.startsWith("\`\`\`json")) {
            resultText = resultText.replace(/^\`\`\`json\s*/, "").replace(/\s*\`\`\`$/, "");
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(resultText);
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON for bullet points:", resultText);
            return res.status(500).json({
                message: "Failed to refine bullet points via AI. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Work experience bullet points refined successfully.",
            success: true,
            data: parsedResult
        });

    } catch (error) {
        console.error("Refine Bullet Points Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred while refining experience bullets.",
            success: false,
            error: error.message
        });
    }
};
