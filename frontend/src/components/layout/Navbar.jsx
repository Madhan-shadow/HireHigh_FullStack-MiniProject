import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { clearCandidateProfile } from '../../store/slices/candidateSlice';
import userService from '../../services/userService';
import './Navbar.css';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="7.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" strokeLinecap="round" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="6" cy="18" r="1.6" fill="currentColor" stroke="none" />
      <path d="M6 8v8" strokeLinecap="round" />
      <path d="M10 6h9" strokeLinecap="round" />
      <path d="M10 18h9" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 16l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12H9" strokeLinecap="round" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12H3" strokeLinecap="round" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const role = auth.role;
  const user = auth.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [expanded, setExpanded] = useState(false);
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

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      userService
        .getMyAccount()
        .then((data) => {
          if (!cancelled) setAccountInfo(data);
        })
        .catch(() => {});
    } else {
      setAccountInfo(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Push page content over without needing to touch App.jsx: the sidebar
  // manages classes on <body> itself, and Navbar.css maps those classes
  // to the correct padding-left for whichever width/variant is active.
  useEffect(() => {
    document.body.classList.add('has-sidebar');
    document.body.classList.toggle('sidebar-rail-mode', !isAuthenticated);
    document.body.classList.toggle('sidebar-expanded', expanded);

    return () => {
      document.body.classList.remove('has-sidebar', 'sidebar-rail-mode', 'sidebar-expanded');
    };
  }, [isAuthenticated, expanded]);

  const photoUrl = accountInfo && accountInfo.photoUrl ? accountInfo.photoUrl : null;

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    dispatch(clearCandidateProfile());
    navigate('/login');
  };

  const canSeePipeline =
    role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

  const linkClass = (props) => (props.isActive ? 'sidebar-link active' : 'sidebar-link');

  const displayName = (accountInfo && accountInfo.fullName) || (user && user.fullName) || role || 'user';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems = [
    { to: '/', end: true, label: 'Home', Icon: HomeIcon },
    { to: '/jobs', label: 'Jobs', Icon: JobsIcon },
  ];
  if (isAuthenticated && canSeePipeline) {
    navItems.push({ to: '/applications', label: 'Applications', Icon: PipelineIcon });
  }
  if (isAuthenticated && role === 'CANDIDATE') {
    navItems.push({ to: '/applications', label: 'My applications', Icon: PipelineIcon });
  }

  const variant = isAuthenticated ? 'sidebar--app' : 'sidebar--rail';
  const widthState = expanded ? 'sidebar--expanded' : 'sidebar--collapsed';

  return (
    <nav className={'sidebar ' + variant + ' ' + widthState}>
      <div className="sidebar-clip">
        <div className="sidebar-top">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={expanded}
          >
            <HamburgerIcon />
          </button>

          <Link to="/" className="sidebar-brand">
            <span className="sidebar-brand-mark">H</span>
            <span className="sidebar-brand-word">
              {isAuthenticated ? displayName : 'HireHigh'}
            </span>
          </Link>
        </div>

        <div className="sidebar-rail-track">
          {navItems.map((item, i) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={linkClass}
              title={item.label}
              onClick={() => setExpanded(false)}
            >
              <span className="sidebar-dot-col">
                <span className="sidebar-dot" />
                {i < navItems.length - 1 && <span className="sidebar-dot-line" />}
              </span>
              <span className="sidebar-icon">
                <item.Icon />
              </span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        {isAuthenticated ? (
          <div className="sidebar-profile" ref={menuRef}>
            {menuOpen && (
              <div className="sidebar-profile-dropdown">
                <div className="sidebar-profile-dropdown-header">
                  <span className="sidebar-profile-name">{displayName}</span>
                  <span className="sidebar-profile-role">{(role || '').toLowerCase()}</span>
                </div>
                <Link
                  to="/profile"
                  className="sidebar-profile-item"
                  onClick={() => {
                    setMenuOpen(false);
                    setExpanded(false);
                  }}
                >
                  View profile
                </Link>
                <button
                  className="sidebar-profile-item sidebar-profile-item--danger"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <button
              className="sidebar-profile-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="sidebar-profile-avatar">
                {photoUrl ? <img src={photoUrl} alt="Profile" /> : initial}
              </span>
              <span className="sidebar-profile-name-inline">{displayName.toLowerCase()}</span>
              <span className="sidebar-profile-kebab">
                <KebabIcon />
              </span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="sidebar-login-btn"
            onClick={() => setExpanded(false)}
            title="Login"
          >
            <span className="sidebar-icon">
              <LoginIcon />
            </span>
            <span className="sidebar-label">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;