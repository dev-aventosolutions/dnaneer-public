import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import Opportunities from "pages/Opportunities/Opportunities";
import { RequireAuth } from "./RequireAuth";
import IndividualProfile from "pages/IndividualProfile/IndividualProfile";
import InstitutionalProfile from "pages/InstitutionalProfile/InstitutionalProfile";
import BorrowerPending from "borrower/Pending/Pending";
import Investment from "pages/InvestmentDetail/Investment";
import { LoggedIn } from "./LoggedIn";
import InvestorSwitch from "components/InvestorSwitch/InvestorSwitch";
const Login = lazy(() => import("pages/Login"));
const Signup = lazy(() => import("pages/Signup"));
const UserInformation = lazy(() => import("pages/UserInformation"));
const Dashboard = lazy(() => import("pages/Dashboard"));
const Transactions = lazy(() => import("pages/Transactions"));
const Home = lazy(() => import("pages/Home"));
const Opportunity = lazy(() => import("pages/Opportunity/Opportunity"));
const ForgetPassword = lazy(() => import("pages/ForgetPassword"));
const ConfirmPassword = lazy(() => import("pages/ConfirmPassword"));
const BorrowerLogin = lazy(() => import("borrower/Login"));
const BorrowerProfile = lazy(
  () => import("borrower/BorrowerMyProfile/MyProfile")
);

const BorrowerRegister = lazy(
  () => import("borrower/Signup/Register/Register")
);

const DashboardHome = lazy(
  () => import("borrower/DashboardHome/DashboardHome")
);

const BorrowerKyc = lazy(() => import("borrower/BorrowerKyc/BorrowerKyc"));

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <LoggedIn>
          <Login />
        </LoggedIn>
      ),
    },
    {
      path: "/borrower-request/:step",
      element: <BorrowerKyc />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/borrower/login",
      element: (
        <LoggedIn>
          <BorrowerLogin />
        </LoggedIn>
      ),
    },

    {
      path: "/borrower/register",
      element: <BorrowerRegister />,
    },
    {
      path: "/borrower/status/:status",
      element: <BorrowerPending />,
    },

    {
      path: "/borrower/dashboard/my-profile",
      element: (
        <RequireAuth>
          <BorrowerProfile />
        </RequireAuth>
      ),
    },
    {
      path: "/borrower/dashboard",
      element: (
        <RequireAuth>
          <DashboardHome />
        </RequireAuth>
      ),
    },

    {
      path: "/forget-password",
      element: <ForgetPassword />,
    },
    {
      path: "/confirm-password",
      element: <ConfirmPassword />,
    },
    { path: "/home", element: <Home /> },
    {
      path: "/user-information",
      element: (
        <RequireAuth>
          <UserInformation />
        </RequireAuth>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },

    {
      path: "/dashboard/opportunities",

      element: (
        <RequireAuth>
          <Opportunities />
        </RequireAuth>
      ),
    },
    {
      path: "/dashboard/transactions",

      element: (
        <RequireAuth>
          <Transactions />
        </RequireAuth>
      ),
    },
    {
      path: "/dashboard/profile",
      element: (
        <RequireAuth>
          <InvestorSwitch
            InstituteComponent={<InstitutionalProfile />}
            IndividualComponent={<IndividualProfile />}
          />
        </RequireAuth>
      ),
    },
    {
      path: "/dashboard/opportunities/:id",

      element: (
        <RequireAuth>
          <Opportunity />
        </RequireAuth>
      ),
    },
    {
      path: "/dashboard/investment/:id",
      element: (
        <RequireAuth>
          <Investment />
        </RequireAuth>
      ),
    },
  ]);

  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
