import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (token) {
      navigate("/jobs");
    }
  }, [token, navigate]);

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

    if (error) {
      dispatch(clearError());
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    }

    setValidation(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await dispatch(login(form));

    if (!result.error) {
      navigate("/jobs");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="brand-mark">H</span>
          <span>HireHigh</span>
        </div>

        <div className="auth-header">
          <h1>HireHigh Login</h1>
          <p>Sign in to continue to your recruitment workspace.</p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />

            {validation.username && (
              <small className="field-error">
                {validation.username}
              </small>
            )}
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
              autoComplete="current-password"
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;