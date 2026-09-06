import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/jobs/JobList';
import ApplicationList from './components/applications/ApplicationList';
import ProfilePage from './components/ProfilePage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-hero">
      <div className="home-hero-content">
        <span className="home-hero-eyebrow">Talent Acquisition, Simplified</span>
        <h1 className="home-hero-headline">Find who's next.</h1>
        <p className="home-hero-sub">
          HireHigh brings recruiters, hiring leads, and candidates onto one
          pipeline — from the first application to the signed offer.
        </p>
        <div className="home-cta-row">
          <Link to="/jobs" className="btn btn-primary">
            {isAuthenticated ? 'Browse open roles' : 'View open roles'}
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary">
              Create an account
            </Link>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="home-feature-card">
          <span className="home-feature-icon" aria-hidden="true">🎯</span>
          <h3>One pipeline, every stage</h3>
          <p>Track candidates from Applied through Hired without leaving the app.</p>
        </div>
        <div className="home-feature-card">
          <span className="home-feature-icon" aria-hidden="true">⚡</span>
          <h3>Built for recruiters</h3>
          <p>Post roles, set hiring goals, and move candidates forward in a click.</p>
        </div>
        <div className="home-feature-card">
          <span className="home-feature-icon" aria-hidden="true">📄</span>
          <h3>Simple for candidates</h3>
          <p>Apply once, attach a resume link, and track your status in real time.</p>
        </div>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;