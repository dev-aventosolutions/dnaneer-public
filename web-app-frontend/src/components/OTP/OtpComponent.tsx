import { useEffect } from "react";
import Otp from "./Otp";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { timeConverter } from "utils/Helper";

const OtpComponent = ({
  backHandler,
  otp,
  setOtp,
  time,
  loader,
  nextHandler,
  userType,
  formType,
  setTime,
  sentOtp,
}) => {
  useEffect(() => {
    let timer;
    if (time > 0) {
      timer = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [time]);

  const resendOtp = async () => {
    if (time == 0) {
      setOtp("");
      await sentOtp();
      setTime(60);
    }
  };
  return (
    <div className="signUp-form-container">
      {/* {contextHolder} */}
      {formType !== "profile" ? (
        <Button
          style={{ padding: "none" }}
          className="singUp-back-btn"
          icon={<BackArrow />}
          onClick={backHandler}
        >
          Back
        </Button>
      ) : null}
      <p className="title">
        {userType == "individual"
          ? "Individual Investor"
          : userType == "institutional"
          ? "Institutional Investor"
          : userType == "borrower"
          ? "Company"
          : "-"}
      </p>
      <h2>
        {formType == "profile"
          ? "Update Profile"
          : formType === "login form"
          ? "Login"
          : "Complete registration now"}
      </h2>
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
        onClick={() => nextHandler()}
        className="otp-next-btn"
      >
        Next
      </Button>
      {time == 0 ? (
        <p className="form-bottom" onClick={() => resendOtp()}>
          Resend OTP
        </p>
      ) : (
        <p className="form-bottom"></p>
      )}
    </div>
  );
};

export default OtpComponent;
