# 🚀 Jobify - AI Powered Job Portal

## 📌 Overview

Jobify is a full-stack AI-powered job portal built using the MERN stack. It connects job seekers and recruiters through a modern recruitment platform with AI-driven ATS resume analysis, mock interviews, real-time chat, and secure authentication.

The platform helps candidates improve their employability while enabling recruiters to efficiently manage job postings and applications.

---

## ✨ Features

### 👨‍💼 Job Seeker

* User Registration & Login
* Search Jobs by Keywords and Location
* Apply for Jobs
* Upload Resume
* AI-Based ATS Resume Evaluation
* AI Mock Interview Preparation
* Real-Time Chat with Recruiters
* Profile Management

### 🏢 Recruiter

* Recruiter Dashboard
* Create & Manage Job Posts
* View Applicants
* Manage Candidate Applications
* Real-Time Communication with Candidates

### 🤖 AI Features

* ATS Resume Scoring using Google Gemini AI
* Resume Feedback & Suggestions
* AI Mock Interview Questions
* Detailed Interview Feedback

### 🔒 Security

* JWT Authentication
* Password Hashing with bcrypt
* HTTP-Only Cookies
* Protected Routes

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI & External Services

* Google Gemini AI
* Socket.IO
* Cloudinary
* PDF-Parse

### Security & Tools

* JWT Authentication
* bcrypt
* Git & GitHub
* Postman
* VS Code

---

## 🏗️ System Architecture

Frontend (React.js)
↓
REST APIs (Express.js)
↓
Node.js Server
↓
MongoDB Database

Additional Services:

* Google Gemini AI
* Socket.IO
* Cloudinary

---

## 📂 Project Structure

```bash
Jobify/
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── redux/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── uploads/
├── README.md
└── package.json
```

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/jobify.git
```

### Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Application

```bash
# Backend
npm run server

# Frontend
npm start
```

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Job Search Page
* Recruiter Dashboard
* AI ATS Evaluation
* Mock Interview Module
* Real-Time Chat

---

## 🎯 Future Enhancements

* Video Interview Integration
* Job Recommendation Engine
* Resume Builder
* Email Notifications
* Advanced Analytics Dashboard

---

## 👨‍💻 Author

**Saurabh Jaiswar**

B.Tech CSE, NIAMT Ranchi

GitHub: https://github.com/saurabh113v

LinkedIn: Add Your LinkedIn Profile

---

## ⭐ Support

If you found this project useful, please consider giving it a star ⭐ on GitHub.
