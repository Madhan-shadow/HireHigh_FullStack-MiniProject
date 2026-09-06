import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <span className="site-footer-mark">H</span>
          <span className="site-footer-word">HireHigh</span>
        </div>
        <p className="site-footer-tagline">
          One pipeline for every open role, from the first application to the signed offer.
        </p>
      </div>

      <div className="site-footer-links">
        <div className="site-footer-col">
          <span className="site-footer-col-title">Product</span>
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/applications">Applications</Link>
        </div>
        <div className="site-footer-col">
          <span className="site-footer-col-title">Account</span>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="site-footer-col">
          <span className="site-footer-col-title">Company</span>
          <a href="mailto:hello@hirehigh.app">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>&copy; {year} HireHigh. Built by Madhan.</span>
      </div>
    </footer>
  );
};

export default Footer;