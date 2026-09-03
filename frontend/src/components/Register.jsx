import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "CANDIDATE",
    password: "",
  });

  const [validation, setValidation] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidation((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Enter a valid email";
    }

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must contain at least 6 characters";
    }

    setValidation(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await dispatch(register(form));

    if (!result.error) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <span className="brand-mark">H</span>
          <span>HireHigh</span>
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join HireHigh and manage your recruitment journey.</p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full name"
              value={form.fullName}
              onChange={handleChange}
            />

            {validation.fullName && (
              <small className="field-error">
                {validation.fullName}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />

            {validation.email && (
              <small className="field-error">
                {validation.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            {validation.username && (
              <small className="field-error">
                {validation.username}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="CANDIDATE">Candidate</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            {validation.password && (
              <small className="field-error">
                {validation.password}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;