import express from "express";
import { 
    generateQuestions, 
    evaluateAnswers, 
    getInterviewHistory, 
    getInterviewSession 
} from "../controllers/mockInterview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/generate/:jobId").post(isAuthenticated, generateQuestions);
router.route("/evaluate/:jobId").post(isAuthenticated, evaluateAnswers);
router.route("/history").get(isAuthenticated, getInterviewHistory);
router.route("/session/:id").get(isAuthenticated, getInterviewSession);

export default router;
