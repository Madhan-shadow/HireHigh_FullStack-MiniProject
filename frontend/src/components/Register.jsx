import React, { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  login
} from "../store/slices/authSlice";

export default function Login() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(
    (state) => state.auth.loading
  );

  const error = useSelector(
    (state) => state.auth.error
  );

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [validation, setValidation] =
    useState("");

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {
      navigate("/jobs", {
        replace: true
      });
    }

  }, [navigate]);

  const submit = async (e) => {

    e.preventDefault();

    if (!username.trim() || !password.trim()) {

      setValidation(
        "Username and password are required."
      );

      return;
    }

    setValidation("");

    const result = await dispatch(
      login({
        username: username.trim(),
        password
      })
    );

    if (
      login.fulfilled.match(result)
    ) {

      navigate("/jobs", {
        replace: true
      });

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
          Talent Acquisition Platform
        </p>

        <h1>
          HireHigh Login
        </h1>

        <p className="muted">
          Sign in to manage your hiring
          pipeline.
        </p>

        {validation && (
          <div
            className="error-banner"
            role="alert"
          >
            {validation}
          </div>
        )}

        {error && (
          <div
            className="error-banner"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="form-stack"
        >

          <label htmlFor="username">

            Username

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
            />

          </label>

          <label htmlFor="password">

            Password

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />

          </label>

          <button
            className="primary-btn wide"
            type="submit"
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
            Register here
          </Link>

        </p>

      </div>

    </section>
  );
}