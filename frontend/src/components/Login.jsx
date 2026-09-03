import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import JobList from "./components/jobs/JobList";
import ApplicationList from "./components/application/ApplicationList";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="app-shell">

      <Navbar />

      <main className="page-container">

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem("token")
                    ? "/jobs"
                    : "/login"
                }
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

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

          <Route
            path="*"
            element={
              <Navigate
                to="/jobs"
                replace
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
}

export default App;

export { ProtectedRoute };