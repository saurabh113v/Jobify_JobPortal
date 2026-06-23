#  Jobify - AI Powered Job Portal

##  Overview

Jobify is a full-stack AI-powered job portal built using the MERN stack. It connects job seekers and recruiters through a modern recruitment platform with AI-driven ATS resume analysis, mock interviews, real-time chat, and secure authentication.

The platform helps candidates improve their employability while enabling recruiters to efficiently manage job postings and applications.

---

##  Features

###  Job Seeker

* User Registration & Login
* Search Jobs by Keywords and Location
* Apply for Jobs
* Upload Resume
* AI-Based ATS Resume Evaluation
* AI Mock Interview Preparation
* Real-Time Chat with Recruiters
* Profile Management

###  Recruiter

* Recruiter Dashboard
* Create & Manage Job Posts
* View Applicants
* Manage Candidate Applications
* Real-Time Communication with Candidates

###  AI Features

* ATS Resume Scoring using Google Gemini AI
* Resume Feedback & Suggestions
* AI Mock Interview Questions
* Detailed Interview Feedback

###  Security

* JWT Authentication
* Password Hashing with bcrypt
* HTTP-Only Cookies
* Protected Routes

---

##  Tech Stack

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

##  System Architecture

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

##  Project Structure

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

##  Installation

### Clone Repository

```bash
git clone https://github.com/saurabh113v/jobify.git
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
MONGO_URI = mongodb+srv://saurabhjaiswar076_db_user:ysD3Z9vQG7Z2h0BW@cluster0.6s9ccrt.mongodb.net/?appName=Cluster0
PORT=4000
SECRET_KEY = "your_secret_key_here";
CLOUD_NAME="dhag0bxaa"
API_KEY="621475891969631"
API_SECRET="oIa0Pu5yvhp-TpSdU7bYJOefxts"
GEMINI_API_KEY=AIzaSyCBomyHPh-4QlXSnAB5p7g-XJ5Bp-19OB4
```

### Run Application

```bash
# Backend
npm run server

# Frontend
npm start
```

---

##  Screenshots

Add screenshots of:

* Home Page
  <img width="1912" height="860" alt="image" src="https://github.com/user-attachments/assets/3e21ff9f-ae22-4408-ae6e-35d06c3e84e4" />

* Job Search Page
  <img width="1912" height="866" alt="image" src="https://github.com/user-attachments/assets/5e2bd7cd-28b5-45eb-b714-e4221f24591b" />

* AI ATS Evaluation
  <img width="1911" height="862" alt="image" src="https://github.com/user-attachments/assets/192a6801-bcac-4c10-aabd-45deac86bb7e" />
  
  <img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/8ce85e60-86d0-4a90-b01e-7340397b601a" />

* Mock Interview Module
  <img width="1917" height="863" alt="image" src="https://github.com/user-attachments/assets/f42bab99-30f4-4794-ae53-6cfefb4bfacb" />

* Real-Time Chat
<img width="1915" height="856" alt="image" src="https://github.com/user-attachments/assets/daaf649c-365c-41c3-9245-062453b51cbe" />

---

##  Future Enhancements

* Video Interview Integration
* Job Recommendation Engine
* Resume Builder
* Email Notifications
* Advanced Analytics Dashboard

---

##  Author

**Saurabh Kumar**

B.Tech CSE, NIAMT Ranchi

GitHub: https://github.com/saurabh113v

LinkedIn: www.linkedin.com/in/saurabh-kumar-52202223a

E-mail id : saurabhjaiswar174@gmail.com

---

##  Support

If you found this project useful, please consider giving it a star ⭐ on GitHub.
