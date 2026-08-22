import React, {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  login
} from "../store/slices/authSlice";

function Login() {

  const dispatch = useDispatch();

  const navigate =
    useNavigate();

  const {
    loading,
    error
  } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] =
    useState({
      username: "",
      password: ""
    });

  const handleChange = (e) => {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const result =
        await dispatch(
          login(form)
        );

      if (
        login.fulfilled.match(
          result
        )
      ) {
        navigate("/jobs");
      }
    };

  return (
    <div>

      <h1>Login</h1>

      {error && (
        <div
          role="alert"
          style={{
            color: "red"
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >

        <label htmlFor="username">
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      <p>
        Don't have an account?{" "}

        <Link to="/register">
          Register
        </Link>
      </p>

    </div>
  );
}

export default Login;