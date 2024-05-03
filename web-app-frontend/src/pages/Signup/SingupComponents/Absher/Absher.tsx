import { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Otp from "components/OTP/Otp";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { timeConverter } from "utils/Helper";

const Absher = ({ setAbsherCode, setShowPassword }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(60);
  const [otp, setOtp] = useState("");
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

  const backHandler = () => {
    //back
    setAbsherCode(false);
    setShowPassword(true);
  };
  const nextHandler = () => {
    if (otp.length >= 5) {
      navigate("/dashboard");
    } else {
      message.error("Enter OTP");
    }
  };
  return (
    <div className="signUp-form-container">
      <Button
        className="singUp-back-btn"
        icon={<BackArrow />}
        onClick={backHandler}
      >
        Back
      </Button>
      <p className="title">Individual Investor</p>
      {/* <h1>Getting Started as Individual</h1> */}
      <h2>Complete registration now</h2>
      <div className="absher-description">
        <img src="/assets/images/Green.png" alt="" />
        <h1> Enter Absher Code</h1>
      </div>
      <Otp otp={otp} setOtp={setOtp} />
      <p className="timer">
        {time !== 0 ? timeConverter(time) : "OTP expired"}{" "}
        {time ? <span>left</span> : null}
      </p>
      <Button block={true} onClick={nextHandler} className="otp-next-btn">
        Next
      </Button>
      <p className="form-bottom">Resend OTP</p>
    </div>
  );
};

export default Absher;
