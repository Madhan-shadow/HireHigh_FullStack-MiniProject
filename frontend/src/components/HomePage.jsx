import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
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

export default HomePage;