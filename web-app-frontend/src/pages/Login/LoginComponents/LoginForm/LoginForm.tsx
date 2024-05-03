import { useState } from "react";
import LoginFields from "./Form";
import { message } from "antd";
import { Link } from "react-router-dom";
import { login } from "services/Login"

const LoginForm = ({ userType, setSwitchForm, setUserId, setuserInfo }) => {
  const [loader, setLoader] = useState<boolean>(false);

  const onFinish = async (values) => {
    setUserId(values);
    setLoader(true);
    let body = null;
    if (userType === "individual") {
      body = {
        user_type: 1,
        email: values.email,
        password: values.password,
      };
    } else {
      body = {
        user_type: 2,
        email: values.email,
        password: values.password,
      };
    }
    try {
      const { data } = await login(body);
      if (data) {
        message.success(data.message);
        setuserInfo(body);
        setSwitchForm("otp");
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }

    // return;

    // setShowPhone(false);
    // setShowOtp(true);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    // setShowPhone(false);
    // setShowOtp(true);
  };

  return (
    <>
      <LoginFields
        userType={userType}
        loader={loader}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      />
      <Link to="/signup">
        <p className="form-bottom">Register</p>
      </Link>
    </>
  );
};

export default LoginForm;
