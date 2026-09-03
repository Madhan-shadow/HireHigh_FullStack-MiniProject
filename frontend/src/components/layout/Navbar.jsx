import React from "react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  logout
} from "../../store/slices/authSlice";

export default function Navbar() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const role =
    useSelector(
      (state) => state.auth.role
    ) ||
    localStorage.getItem("role");

  const token =
    useSelector(
      (state) => state.auth.token
    ) ||
    localStorage.getItem("token");

  const normalizedRole =
    String(role || "")
      .toUpperCase();

  const canManage = [
    "RECRUITER",
    "TA_LEAD",
    "ADMIN",
    "HIRING_MANAGER"
  ].includes(normalizedRole);

  const signOut = () => {

    dispatch(logout());

    navigate("/login", {
      replace: true
    });
  };

  return (
    <nav
      className="navbar"
      aria-label="Main navigation"
    >

      <Link
        className="brand"
        to={
          token
            ? "/jobs"
            : "/login"
        }
      >

        <span className="brand-mark">
          H
        </span>

        <span>
          HireHigh
        </span>

      </Link>

      {token && (

        <div className="nav-links">

          <Link
            className={
              location.pathname === "/jobs"
                ? "active"
                : ""
            }
            to="/jobs"
          >
            Open Roles
          </Link>

          {canManage && (

            <Link
              className={
                location.pathname ===
                "/applications"
                  ? "active"
                  : ""
              }
              to="/applications"
            >
              Pipeline
            </Link>

          )}

        </div>

      )}

      <div className="nav-actions">

        {token ? (

          <>

            <span className="role-pill">
              {role || "CANDIDATE"}
            </span>

            <button
              type="button"
              className="ghost-btn"
              onClick={signOut}
            >
              Logout
            </button>

          </>

        ) : (

          <Link
            className="ghost-btn link-btn"
            to="/login"
          >
            Login
          </Link>

        )}

      </div>

    </nav>
  );
}