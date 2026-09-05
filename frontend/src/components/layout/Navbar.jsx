import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import userService from '../../services/userService';
import candidateService from '../../services/candidateService';

const ROLE_ABBR = {
  CANDIDATE: 'C',
  RECRUITER: 'R',
  TA_LEAD: 'TA',
  HIRING_MANAGER: 'HM',
};

const ROLE_LABELS = {
  CANDIDATE: 'Candidate',
  RECRUITER: 'Recruiter',
  TA_LEAD: 'TA Lead',
  HIRING_MANAGER: 'Hiring Manager',
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
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

  // Pull the real account record so the navbar shows the person's actual
  // name rather than falling back to their role label.
  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      userService
        .getMyAccount()
        .then((data) => {
          if (!cancelled) setAccountInfo(data);
        })
        .catch(() => {
          // Non-fatal — we just keep using whatever we already have.
        });
    } else {
      setAccountInfo(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Candidates can upload a profile photo — show it in the avatar circle
  // once it's set, instead of always falling back to the initial letter.
  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated && role === 'CANDIDATE') {
      candidateService
        .getMyProfile()
        .then((data) => {
          if (!cancelled) setPhotoUrl(data?.photoUrl || null);
        })
        .catch(() => {
          if (!cancelled) setPhotoUrl(null);
        });
    } else {
      setPhotoUrl(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, role]);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const canSeePipeline =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  const displayName = accountInfo?.fullName || user?.fullName || role || 'user';
  const initial = displayName.charAt(0).toUpperCase();

  const roleAbbr = ROLE_ABBR[role] || (role ? role.charAt(0).toUpperCase() : '');
  const roleLabel = ROLE_LABELS[role] || (role ? role.toLowerCase() : '');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          {isAuthenticated && roleAbbr ? (
            <span className="navbar-role-mark">
              <span className="navbar-role-mark-abbr">{roleAbbr}</span>
              <span className="navbar-role-mark-full">{roleLabel}</span>
            </span>
          ) : (
            <span className="navbar-brand-mark">H</span>
          )}
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
          <NavLink to="/applications" className={linkClass}>
            My applications
          </NavLink>
        )}
      </div>
      <div className="navbar-user">
        {isAuthenticated ? (
          <div className="profile-menu" ref={menuRef}>
            <button
              className="profile-menu-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="profile-menu-avatar">
                {photoUrl ? (
                  <img src={photoUrl} alt={`${displayName}'s photo`} />
                ) : (
                  initial
                )}
              </span>
              <span className="welcome-text">{displayName.toLowerCase()}</span>
            </button>

            {menuOpen && (
              <div className="profile-menu-dropdown">
                <div className="profile-menu-header">
                  <span className="profile-menu-name">{displayName}</span>
                  <span className="profile-menu-role">{(role || '').toLowerCase()}</span>
                </div>
                <Link
                  to="/profile"
                  className="profile-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  View profile
                </Link>
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
    </nav>
  );
};

export default Navbar;