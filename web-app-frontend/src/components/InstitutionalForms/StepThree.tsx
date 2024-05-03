import {
  Button,
  Divider,
  RadioChangeEvent,
  Radio,
  message,
  Spin,
  Checkbox,
} from "antd";
import AbsherOtp from "./AbsherOtp";
import classes from "./steps.module.scss";
import pdf from "assets/dnaneer-terms.pdf";
import { useEffect, useState } from "react";
import {
  generateAbsherOTP,
  getProfile,
  institutionalStepOne,
} from "services/Login";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";
import AppConstants from "utils/AppConstants";
import axiosInstance from "services/Instance";

const StepThree = ({ data, handleSkip, onSuccess, onBack, setOpen }) => {
  const [openAbsherOtp, setAbsherOtp] = useState(false);
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [poaAgreement, setPoaAgreement] = useState("");
  const submitHandler = async () => {
    if (isChecked) {
      try {
        setLoading(true);
        const otpGenerated = await callAbsherOtp();
        if (otpGenerated) {
          setAbsherOtp(true);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Kindly agree on the Investment POA Agreement");
    }
  };

  const getNewData = async () => {
    try {
      const { data } = await getProfile();
      if (data) {
        setUserProfile(data.data.user);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      // message.error(error.response.data.message);
    }
  };
  const handelOtpVerified = async () => {
    const body = {
      user_id: userProfile.id,
      kyc_step: 3,
    };

    const { data } = await institutionalStepOne(body);
    if (data) {
      await getNewData();
      message.success(data.message);
    }
  };

  const callAbsherOtp = async () => {
    try {
      setLoading(true);
      const { data } = await generateAbsherOTP();
      if (data) {
        setCustomerId(data?.data?.customerId);
        message.success("Absher OTP sent successfully.");
        setLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get(
        `${AppConstants.URL.BASE_URL}api/poa-agreement`
      );
      setPoaAgreement(response.data);
      if (response.data) {
        const content = await response.data;
        const iframe = document.getElementById(
          "custom-iframe"
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          const iframeDocument = iframe.contentWindow.document;
          iframeDocument.open();
          iframeDocument.write(content);
          iframeDocument.close();
        }
      } else {
        console.error("Error fetching content:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };
  useEffect(() => {
    fetchContent();
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        {openAbsherOtp && (
          <AbsherOtp
            openAbsherOtp={openAbsherOtp}
            setAbsherOtp={setAbsherOtp}
            setOpen={setOpen}
            customerId={customerId}
            handelOtpVerified={handelOtpVerified}
            poaAgreement={poaAgreement}
          />
        )}
        <div>
          <div>
            <h1
              style={{ fontSize: "20px" }}
              className={classes["step-heading"]}
            >
              Investment POA agreement
            </h1>
          </div>

          <Divider style={{ margin: "0" }} />
          <div className={classes["iframe-wrapper"]}>
            <iframe id="custom-iframe">Content not available</iframe>
          </div>
          <div className={classes["agreement-radio"]}>
            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
              I agree on the Investment POA Agreement
            </Checkbox>
          </div>
          <Divider />
          <div
            className={classes["drawer-final-container"]}
            style={{ paddingBottom: "1rem" }}
          >
            <div className={classes["skip"]} onClick={() => handleSkip("3")}>
              Skip for now
            </div>
            <div className={classes["previous"]} onClick={() => onBack()}>
              Previous step
            </div>

            <Button className={classes["complete-btn"]} onClick={submitHandler}>
              Submit
            </Button>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default StepThree;
