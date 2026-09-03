import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/layout/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import JobList from "./components/jobs/JobList";
import ApplicationList from "./components/applications/ApplicationList";

import { rehydrate } from "./store/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();

  const token = useSelector(
    (state) => state.auth?.token
  );

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/jobs"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/jobs"
            element={
              token ? (
                <JobList />
              ) : (
                <JobList />
              )
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationList />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/jobs"
                replace
              />
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;