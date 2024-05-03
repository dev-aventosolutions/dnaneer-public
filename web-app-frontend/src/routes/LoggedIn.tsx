import React, { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

export const LoggedIn: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const key = location.pathname.includes("borrower")
    ? "borrowerToken"
    : "token";
  const myAuth = localStorage.getItem(key);

  if (myAuth) {
    return (
      <Navigate
        to={key == "borrowerToken"? "/borrower/dashboard": "/dashboard"}
        state={{ path: location.pathname }}
        replace
      />
    );
  }
  return <>{children}</>;
};
