import { useState } from "react";
import AuthContainer from "components/AuthContainer/AuthContainer";
import SwitchUser from "components/SwitchUser/SwitchUser";
import LoginForm from "./LoginForm/LoginForm";
import LoginOtp from "./LoginOtp/LoginOtp";
import Naftah from "pages/Signup/SingupComponents/Naftah/Naftah";
import NafathLogin from "./NafathLogin/NafathLogin";

const LoginComponent = ({ individual, setIndividual }) => {
  const [switchForms, setSwitchForm] = useState<"login" | "otp" | "nafath">(
    "login"
  );
  const [userId, setUserId] = useState(null);
  const [nafathInfo, setNafathInfo] = useState({});
  const [userInfo, setuserInfo] = useState({});

  return (
    <AuthContainer>
      <>
        {switchForms === "login" && (
          <>
            <h1>Login As</h1>
            <SwitchUser userType={individual} setUserType={setIndividual} />
            <LoginForm
              setSwitchForm={setSwitchForm}
              userType={individual}
              setUserId={setUserId}
              setuserInfo={setuserInfo}
            />
          </>
        )}
        {switchForms === "otp" && (
          <LoginOtp
            userType={individual}
            setSwitchForm={setSwitchForm}
            userId={userId}
            nafathInfo={nafathInfo}
            setNafathInfo={setNafathInfo}
          />
        )}
        {switchForms === "nafath" && (
          <NafathLogin
            nafathInfo={nafathInfo}
            setNafathInfo={setNafathInfo}
            investorType={individual}
            setSwitchForm={setSwitchForm}
            userInfo={userInfo}
          />
        )}
      </>
    </AuthContainer>
  );
};

export default LoginComponent;
