import { useState, useEffect } from "react";
import Otp from "components/OTP/Otp";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { timeConverter } from "utils/Helper";
import { verifyOTP, signUpInstitutional, register } from "services/Login";
import AuthContainer from "components/AuthContainer/AuthContainer";

const OtpComponent = ({
  setShowPassword,
  setShowPhone,
  setShowOtp,
  individual,
  userId,
  number,
  setShowInstitutionalStepTwo,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(60);
  const [otp, setOtp] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const notificationHandler = (type, notifyData) => {
    api[type]({
      message: notifyData.message,
      description: notifyData.description,
    });
  };

  const handleResndOtp = async () => {
    const body = userId;
    try {
      setLoader(true);
      setOtp("");
      const { data } = await register(body);
      if (data) {
        message.success(data.message);
        setTime(60);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const backHandler = () => {
    setShowOtp(false);
    setShowPhone(true);
  };
  const nextHandler = async () => {
    if (otp.length < 4) {
      return message.error("Please enter a valid Otp");
    }
    let body = {
      source: userId.email ? userId.email : userId.phone_number,
      otp: otp,
    };

    try {
      setLoader(true);
      const { data } = await verifyOTP(body);
      if (data) {
        // localStorage.setItem("token", data.data.token);
        message.success(data.message);
        if (individual === "individual") {
          setShowOtp(false);
          setShowPassword(true);
        } else {
          const { data } = await signUpInstitutional({
            email: userId.email,
            password: userId.password,
            user_type: 2,
          });
          if (data) {
            message.success(data.message);
            setShowInstitutionalStepTwo(true)
            setShowOtp(false);
            // localStorage.setItem("token", data.token);
            // navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }

    //  try {
    //    setLoader(true);
    //    const { data } = await verifyOTP(body);
    //    if (data) {
    //      console.log("login Res", data);
    //      message.success(data.message);

    //      //  setShowPhone(false);
    //      //  setShowOtp(true);
    //    }
    //  } catch (error) {
    //    console.log("err", error.response.data.message);
    //    message.error(error.response.data.message);
    //  } finally {
    //    setLoader(false);
    //  }
  };
  return (
    <AuthContainer>
      {/* {contextHolder} */}
      <Button
        style={{ padding: "none" }}
        className="singUp-back-btn"
        icon={<BackArrow />}
        onClick={backHandler}
      >
        Back
      </Button>
      <p className="title">
        {individual === "individual"
          ? "Individual Investor"
          : "Institutional Investor"}
      </p>
      <h2>Complete registration now</h2>
      <p className="otp-description">
        {individual === "individual"
          ? "Please type the OTP received on your phone"
          : "Please enter the OTP received on your email"}
      </p>
      <Otp otp={otp} setOtp={setOtp} />
      <p className="timer">
        {time !== 0 ? timeConverter(time) : "OTP expired"}
        {time ? <span>{` left`}</span> : null}
      </p>
      <Button
        loading={loader}
        block={true}
        onClick={nextHandler}
        className="otp-next-btn"
      >
        Next
      </Button>
      {!time && (
        <p className="form-bottom" onClick={() => handleResndOtp()}>
          Resend OTP
        </p>
      )}
    </AuthContainer>
  );
};

export default OtpComponent;
