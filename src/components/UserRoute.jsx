import React from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "user") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default UserRoute;