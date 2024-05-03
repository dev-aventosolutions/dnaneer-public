import { useState, useEffect } from "react";
import Otp from "components/OTP/Otp";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { timeConverter } from "utils/Helper";
import { verifyOTP } from "services/Login";
import AuthContainer from "components/AuthContainer/AuthContainer";
import AuthWrapper from "components/HOC/BorrowerAuth";
import { borrowerRegister, generateBorrowerOtp } from "services/BorrowerApis";

const BorrowerOtp = ({ setShowOtp, registerData }) => {
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

  const backHandler = () => {
    setShowOtp(false);
    // setShowPhone(true);
    // navigate("/borrower/register");
  };

  const regenerateOtp = async () => {
    try {
      const { data } = await generateBorrowerOtp({
        email: registerData?.email,
        cr_number: registerData?.cr_number,
        password: registerData?.password,
      });
      if (data) {
        localStorage.setItem("borrowerToken", data?.token);
        setOtp("");
        setTime(60);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    }
  };

  const nextHandler = async () => {
    if (otp.length < 4) {
      return message.error("Please enter a valid Otp");
    } else {
      let body = {
        email: registerData?.email,
        password: registerData?.password,
        cr_number: registerData?.cr_number,
        confirmPassword: registerData?.confirmPassword,
        otp,
      };
      try {
        setLoader(true);
        const { data } = await borrowerRegister(body);
        if (data) {
          localStorage.setItem("borrowerToken", data?.token);
          setLoader(false);
          navigate(`/borrower-request/${data?.data?.user?.kyc_step}`);
          message.success(data.message);
        }
      } catch (error) {
        setLoader(false);
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      }
    }
  };
  return (
    <>
      {/* {contextHolder} */}
      <Button
        style={{ padding: "none" }}
        className="singUp-back-btn"
        icon={<BackArrow />}
        onClick={backHandler}
      >
        Back
      </Button>
      <p className="title">Company</p>
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
      {time == 0 ? (
        <p className="form-bottom" onClick={() => regenerateOtp()}>
          Resend OTP
        </p>
      ) : (
        <p className="form-bottom"></p>
      )}
    </>
  );
};

export default BorrowerOtp;
