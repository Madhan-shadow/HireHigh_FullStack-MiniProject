import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        HireHigh
      </NavLink>

      {isAuthenticated && (
        <div className="navbar-links">
          <NavLink to="/jobs">Jobs</NavLink>
          {role !== 'CANDIDATE' && <NavLink to="/applications">Applications</NavLink>}
        </div>
      )}

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span>Welcome back, {user?.fullName || user?.username || role?.toLowerCase()}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;