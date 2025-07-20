import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  let { user } = useAuth();
  const location = useLocation();
  console.log(user);
  if (!user) {
    // Redirect to login, but save the location they tried to access
    // get from localstorage
    user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (user == null)
      return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Check for admin role if needed
  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
