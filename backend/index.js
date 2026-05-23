import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import atsRoute from "./routes/ats.route.js";
import messageRoute from "./routes/message.route.js";
import resumeRoute from "./routes/resume.route.js";
import mockInterviewRoute from "./routes/mockInterview.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config({});

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/ats", atsRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/resume", resumeRoute);
app.use("/api/v1/interview", mockInterviewRoute);

// ✅ FIX: Force the server to explicitly listen on 127.0.0.1
// Trigger reload for new env key
server.listen(PORT, '127.0.0.1', () => {
    connectDB();
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});