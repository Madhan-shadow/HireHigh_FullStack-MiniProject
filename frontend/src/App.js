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
import './Home.css';

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

  var headline = 'Hiring, without the mess.';
  var subtitle =
    "HireHigh connects recruiters and candidates on one clear pipeline — from first application to signed offer.";
  var primaryLabel = 'Browse open roles';
  var primaryTo = '/jobs';

  if (isRecruiterSide) {
    headline = 'Your pipeline, at a glance.';
    subtitle =
      'Review applications, move candidates through stages, and close roles faster — all from one dashboard.';
    primaryLabel = 'View applications';
    primaryTo = '/applications';
  } else if (isCandidate) {
    headline = 'Your next role starts here.';
    subtitle =
      'Browse open positions, apply in a click, and track every application in real time.';
    primaryLabel = 'Browse open roles';
    primaryTo = '/jobs';
  }

  return (
    <div className="home-split">
      <div className="home-split-left">
        <span className="home-mark">HH</span>
        <h1 className="home-headline">{headline}</h1>
        <p className="home-sub">{subtitle}</p>

        <div className="home-cta-row">
          <Link to={primaryTo} className="btn btn-primary">
            {primaryLabel}
          </Link>
          {!isAuthenticated && (
            <React.Fragment>
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Create account
              </Link>
            </React.Fragment>
          )}
        </div>

        <div className="home-metrics">
          <div>
            <span className="home-metric-value">6</span>
            <span className="home-metric-label">Pipeline stages</span>
          </div>
          <div>
            <span className="home-metric-value">1</span>
            <span className="home-metric-label">Place to track it all</span>
          </div>
        </div>
      </div>

      <div className="home-split-right">
        <div className="home-pipeline-card">
          <span className="home-pipeline-title">Live pipeline</span>
          <ul className="home-pipeline-list">
            <li className="home-pipeline-stage home-pipeline-stage--done">
              <span className="home-pipeline-dot" />
              Applied
            </li>
            <li className="home-pipeline-stage home-pipeline-stage--done">
              <span className="home-pipeline-dot" />
              Screening
            </li>
            <li className="home-pipeline-stage home-pipeline-stage--active">
              <span className="home-pipeline-dot" />
              Interview
            </li>
            <li className="home-pipeline-stage">
              <span className="home-pipeline-dot" />
              Offer
            </li>
            <li className="home-pipeline-stage">
              <span className="home-pipeline-dot" />
              Hired
            </li>
          </ul>
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