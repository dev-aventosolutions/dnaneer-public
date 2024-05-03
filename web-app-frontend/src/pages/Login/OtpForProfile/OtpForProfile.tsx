import { Spin, message } from "antd";
import OtpComponent from "components/OTP/OtpComponent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLoginOTP, verifyOTP } from "services/Login";

const OtpForProfile = ({
  user,
  setIsModalOpen,
  updateProfile,
  sentOtp,
  setTime,
  time,
  setOtp,
  otp,
  loading,
}) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);

  const backHandler = () => {
    // setShowOtp(false);
    // setShowPhone(true);
    setOtp("");
    setIsModalOpen(false);
  };
  const nextHandler = async () => {
    let body;

    if (otp.length < 4) {
      return message.error("Please enter a valid OTP");
    } else {
      setLoader(true);
      if (user?.phone_number) {
        body = {
          source: user?.phone_number,
          otp: otp,
        };
      } else {
        body = {
          source: user?.institutional?.phone_number,
          otp: otp,
        };
      }

      try {
        const res = await verifyOTP(body);
        if (res) {
          const { data } = res;
          message.success(data.message);
          updateProfile();
          setIsModalOpen(false);
          setOtp("")
          setTime(60)
        }
      } catch (error) {
        setOtp("");
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <OtpComponent
        time={time}
        setTime={setTime}
        setOtp={setOtp}
        sentOtp={sentOtp}
        otp={otp}
        loader={loader}
        backHandler={backHandler}
        nextHandler={nextHandler}
        formType={"profile"}
        userType={user?.user_type}
      />
    </Spin>
  );
};

export default OtpForProfile;
