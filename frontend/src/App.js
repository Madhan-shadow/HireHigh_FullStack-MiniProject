import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";

import { store } from "./store";
import { hydrate } from "./store/slices/authSlice";

import Navbar from "./components/layout/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import JobList from "./components/jobs/JobList";
import ApplicationList from "./components/applications/ApplicationList";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/jobs" element={<JobList />} />

        <Route
          path="/applications"
          element={<ApplicationList />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}