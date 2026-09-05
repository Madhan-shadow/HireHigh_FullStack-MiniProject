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
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const role = auth.role;

  const isRecruiterSide =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';
  const isCandidate = role === 'CANDIDATE';

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">HireHigh</span>

          {isRecruiterSide && (
            <React.Fragment>
              <h1 className="home-title">Your pipeline, at a glance.</h1>
              <p className="home-subtitle">
                Review applications, move candidates through stages, and
                close roles faster — all from one dashboard built for
                hiring teams.
              </p>
              <div className="home-actions">
                <Link to="/applications" className="btn btn-primary">
                  View applications
                </Link>
                <Link to="/jobs" className="btn btn-secondary">
                  Manage jobs
                </Link>
              </div>
            </React.Fragment>
          )}

          {isCandidate && (
            <React.Fragment>
              <h1 className="home-title">Your next role starts here.</h1>
              <p className="home-subtitle">
                Browse open positions, apply in a click, and track every
                application's status in real time.
              </p>
              <div className="home-actions">
                <Link to="/jobs" className="btn btn-primary">
                  Browse open roles
                </Link>
                <Link to="/applications" className="btn btn-secondary">
                  My applications
                </Link>
              </div>
            </React.Fragment>
          )}

          {!isAuthenticated && (
            <React.Fragment>
              <h1 className="home-title">Hiring, without the mess.</h1>
              <p className="home-subtitle">
                HireHigh connects recruiters and candidates on one clear
                pipeline — from first application to signed offer.
              </p>
              <div className="home-actions">
                <Link to="/jobs" className="btn btn-primary">
                  Browse open roles
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Create an account
                </Link>
              </div>
            </React.Fragment>
          )}
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stat">
          <span className="home-stat-value">01</span>
          <span className="home-stat-label">
            Post a role and set a hiring goal
          </span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">02</span>
          <span className="home-stat-label">
            Candidates apply with resume and details
          </span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">03</span>
          <span className="home-stat-label">
            Track every stage until hired
          </span>
        </div>
      </section>
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