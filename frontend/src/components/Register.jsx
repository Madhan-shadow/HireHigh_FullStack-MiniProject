import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "CANDIDATE"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email Address is required";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await dispatch(register(form));

    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} noValidate>

        <h1>Create Account</h1>

        <p>
          Join HireHigh Talent Acquisition
        </p>

        <label htmlFor="fullName">
          Full Name
        </label>

        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange}
        />

        {errors.fullName && (
          <span>{errors.fullName}</span>
        )}

        <label htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
        />

        {errors.email && (
          <span>{errors.email}</span>
        )}

        <label htmlFor="username">
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
        />

        {errors.username && (
          <span>{errors.username}</span>
        )}

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

          <option value="HIRING_MANAGER">
            Hiring Manager
          </option>

          <option value="TA_LEAD">
            TA Lead
          </option>
        </select>

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {errors.password && (
          <span>{errors.password}</span>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login here
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Register;