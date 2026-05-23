import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AtsChecker from './components/AtsChecker'
import Chat from './components/Chat'
import ResumeMaker from './components/ResumeMaker/ResumeMaker'
import MockInterview from './components/MockInterview/MockInterview'
import MockInterviewResult from './components/MockInterview/MockInterviewResult'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/ats-checker",
    element: <AtsChecker />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/resume-maker",
    element: <ResumeMaker />
  },
  {
    path: "/interview-prep/:jobId",
    element: <MockInterview />
  },
  {
    path: "/face-to-face-interview",
    element: <MockInterview />
  },
  {
    path: "/interview-result/:id",
    element: <MockInterviewResult />
  },
  // admin ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  }
])

function App() {
  return (
    <div>
      <RouterProvider 
        router={appRouter} 
        future={{ v7_startTransition: true }} 
      />
    </div>
  )
}

export default App