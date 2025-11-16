import { Routes, Route } from "react-router-dom";
import React from "react";
import ProtectedRoute from "../components/misc/ProtectedRoute";


import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PublicRoute from "./PublicRoute";

const JobDetails = React.lazy(() => import("../pages/Jobs/JobDetails"));
const EmployerDashboard = React.lazy(
  () => import("../pages/Employer/Dashboard")
);
const PostJob = React.lazy(() => import("../pages/Employer/PostJob"));
const CandidateDashboard = React.lazy(
  () => import("../pages/Candidate/Dashboard")
);
const EmployerTransactions = React.lazy(() => import("../pages/Employer/Transactions"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute role="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute role="employer">
            <PostJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/update-job/:id"
        element={
          <ProtectedRoute role="employer">
            <PostJob isEdit={true} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/transactions"
        element={
          <ProtectedRoute role="employer">
            <EmployerTransactions />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
