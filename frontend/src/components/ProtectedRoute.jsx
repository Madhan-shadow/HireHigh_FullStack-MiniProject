import React from "react";

import {
  Navigate,
  useLocation
} from "react-router-dom";

import {
  useSelector
} from "react-redux";

export default function ProtectedRoute({
  children
}) {

  const location =
    useLocation();

  const isAuthenticated =
    useSelector(
      (state) =>
        state.auth?.isAuthenticated
    );

  const token =
    useSelector(
      (state) =>
        state.auth?.token
    ) ||
    localStorage.getItem(
      "token"
    );

  if (
    !isAuthenticated &&
    !token
  ) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location
        }}
      />
    );
  }

  return children;
}