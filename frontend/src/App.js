import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/jobs/JobList';
import ApplicationList from './components/applications/ApplicationList';
import ProfilePage from './components/ProfilePage';
import { fetchJobs } from './store/slices/jobSlice';
import { fetchApplications, fetchMyApplications } from './store/slices/applicationSlice';
import './App.css';
import './styles.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const STAGE_LABELS = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

const Home = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const role = auth.role;
  const user = auth.user;

  const isRecruiterSide =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';
  const isCandidate = role === 'CANDIDATE';

  const jobsState = useSelector((state) => state.jobs);
  const jobs = jobsState.items || [];

  const appsState = useSelector((state) => state.applications);
  const appItems = appsState.items || [];
  const totalApplicants = appsState.totalElements || 0;

  // Public job listing loads for everyone (recruiters, candidates, and
  // visitors alike) so even a logged-out visitor sees real activity.
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (isRecruiterSide) {
      // Larger page size here so the recent-activity list and hired
      // count reflect more than just the first 5 records.
      dispatch(fetchApplications({ page: 0, size: 50 }));
    } else if (isCandidate) {
      dispatch(fetchMyApplications());
    }
  }, [dispatch, isRecruiterSide, isCandidate]);

  const displayName = (user && user.fullName) || (role ? role.toLowerCase() : 'there');

  if (isRecruiterSide) {
    const openJobsCount = jobs.filter((j) => j.status === 'OPEN').length;
    const hiredCount = appItems.filter((a) => a.currentStage === 'HIRED').length;
    const interviewingCount = appItems.filter((a) => a.currentStage === 'INTERVIEW').length;
    const recent = appItems.slice(0, 5);

    return (
      <div className="page-container">
        <div className="dash-header">
          <h1>Welcome back, {displayName}.</h1>
          <p className="dash-subtitle">Here's where your pipeline stands right now.</p>
        </div>

        <div className="stat-cards">
          <div className="stat-card accent-blue">
            <span className="stat-value">{openJobsCount}</span>
            <span className="stat-label">Open roles</span>
          </div>
          <div className="stat-card accent-gold">
            <span className="stat-value">{totalApplicants}</span>
            <span className="stat-label">Total applicants</span>
          </div>
          <div className="stat-card accent-coral">
            <span className="stat-value">{interviewingCount}</span>
            <span className="stat-label">In interview</span>
          </div>
          <div className="stat-card accent-purple">
            <span className="stat-value">{hiredCount}</span>
            <span className="stat-label">Hired</span>
          </div>
        </div>

        <div className="dash-actions">
          <Link to="/jobs" className="btn btn-primary">Manage jobs</Link>
          <Link to="/applications" className="btn btn-secondary">View all applications</Link>
        </div>

        {recent.length > 0 && (
          <div className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Recent activity</h2>
              <Link to="/applications" className="btn btn-link">View all</Link>
            </div>
            <div className="row-list">
              {recent.map((app) => {
                const candidateName =
                  app.candidate && app.candidate.user ? app.candidate.user.fullName : '—';
                const jobTitle = app.job ? app.job.title : '—';
                const appliedDate = app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : '—';

                return (
                  <div className="row-list-row dash-activity-row" key={app.id}>
                    <span className="cell-title">{candidateName}</span>
                    <span className="cell-muted">{jobTitle}</span>
                    <span className={`status-chip status-${(app.currentStage || '').toLowerCase()}`}>
                      {STAGE_LABELS[app.currentStage] || app.currentStage}
                    </span>
                    <span className="cell-mono">{appliedDate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isCandidate) {
    const counts = {};
    STAGES.forEach((s) => { counts[s] = 0; });
    appItems.forEach((app) => {
      if (counts[app.currentStage] != null) {
        counts[app.currentStage] += 1;
      }
    });

    const recent = appItems.slice(0, 5);

    return (
      <div className="page-container">
        <div className="dash-header">
          <h1>Welcome back, {displayName}.</h1>
          <p className="dash-subtitle">
            {appItems.length > 0
              ? `You have ${appItems.length} application${appItems.length === 1 ? '' : 's'} in progress.`
              : "You haven't applied to any roles yet."}
          </p>
        </div>

        <div className="stage-summary-row">
          {STAGES.filter((s) => s !== 'REJECTED').map((s) => (
            <div className="stage-summary-pill" key={s}>
              <span className="stage-summary-count">{counts[s]}</span>
              <span className="stage-summary-label">{STAGE_LABELS[s]}</span>
            </div>
          ))}
        </div>

        <div className="dash-actions">
          <Link to="/jobs" className="btn btn-primary">Browse open roles</Link>
          <Link to="/applications" className="btn btn-secondary">View my applications</Link>
        </div>

        {recent.length > 0 && (
          <div className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Recent applications</h2>
            </div>
            <div className="row-list">
              {recent.map((app) => {
                const jobTitle = app.job ? app.job.title : '—';
                const appliedDate = app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : '—';

                return (
                  <div className="row-list-row dash-activity-row-2" key={app.id}>
                    <span className="cell-title">{jobTitle}</span>
                    <span className={`status-chip status-${(app.currentStage || '').toLowerCase()}`}>
                      {STAGE_LABELS[app.currentStage] || app.currentStage}
                    </span>
                    <span className="cell-mono">{appliedDate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Visitor (not authenticated) — public job count is real, fetched above.
  const openJobsCount = jobs.filter((j) => j.status === 'OPEN').length;

  return (
    <div className="page-container">
      <div className="visitor-hero">
        <span className="home-hero-eyebrow">Talent Acquisition, Simplified</span>
        <h1 className="home-hero-headline">Find who's next.</h1>
        <p className="home-hero-sub">
          HireHigh brings recruiters, hiring leads, and candidates onto one
          pipeline — from the first application to the signed offer.
        </p>
        <div className="home-cta-row">
          <Link to="/jobs" className="btn btn-primary">
            {openJobsCount > 0 ? `View ${openJobsCount} open role${openJobsCount === 1 ? '' : 's'}` : 'View open roles'}
          </Link>
          <Link to="/register" className="btn btn-secondary">Create an account</Link>
          <Link to="/login" className="btn btn-secondary">Sign in</Link>
        </div>
      </div>

      <div className="visitor-steps">
        <div className="visitor-step">
          <span className="visitor-step-number">01</span>
          <h3>Post a role</h3>
          <p>Recruiters set a hiring goal and publish the opening in seconds.</p>
        </div>
        <div className="visitor-step">
          <span className="visitor-step-number">02</span>
          <h3>Candidates apply</h3>
          <p>One application form with resume, skills, and experience attached.</p>
        </div>
        <div className="visitor-step">
          <span className="visitor-step-number">03</span>
          <h3>Track every stage</h3>
          <p>Applied, Screening, Interview, Offer, Hired — all in one pipeline.</p>
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