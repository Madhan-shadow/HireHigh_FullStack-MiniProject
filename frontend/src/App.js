import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";

import JobList from "./components/jobs/JobList";
import ApplicationList from "./components/applications/ApplicationList";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationList />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}