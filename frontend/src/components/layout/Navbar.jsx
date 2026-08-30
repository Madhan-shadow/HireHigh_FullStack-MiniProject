import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="hh-navbar">
      <div className="hh-navbar-brand">
        <span className="hh-navbar-mark" aria-hidden="true" />
        <span className="hh-navbar-name">HireHigh</span>
      </div>

      <nav className="hh-navbar-links">
        <NavLink to="/jobs" className={({ isActive }) => `hh-pill ${isActive ? 'is-active' : ''}`}>
          Jobs
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => `hh-pill ${isActive ? 'is-active' : ''}`}>
          Applications
        </NavLink>
      </nav>

      <div className="hh-navbar-user">
        {role && <span className="hh-navbar-role mono">{role}</span>}
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}