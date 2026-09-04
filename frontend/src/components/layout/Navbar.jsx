import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="navbar-brand-mark">H</span>
          <span className="navbar-brand-word">HireHigh</span>
        </Link>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/jobs" className={linkClass}>
          Jobs
        </NavLink>
        {isAuthenticated && canSeePipeline && (
          <NavLink to="/applications" className={linkClass}>
            Applications
          </NavLink>
        )}
        {isAuthenticated && role === 'CANDIDATE' && (
          <>
            <NavLink to="/applications" className={linkClass}>
              My applications
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              My profile
            </NavLink>
          </>
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