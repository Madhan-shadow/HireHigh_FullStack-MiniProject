import React, { useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  login,
  clearAuthError,
} from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth || {}
  );

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [validationError, setValidationError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim()) {
      setValidationError(
        "Username is required."
      );
      return;
    }

    if (!password.trim()) {
      setValidationError(
        "Password is required."
      );
      return;
    }

    setValidationError("");
    dispatch(clearAuthError());

    const result = await dispatch(
      login({
        username: username.trim(),
        password,
      })
    );

    if (
      login.fulfilled.match(result)
    ) {
      navigate("/jobs");
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">
          <span className="brand-mark">
            H
          </span>

          HireHigh
        </div>

        <p className="eyebrow">
          TALENT ACQUISITION PLATFORM
        </p>

        <h1>
          HireHigh Login
        </h1>

        <p className="muted">
          Sign in to manage your
          recruitment workflow.
        </p>

        {(validationError ||
          error) && (
          <div
            className="error-banner"
            role="alert"
          >
            {validationError ||
              error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="form-stack"
        >

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              autoComplete="username"
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              autoComplete="current-password"
            />

          </div>

          <button
            type="submit"
            className="primary-btn wide"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </section>
  );
}