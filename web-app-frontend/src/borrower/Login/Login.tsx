import { useState } from "react";
import LoginForm from "./LoginForm/LoginForm";
import AuthWrapper from "components/HOC/BorrowerAuth";

const LoginComponent:any = AuthWrapper(LoginForm);

const Login = () => {
  return <LoginComponent />;
};

export default Login;
