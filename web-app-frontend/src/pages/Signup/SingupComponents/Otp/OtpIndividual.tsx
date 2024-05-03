import { useState, useEffect } from "react";
import Otp from "components/OTP/Otp";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { timeConverter } from "utils/Helper";
import { verifyOTP } from "services/Login";
import AuthContainer from "components/AuthContainer/AuthContainer";

const OtpComponent = ({
  setShowPassword,
  setShowPhone,
  setShowOtp,
  individual,
  userId,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(60);
  const [otp, setOtp] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  //   console.log(otp);

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

  const backHandler = () => {
    setShowOtp(false);
    setShowPhone(true);
  };
  const nextHandler = async () => {
    if (otp.length < 4) {
      return message.error("Please enter a valid Otp");
    }
    let body = {
      user_id: userId,
      otp: otp,
      module_type: "register",
    };

    try {
      setLoader(true);
      const { data } = await verifyOTP(body);
      if (data) {
        localStorage.setItem("token", data.data.token);
        message.success(data.message);
        if (individual === "individual") {
          setShowOtp(false);
          setShowPassword(true);
        } else {
          navigate("/dashboard");
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
      <p className="title">Individual Investor</p>
      {/* <h1>Getting Started as Individual</h1> */}
      <h2>Complete registration now</h2>
      <p className="otp-description">
        Please type the OTP received on your phone
      </p>
      <Otp otp={otp} setOtp={setOtp} />
      <p className="timer">
        {time !== 0 ? timeConverter(time) : "OTP expired"}{" "}
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
      <p className="form-bottom">Resend OTP</p>
    </AuthContainer>
  );
};

export default OtpComponent;
