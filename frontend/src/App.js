import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/jobs/JobList';
import ApplicationList from './components/applications/ApplicationList';

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
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
        <Route path="/" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </>
  );
}

export default App;