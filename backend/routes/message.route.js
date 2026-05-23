import express from "express";
import { sendMessage, getMessages, getConversations } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Fetch conversation list
router.route("/conversations").get(isAuthenticated, getConversations);

// Fetch message logs with another user
router.route("/all/:id").get(isAuthenticated, getMessages);

// Send new message
router.route("/send/:id").post(isAuthenticated, sendMessage);

export default router;
