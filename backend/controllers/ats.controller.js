import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const checkAtsScore = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({
                message: "Gemini API key is missing. Please set GEMINI_API_KEY in your backend .env file to enable the ATS Score Checker.",
                success: false
            });
        }

        const file = req.file;
        const jobDescription = req.body.jobDescription;

        if (!file) {
            return res.status(400).json({
                message: "Resume file is required.",
                success: false
            });
        }

        // Parse PDF buffer
        const parser = new PDFParse({ data: file.buffer });
        const pdfData = await parser.getText();
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({
                message: "Could not extract text from the provided PDF.",
                success: false
            });
        }

        const prompt = `
You are an expert Applicant Tracking System (ATS) and a senior technical recruiter.
I will provide you with the text extracted from a candidate's resume.
${jobDescription ? `I will also provide a target Job Description.` : `There is no specific Job Description, so evaluate this as a general software engineering/professional resume.`}

Evaluate the resume and return a structured JSON response. Ensure the response is valid JSON and nothing else. No markdown wrappers.

JSON Format:
{
  "score": <number between 0 and 100 representing the ATS score>,
  "improvements": [
    "<string: point 1 on how to improve>",
    "<string: point 2 on how to improve>"
  ],
  "mistakes": [
    "<string: specific mistake or missing keyword 1>",
    "<string: specific mistake or missing keyword 2>"
  ]
}

Resume Text:
"""
${resumeText}
"""
${jobDescription ? `\nJob Description:\n"""\n${jobDescription}\n"""` : ""}
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
        if (resultText.startsWith("\`\`\`json")) {
            resultText = resultText.replace(/^\`\`\`json\s*/, "").replace(/\s*\`\`\`$/, "");
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(resultText);
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON:", resultText);
            return res.status(500).json({
                message: "Failed to parse AI response. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "ATS Score calculated successfully.",
            success: true,
            data: parsedResult
        });

    } catch (error) {
        console.error("ATS Score Check Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred while calculating the ATS score.",
            success: false,
            error: error.message
        });
    }
};
