import { useState } from "react";
import AuthWrapper from "components/HOC/Auth";
import ForgetPasswordForm from "./Components/ForgetPasswordForm";

const FPForm = AuthWrapper(ForgetPasswordForm);

const ForgetPassword = () => {
  const [userType, setUserType] = useState<"individual" | "institutional">(
    "individual"
  );
  return <FPForm individual={userType} setIndividual={setUserType} />;
};

export default ForgetPassword;
