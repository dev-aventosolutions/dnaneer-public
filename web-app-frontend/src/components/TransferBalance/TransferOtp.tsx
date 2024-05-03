import { useState, useEffect } from "react";
import { Spin, message } from "antd";
import Button from "components/Button/Button";
import Otp from "components/OTP/Otp";
import { timeConverter } from "utils/Helper";
import { ReactComponent as TransferBack } from "assets/svgs/TransferBack.svg";
import { generateUnifonicOTP } from "services/Login";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";
const TransferOtp = ({
  loading,
  handleBack,
  handleNext,
  setOtp,
  otp,
  time,
  confirmTransfer,
  sentOtp,
}) => {
  return (
    <div>
      <div className="transfer-back" onClick={handleBack}>
        <TransferBack />
        <p>Back</p>
      </div>

      <Spin spinning={loading}>
        <div className="modal-content">
          <h2>Please type the OTP received on your phone</h2>
          <div className="deactivate-otp-container">
            <Otp setOtp={setOtp} otp={otp} />
          </div>
          <p className="timer">
            {time !== 0 ? timeConverter(time) : "OTP expired"}{" "}
            {time ? <span>left</span> : null}
          </p>
          <Button
            block
            style={{ height: "52px", marginTop: "108px" }}
            onClick={confirmTransfer}
          >
            Transfer
          </Button>
          {time == 0 ? (
            <p
              className="form-bottom"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (time == 0) {
                  setOtp("");
                  sentOtp();
                }
              }}
            >
              Resend OTP
            </p>
          ) : (
            <p className="form-bottom"></p>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default TransferOtp;
