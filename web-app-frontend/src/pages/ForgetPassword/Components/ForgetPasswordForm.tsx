import AuthContainer from "components/AuthContainer/AuthContainer";
import AppInput from "components/Input/Input";
import { ReactComponent as Mail } from "assets/svgs/Mail.svg";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const [forgetPassword, setForgetPassword] = useState("1");

  const onClick = () => {
    if (forgetPassword === "2") {
      return navigate("/confirm-password");
    }
    setForgetPassword("2");
  };
  return (
    <AuthContainer>
      <h1>Forget Password</h1>
      {forgetPassword === "1" && (
        <div style={{ position: "relative" }}>
          <AppInput label="Email" placeholder="Email" prefix={<Mail />} />
        </div>
      )}
      {forgetPassword === "2" && (
        <p>
          We have send a link to your email to be able to reset your password.
          Open your email to get access
        </p>
      )}
      <Button
        //   loading={loader}
        htmlType="submit"
        block={true}
        type="primary"
        shape="round"
        style={{ height: "55px", marginTop: "2rem" }}
        onClick={onClick}
      >
        Next
      </Button>
      <Link to="/">
        <p className="form-bottom">Back</p>
      </Link>
    </AuthContainer>
  );
};

export default ForgetPasswordForm;
