import { SetStateAction, Dispatch, useState, useEffect } from "react";
// import { Form, Row, Col } from "antd";
import Modal from "components/Modal/Modal";
import Transfer from "./Transfer";
import TransferDocument from "./TransferDocument";
import TransferBank from "./TransferBank";
import Confirm from "./Confirm";
import TransferOtp from "./TransferOtp";
import Finish from "./Finish";

import "./TransferBalance.scss";
import {
  generateUnifonicOTP,
  transferRequest,
  verifyOTP,
} from "services/Login";
import { Button, message } from "antd";

interface ModalProps {
  isModalVisible?: boolean;
  setIsModalVisible?: Dispatch<SetStateAction<boolean>>;
  onOk?: () => void;
  onCancel?: () => void;
  userProfile?: any;
  setUserProfile?: any;
}

const TransferBalance = ({
  isModalVisible,
  setIsModalVisible,
  onOk,
  onCancel,
  userProfile,
  setUserProfile,
}: ModalProps): JSX.Element => {
  //   const [transferInfo, setTransferInfo] = useState(false);
  const [currentDivIndex, setCurrentDivIndex] = useState(0);
  const [transferValues, setTransferValues] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number>(60);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const handleNext = () => {
    setCurrentDivIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setCurrentDivIndex((prevIndex) => prevIndex - 1);
  };

  const handleBackFirst = () => {
    setIsModalVisible(false);
    setCurrentDivIndex(0);
  };

  const sentOtp = async () => {
    try {
      if (time == 0) {
        setLoading(true);
        const body = {
          phone_number: userProfile?.institutional?.phone_number
            ? userProfile?.institutional?.phone_number
            : userProfile?.phone_number,
        };
        const res = await generateUnifonicOTP(body);
        if (res) {
          setOtp("");
          setTime(60);
          setLoading(false);
          handleNext();
          message.success("OTP Sent Successfully!");
        }
      }
    } catch (error) {
      setOtp("");
      setTime(60);
      setLoading(false);
      console.log("err", error.response.data.message);
      message.error(error.response.data.errors.phone_number[0]);
    }
  };

  const confirmTransfer = async () => {
    if (otp.length < 4) {
      message.error("Enter proper OTP");
    } else {
      let body;
      if (userProfile?.phone_number) {
        body = {
          source: userProfile?.phone_number,
          otp: otp,
        };
      } else {
        body = {
          source: userProfile?.institutional?.phone_number,
          otp: otp,
        };
      }

      try {
        const res = await verifyOTP(body);
        if (res) {
          const { data } = res;
          transfer();
          message.success(data.message);
          handleNext();
        }
      } catch (error) {
        setOtp("");
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      }
    }
  };

  const transfer = async () => {
    try {
      const res = await transferRequest({ amount: transferValues?.amount });
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.errors.phone_number[0]);
    }
  };
  const divContents = [
    <TransferBank
      handleBack={handleBackFirst}
      handleNext={handleNext}
      setTransferValues={setTransferValues}
      userProfile={userProfile}
    />,
    <Confirm
      handleBack={handleBack}
      handleNext={handleNext}
      transferValues={transferValues}
      sentOtp={sentOtp}
      setTime={setTime}
      loading={loading}
    />,
    <TransferOtp
      loading={loading}
      handleBack={handleBack}
      handleNext={handleNext}
      setOtp={setOtp}
      otp={otp}
      time={time}
      confirmTransfer={confirmTransfer}
      sentOtp={sentOtp}
    />,
    <Finish
      handleBack={handleBack}
      setIsModalVisible={setIsModalVisible}
      setCurrentDivIndex={setCurrentDivIndex}
      setUserProfile={setUserProfile}
    />,
  ];

  const currentDivContent = divContents[currentDivIndex];
  return (
    <div>
      <Modal
        // width={671}
        centered
        className="transfer-info-model"
        isModalVisible={isModalVisible}
        onOk={onOk}
        onCancel={onCancel}
        footer={false}
      >
        <div className="log-icon">{/* <Logout /> */}</div>
        {userProfile?.kyc_step == 5 ? (
          currentDivContent && <div>{currentDivContent}</div>
        ) : userProfile?.kyc_step == 0 ||
          userProfile?.kyc_step == 1 ||
          userProfile?.kyc_step == 2 ? (
          <div>
            <h2 style={{ color: "white" }}>Please complete your KYC form.</h2>
          </div>
        ) : userProfile?.kyc_step == 3 ? (
          <div>
            <h2 style={{ color: "white" }}>Your KYC form is under review</h2>
          </div>
        ) : (
          userProfile?.kyc_step == 4 && (
            <div>
              <h2 style={{ color: "white" }}>
                Your KYC form is rejected. Please contact Administrator.
              </h2>
            </div>
          )
        )}
        {userProfile?.kyc_step != 5 && (
          <Button
            block
            style={{
              height: "52px",
              marginTop: "36px",
              backgroundColor: "#5b2cd3",
              color: "white",
              borderColor: "transparent",
              borderRadius: "50px",
            }}
            onClick={() => {
              setIsModalVisible(false);
            }}
          >
            Ok
          </Button>
        )}
      </Modal>
    </div>
  );
};

export default TransferBalance;
