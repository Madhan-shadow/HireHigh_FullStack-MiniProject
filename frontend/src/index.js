import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./components/Login";
import Register from "./components/Register";
import JobList from "./components/jobs/JobList";
import ApplicationList from "./components/applications/ApplicationList";
import { hydrate } from "./store/slices/authSlice";

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/jobs" element={<JobList />} />
          <Route path="/applications" element={<ApplicationList />} />
        </Route>

        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;