import express from "express";
import { refineSummary, refineBulletPoints } from "../controllers/resume.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/refine-summary").post(isAuthenticated, refineSummary);
router.route("/refine-bullets").post(isAuthenticated, refineBulletPoints);

export default router;
