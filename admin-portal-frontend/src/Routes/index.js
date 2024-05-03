import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import Investors from "../Container/Investors/Investors";
import AdminUsers from "../Container/AdminUsers";
import Detail from "../Container/OpportunityDetail";
import NotificationPage from "../Container/NotificationsPage";
import BorrowerProfile from "../Container/Profile/BorrowerProfile";
import Loan from "../Container/Loan";
const Home = React.lazy(() => import("../Container/home"));
const Login = React.lazy(() => import("../Container/login"));
const Borrowers = React.lazy(() => import("../Container/borrowers"));
const Profile = React.lazy(() => import("../Container/Profile"));
const FundsManagement = React.lazy(() =>
  import("../Container/FundsManagement")
);
const WithdrawalRequest = React.lazy(() =>
  import("../Container/WithdrawalRequest")
);
const LoanManagement = React.lazy(() =>
  import("../Container/LoanManagement")
);
const FinancialAdvisors = React.lazy(() =>
  import("../Container/FinancialAdvisors")
);

const MyRoutes = () => {
  useEffect(() => {
    //  console.log('knlk', Armaghan)
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Home />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/loan"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Loan />
            </RequireAuth>
          </React.Suspense>
        }
      />

      <Route
        path="/notifications"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <NotificationPage />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/opportunity/:id"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Detail />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/financial-advisors"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <FinancialAdvisors />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/funds-management"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <FundsManagement />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/withdrawal-request"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <WithdrawalRequest />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/loan-management"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <LoanManagement />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <Login />
          </React.Suspense>
        }
      />
      <Route
        path="/admin-users"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <AdminUsers />
          </React.Suspense>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </React.Suspense>
        }
      />

      <Route
        path="/investors"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Investors />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/investors/:id"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/borrowers"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <Borrowers />
            </RequireAuth>
          </React.Suspense>
        }
      />
      <Route
        path="/borrowers/:id"
        element={
          <React.Suspense fallback={<span>...Loading</span>}>
            <RequireAuth>
              <BorrowerProfile />
            </RequireAuth>
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default MyRoutes;
