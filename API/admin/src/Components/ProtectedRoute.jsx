import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token === "5114" ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
