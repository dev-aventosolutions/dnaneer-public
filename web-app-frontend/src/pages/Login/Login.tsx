import { useState } from "react";
import AuthWrapper from "components/HOC/Auth";
import LoginComponent from "./LoginComponents/LoginComponents";

const LoginForm = AuthWrapper(LoginComponent);

const Login = () => {
  const [userType, setUserType] = useState<"individual" | "institutional">(
    "individual"
  );
  return <LoginForm individual={userType} setIndividual={setUserType} />;
};

export default Login;
