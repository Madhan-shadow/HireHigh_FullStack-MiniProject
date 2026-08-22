import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, role } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/jobs">Jobs</Link>

      {isAuthenticated && (
        <>
          {role === "CANDIDATE" ? (
            <Link to="/applications">
              My Applications
            </Link>
          ) : (
            <Link to="/applications">
              Recruitment Pipeline
            </Link>
          )}

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;