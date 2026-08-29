import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const canSeePipeline =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">HireHigh</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        {isAuthenticated && canSeePipeline && <Link to="/applications">Applications</Link>}
        {isAuthenticated && role === 'CANDIDATE' && (
          <Link to="/applications">My Applications</Link>
        )}
      </div>
      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">
              Welcome back, {(user?.fullName || role || 'user').toLowerCase()}
            </span>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;