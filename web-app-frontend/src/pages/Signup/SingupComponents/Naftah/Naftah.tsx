import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import { ReactComponent as AppleLogo } from "assets/svgs/Apple-logo.svg";
import { ReactComponent as GoogleStore } from "assets/svgs/GoogleStore.svg";
import { ReactComponent as Close } from "assets/svgs/Close.svg";
import { ReactComponent as Start } from "assets/svgs/Start.svg";
import { ReactComponent as NafatLogo } from "assets/images/Naftah-Logo.svg";

// import NafatLogo from "assets/images/Naftah-Logo.svg";
import classes from "./naftah.module.scss";
import { nafathInstitutionalStatus, nafathStatus } from "services/Login";
import { timeConverter } from "utils/Helper";
import { registerId } from "services/Login";
// import Input from "components/Input/Input";

const Naftah = ({
  setShowNaftah,
  setShowPassword,
  nafathInfo,
  userId,
  passwordIno,
  setNafathInfo,
  individual,
  setShowInstitutionalStepTwo,
  institutionalData,
}) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [time, setTime] = useState<number>(180);

  const backHandler = () => {
    if (individual == "individual") {
      setShowPassword(true);
      setShowNaftah(false);
    } else {
      setShowPassword(false);
      setShowNaftah(false);
      setShowInstitutionalStepTwo(true);
    }
  };

  const completeNaftahProcess = async () => {
    let body = {};
    try {
      if (individual === "individual") {
        body = {
          // user_id: userId,
          transId: nafathInfo.data.transId,
          random: nafathInfo.data.random,
          dob: nafathInfo.dob,
          email: nafathInfo.email,
          password: nafathInfo.password,
          nationalId: nafathInfo.national_id,
          user_type: 1,
          phone_number: nafathInfo.phone_number,
        };
        setLoader(true);
        const { data } = await nafathStatus(body);
        if (data) {
          if (data.code == 200) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("investor-type", "individual");
            message.success(`Your account status is ${data.status}`);
            navigate("/dashboard");
          } else {
            message.success(
              `Your account status is ${data.status}. Please approved from Nafath app.`
            );
          }
        }
      } else {
        body = {
          nationalId: nafathInfo.national_id,
          transId: nafathInfo.data?.transId,
          random: nafathInfo.data?.random,
          user: userId,
        };
        setLoader(true);
        const { data } = await nafathInstitutionalStatus(body);
        localStorage.setItem("token", data.token);
        localStorage.setItem("investor-type", "institutional");
        message.success(`Your account status is ${data.status}`);
        navigate("/dashboard");
        message.success(`Your account status is ${data.status}`);
      }
    } catch (error) {
      // if (error.response.data.status !== "WAITING")
      //   message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const resendNafathNotification = async () => {
    try {
      setLoader(true);
      const { data } = await registerId(nafathInfo); // Assuming nafathInfo contains the necessary data for the API call
      if (data) {
        setNafathInfo({ ...nafathInfo, data }); // Update the nafathInfo with the new data
        message.success("Nafath Notification Resent");
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (time > 0 && time % 5 === 0) {
      completeNaftahProcess();
    }
  }, [time]);

  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className={classes["naftah-wrapper"]}>
      <div className={classes["close-icon"]}>
        <a href="http://dnaneer.com/">
          <Close />
        </a>
      </div>
      {/* <div className="signUp-form-container"> */}
      <div className={classes["naftah-container"]}>
        <div className={classes["start-icon"]}>
          <Start />
        </div>
        <div>
          <Button
            className={classes["singUp-back-btn"]}
            icon={<BackArrow />}
            onClick={backHandler}
          >
            Back
          </Button>

          <div className={classes["naftah-logo-container"]}>
            {/* <NaftahLogo /> */}
            {/* <img width="55px" height="24px" src={NafatLogo} alt="naftah-logo" /> */}
            <div style={{ width: "55px", height: "24px" }}>
              <NafatLogo />
            </div>
            <h5>Naftah App</h5>
          </div>
          <div className={classes["naftah-content"]}>
            <h1>Verify your registration</h1>
            <p>
              Please open Nafath App and select the below number to complete
              registration
            </p>
          </div>
          <div className={classes["naftah-code-container"]}>
            <Input
              className={classes["naftah-input"]}
              readOnly
              value={nafathInfo?.data?.random}
            />
          </div>
          <p
            style={{
              fontWeight: 500,
              fontSize: 14,
              color: " #ed615c",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            {time !== 0 ? timeConverter(time) : "Code expired"}{" "}
            {time ? <span>left</span> : null}
          </p>
          {/* <Button
            style={{ height: "55px", marginTop: "20px" }}
            block
            type="primary"
            shape="round"
            onClick={completeNaftahProcess}
          >
            Complete
          </Button> */}
          {/* {time == 0 ? (
            <p
              className="form-bottom"
              style={{
                marginTop: 23,
                fontWeight: 500,
                fontSize: 12,
                textAlign: "center",
                color: "#8a8595",
                paddingBottom: 70,
                cursor: "pointer",
              }}
              onClick={() => {
                // Needs to be uncommented after backend is implemented
                // resendNafathNotification();
              }}
            >
              Resend code
            </p>
          ) : (
            <p className="form-bottom"></p>
          )} */}
        </div>
      </div>
      {/* </div> */}
      <div className={classes["copy-right"]}>
        <div className={classes["naftah-download"]}>
          <div className={classes["naftah-download-wrapper"]}>
            <h5>Download Naftah App</h5>
            <div>
              <a
                href="https://apps.apple.com/sa/app/%D9%86%D9%81%D8%A7%D8%B0-nafath/id1598909871"
                target="_blank"
              >
                <AppleLogo />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=sa.gov.nic.myid&hl=en&gl=US&pli=1"
                target="_blank"
              >
                <GoogleStore style={{ marginLeft: "16px" }} />
              </a>
            </div>
          </div>
        </div>
        <p> Dnaneer © Copyright 2023, All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Naftah;
