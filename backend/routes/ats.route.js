import express from "express";
import { checkAtsScore } from "../controllers/ats.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/check").post(isAuthenticated, singleUpload, checkAtsScore);

export default router;
