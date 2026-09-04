import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import ChangePasswordModal from '../common/ChangePasswordModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const canSeePipeline =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);
  const displayName = user?.fullName || role || 'user';
  const initial = displayName.charAt(0).toUpperCase();

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
          <div className="profile-menu" ref={menuRef}>
            <button
              className="profile-menu-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="profile-menu-avatar">{initial}</span>
              <span className="welcome-text">{displayName.toLowerCase()}</span>
            </button>

            {menuOpen && (
              <div className="profile-menu-dropdown">
                <div className="profile-menu-header">
                  <span className="profile-menu-name">{displayName}</span>
                  <span className="profile-menu-role">{(role || '').toLowerCase()}</span>
                </div>
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowPasswordModal(true);
                  }}
                >
                  Change password
                </button>
                <button className="profile-menu-item profile-menu-item--danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
        )}
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;