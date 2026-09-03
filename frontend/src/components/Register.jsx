import React, { useState } from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  register
} from "../store/slices/authSlice";

export default function Register() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(
    (state) => state.auth.loading
  );

  const apiError = useSelector(
    (state) => state.auth.error
  );

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      username: "",
      role: "CANDIDATE",
      password: ""
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const update = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const submit = async (e) => {

    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.username.trim() ||
      !form.role ||
      !form.password.trim()
    ) {

      setError(
        "Please complete all fields."
      );

      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        form.email
      )
    ) {

      setError(
        "Enter a valid email address."
      );

      return;
    }

    setError("");

    const result = await dispatch(
      register(form)
    );

    if (
      register.fulfilled.match(result)
    ) {

      setSuccess(
        "Registration successful."
      );

      setTimeout(() => {
        navigate("/login");
      }, 800);

    }

  };

  return (
    <section className="auth-page">

      <div className="auth-card register-card">

        <div className="auth-brand">

          <span className="brand-mark">
            H
          </span>

          HireHigh

        </div>

        <p className="eyebrow">
          Create Account
        </p>

        <h1>
          Create Account
        </h1>

        <p className="muted">
          Join HireHigh Talent Acquisition.
        </p>

        {error && (
          <div
            className="error-banner"
            role="alert"
          >
            {error}
          </div>
        )}

        {apiError && (
          <div
            className="error-banner"
            role="alert"
          >
            {apiError}
          </div>
        )}

        {success && (
          <div
            className="success-banner"
            role="alert"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={submit}
          className="form-grid"
        >

          <label className="full">

            Full Name

            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={update}
            />

          </label>

          <label className="full">

            Email Address

            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={update}
            />

          </label>

          <label>

            Username

            <input
              name="username"
              type="text"
              placeholder="recruiter"
              value={form.username}
              onChange={update}
            />

          </label>

          <label>

            Role

            <select
              name="role"
              value={form.role}
              onChange={update}
            >

              <option value="CANDIDATE">
                Candidate
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>

              <option value="TA_LEAD">
                TA Lead
              </option>

            </select>

          </label>

          <label className="full">

            Password

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
            />

          </label>

          <button
            className="primary-btn wide full"
            type="submit"
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
            Login here
          </Link>

        </p>

      </div>

    </section>
  );
}