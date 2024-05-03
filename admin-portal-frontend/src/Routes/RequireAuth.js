import React from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  const myAuth = Cookies.get("sessionToken");
  const location = useLocation();
  if (!myAuth) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  return children;
};
