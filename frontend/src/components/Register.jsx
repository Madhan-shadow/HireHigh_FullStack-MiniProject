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
  register,
  clearAuthError,
} from "../store/slices/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth || {}
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "CANDIDATE",
    password: "",
  });

  const [validationError, setValidationError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setValidationError(
        "Full name is required."
      );
      return;
    }

    if (!form.email.trim()) {
      setValidationError(
        "Email address is required."
      );
      return;
    }

    if (!form.username.trim()) {
      setValidationError(
        "Username is required."
      );
      return;
    }

    if (!form.password.trim()) {
      setValidationError(
        "Password is required."
      );
      return;
    }

    setValidationError("");
    dispatch(clearAuthError());

    const result = await dispatch(
      register({
        ...form,
        fullName:
          form.fullName.trim(),
        email:
          form.email.trim(),
        username:
          form.username.trim(),
      })
    );

    if (
      register.fulfilled.match(result)
    ) {
      navigate("/login");
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
          Create Account
        </h1>

        <p className="muted">
          Join the HireHigh recruitment
          platform.
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
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="CANDIDATE">
                Candidate
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="primary-btn wide"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </section>
  );
}