import { message } from "antd";
import OtpComponent from "components/OTP/OtpComponent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInstitutionalNaftah, login, verifyLoginOTP } from "services/Login";
import Constants from "../../../../utils/AppConstants";
import { encryptUser } from "utils/Helper";
import { borrowerLogin, verifyBorrowerLoginOTP } from "services/BorrowerApis";

const LoginOtp = ({
  userType,
  setSwitchForm,
  userId,
  nafathInfo,
  setNafathInfo,
}) => {
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(60);
  const [otp, setOtp] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const backHandler = () => {
    setSwitchForm("login");
  };
  const nextHandler = async () => {
    let body;
    if (otp.length < 4) {
      return message.error("Please enter a valid OTP");
    } else {
      setLoader(true);
      if (userType === "institutional") {
        body = {
          user_type: 2,
          email: userId.email,
          password: userId.password,
          otp: otp,
          // user_type: 2,
        };
      } else if (userType === "individual") {
        body = {
          user_type: 1,
          email: userId.email,
          password: userId.password,
          otp: otp,
          //  user_type: 1,
        };
      } else {
        body = {
          email: userId.email,
          password: userId.password,
          otp: otp,
          //  user_type: 1,
        };
      }

      try {
        const res =
          userType === "borrower"
            ? await verifyBorrowerLoginOTP(body)
            : await verifyLoginOTP(body);
        if (res) {
          const { data } = res;
          message.success(data.message);
          // setSwitchForm("otp");
          if (userType === "institutional" || userType === "individual") {
            if (data?.data?.user?.nafath) {
              localStorage.setItem("token", data.data.token);
              localStorage.setItem(
                "investor-type",
                userType === "institutional" ? "institutional" : "individual"
              );
              navigate("/dashboard");
            } else {
              message.success("Nafath Notification Sent");
              setNafathInfo({ data: data });
              setSwitchForm("nafath");
            }
          } else {
            if (data?.data?.user?.kyc_step == 3) {
              navigate(`/borrower/status/pending`);
            } else if (data?.data?.user?.kyc_step == 4) {
              navigate(`/borrower/status/rejected`);
            } else if (data?.data?.user?.kyc_step == 5) {
              localStorage.setItem("borrowerToken", data.data.token);
              localStorage.setItem("user", encryptUser(data?.data?.user));
              navigate("/borrower/dashboard");
            } else if (data?.data?.user?.kyc_step < 3) {
              navigate(`/borrower-request/${data?.data?.user?.kyc_step}`);
            }
          }
        }
      } catch (error) {
        console.log("err", error.response.data);

        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    }
  };
  const sentOtp = async () => {
    let body;
    if (userType === "institutional") {
      body = {
        user_type: 2,
        email: userId.email,
        password: userId.password,
      };
    } else if (userType === "individual") {
      body = {
        user_type: 1,
        email: userId.email,
        password: userId.password,
      };
    } else {
      body = {
        email: userId.email,
        password: userId.password,
      };
    }

    try {
      const { data } =
        userType === "borrower" ? await borrowerLogin(body) : await login(body);
      if (data) {
        message.success("Otp sent successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  return (
    <OtpComponent
      time={time}
      setTime={setTime}
      setOtp={setOtp}
      sentOtp={sentOtp}
      otp={otp}
      loader={loader}
      backHandler={backHandler}
      nextHandler={nextHandler}
      formType={Constants.LOGIN_FORM}
      userType={userType}
    />
  );
};

export default LoginOtp;
