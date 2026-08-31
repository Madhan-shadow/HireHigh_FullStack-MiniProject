import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/layout/Login';
import Register from './components/layout/Register';
import JobList from './components/jobs/JobList';
import ApplicationList from './components/applications/ApplicationList';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
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
            <ProtectedRoute allowedRoles={['RECRUITER', 'TA_LEAD', 'HIRING_MANAGER']}>
              <ApplicationList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </div>
  );
}

export default App;