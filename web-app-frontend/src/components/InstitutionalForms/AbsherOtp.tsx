import { Button, message } from "antd";
import AppModal from "components/Modal/Modal";
import Otp from "components/OTP/Otp";
import { useEffect, useState } from "react";
import classes from "./steps.module.scss";
import { timeConverter } from "utils/Helper";
import { useNavigate } from "react-router-dom";
import { verifyAbsherOTP } from "services/Login";
import { useRecoilState } from "recoil";
import { ReactComponent as Absher } from "assets/svgs/Absher.svg";
import { userProfileAtom } from "store/user";

type Props = {
  customerId?: any;
  setOpen?: any;
  openAbsherOtp?: any;
  setAbsherOtp?: any;
  handelOtpVerified: () => void;
  poaAgreement?: any;
};
const AbsherOtp = ({
  openAbsherOtp,
  setAbsherOtp,
  setOpen,
  customerId,
  handelOtpVerified,
  poaAgreement = "",
}: Props) => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState<number>(60);
  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const onOtpConfirm = async () => {
    if (otp.length !== 4) {
      return message.error("Enter OTP");
    } else {
      const body = {
        customer_id: customerId,
        otp: otp,
        poa_agreement: poaAgreement,
        user_id: userProfile.id,
      };
      try {
        const { data } = await verifyAbsherOTP(body);
        if (data) {
          handelOtpVerified();
          message.success(data.message);
          navigate("/dashboard");
          setOpen(false);
          setAbsherOtp(false);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      }
    }
    // if (otp === "1234") {
    //   setOpen(false);
    //   setAbsherOtp(false);
    //   navigate("/dashboard");
    // } else message.error("Invalid OTP");
  };
  return (
    <AppModal
      width={426}
      footer={null}
      onCancel={() => setAbsherOtp(false)}
      modalTitle={
        <div
          className={classes["absher-header"]}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Absher />

          <span style={{ marginLeft: "1rem" }}>Absher OTP</span>
        </div>
      }
      isModalVisible={openAbsherOtp}
    >
      <div className={classes["absher-otp-wrapper"]}>
        <div>
          <p>Please enter the OTP received on your phone.</p>
        </div>
        <div>
          <Otp
            containerClass={classes["absher-otp-container"]}
            width="45px"
            height="45px"
            setOtp={setOtp}
            otp={otp}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          {" "}
          <p className="timer">
            {time !== 0 ? timeConverter(time) : "OTP expired"}{" "}
            {time ? <span>left</span> : null}
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: "108px" }}>
          <Button
            type="primary"
            shape="round"
            style={{ width: "288px", height: "52px" }}
            onClick={onOtpConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default AbsherOtp;
