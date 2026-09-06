// import React, { useEffect, useRef, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../store/slices/authSlice';
// import { clearCandidateProfile } from '../../store/slices/candidateSlice';
// import userService from '../../services/userService';

// const ROLE_ABBR = {
//   CANDIDATE: 'C',
//   RECRUITER: 'R',
//   TA_LEAD: 'TA',
//   HIRING_MANAGER: 'HM',
// };

// const ROLE_LABELS = {
//   CANDIDATE: 'Candidate',
//   RECRUITER: 'Recruiter',
//   TA_LEAD: 'TA Lead',
//   HIRING_MANAGER: 'Hiring Manager',
// };

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const auth = useSelector((state) => state.auth);
//   const isAuthenticated = auth.isAuthenticated;
//   const role = auth.role;
//   const user = auth.user;

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [accountInfo, setAccountInfo] = useState(null);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     let cancelled = false;

//     if (isAuthenticated) {
//       userService
//         .getMyAccount()
//         .then((data) => {
//           if (!cancelled) setAccountInfo(data);
//         })
//         .catch(() => {});
//     } else {
//       setAccountInfo(null);
//     }

//     return () => {
//       cancelled = true;
//     };
//   }, [isAuthenticated]);

//   const photoUrl = accountInfo && accountInfo.photoUrl ? accountInfo.photoUrl : null;

//   const handleLogout = () => {
//     setMenuOpen(false);
//     dispatch(logout());
//     dispatch(clearCandidateProfile());
//     navigate('/login');
//   };

//   const canSeePipeline =
//     role === 'RECRUITER' || role === 'TA_LEAD' || role === 'HIRING_MANAGER';

//   const linkClass = (props) => (props.isActive ? 'active' : undefined);

//   const displayName = (accountInfo && accountInfo.fullName) || (user && user.fullName) || role || 'user';
//   const initial = displayName.charAt(0).toUpperCase();

//   const roleAbbr = ROLE_ABBR[role] || (role ? role.charAt(0).toUpperCase() : '');
//   const roleLabel = ROLE_LABELS[role] || (role ? role.toLowerCase() : '');

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/">
//           {isAuthenticated && roleAbbr ? (
//             <span className="navbar-role-mark">
//               <span className="navbar-role-mark-abbr">{roleAbbr}</span>
//               <span className="navbar-role-mark-full">{roleLabel}</span>
//             </span>
//           ) : (
//             <span className="navbar-brand-mark">H</span>
//           )}
//           <span className="navbar-brand-word">HireHigh</span>
//         </Link>
//       </div>
//       <div className="navbar-links">
//         <NavLink to="/" end className={linkClass}>
//           Home
//         </NavLink>
//         <NavLink to="/jobs" className={linkClass}>
//           Jobs
//         </NavLink>
//         {isAuthenticated && canSeePipeline && (
//           <NavLink to="/applications" className={linkClass}>
//             Applications
//           </NavLink>
//         )}
//         {isAuthenticated && role === 'CANDIDATE' && (
//           <NavLink to="/applications" className={linkClass}>
//             My applications
//           </NavLink>
//         )}
//       </div>
//       <div className="navbar-user">
//         {isAuthenticated ? (
//           <div className="profile-menu" ref={menuRef}>
//             <button
//               className="profile-menu-trigger"
//               onClick={() => setMenuOpen((prev) => !prev)}
//             >
//               <span className="profile-menu-avatar">
//                 {photoUrl ? <img src={photoUrl} alt="Profile" /> : initial}
//               </span>
//               <span className="welcome-text">{displayName.toLowerCase()}</span>
//             </button>

//             {menuOpen && (
//               <div className="profile-menu-dropdown">
//                 <div className="profile-menu-header">
//                   <span className="profile-menu-name">{displayName}</span>
//                   <span className="profile-menu-role">{(role || '').toLowerCase()}</span>
//                 </div>
//                 <Link
//                   to="/profile"
//                   className="profile-menu-item"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   View profile
//                 </Link>
//                 <button className="profile-menu-item profile-menu-item--danger" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link to="/login" className="btn btn-login">
//             Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { clearCandidateProfile } from '../../store/slices/candidateSlice';
import userService from '../../services/userService';
import './Navbar.css';

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

function KebabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
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

  const roleAbbr = ROLE_ABBR[role] || (role ? role.charAt(0).toUpperCase() : '');
  const roleLabel = ROLE_LABELS[role] || (role ? role.toLowerCase() : '');

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

  return (
    <nav className={'sidebar' + (isAuthenticated ? ' sidebar--app' : ' sidebar--rail')}>
      <div className="sidebar-top">
        <Link to="/" className="sidebar-brand">
          {isAuthenticated && roleAbbr ? (
            <span className="sidebar-role-badge" title={roleLabel}>
              {roleAbbr}
            </span>
          ) : (
            <span className="sidebar-brand-mark">H</span>
          )}
          <span className="sidebar-brand-word">HireHigh</span>
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
                  onClick={() => setMenuOpen(false)}
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
          <Link to="/login" className="sidebar-login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;