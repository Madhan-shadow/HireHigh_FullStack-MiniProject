import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from "../../services/authService";

const Navbar = () => {
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth || {});

  const token =
    auth.token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  const role =
    auth.role ||
    (typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null);

  const normalizedRole = role?.toUpperCase();

  const isLoggedIn = Boolean(token);

  const canManage =
    normalizedRole === "RECRUITER" ||
    normalizedRole === "TA_LEAD" ||
    normalizedRole === "ADMIN";

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/jobs" className="brand">
          <span className="brand-mark">H</span>
          <span>HireHigh</span>
        </Link>

        <div className="nav-links">
          <Link to="/jobs">Jobs</Link>

          {canManage && (
            <Link to="/applications">
              Application Pipeline
            </Link>
          )}

          {!isLoggedIn && (
            <Link to="/login" className="nav-login">
              Login
            </Link>
          )}

          {isLoggedIn && (
            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;