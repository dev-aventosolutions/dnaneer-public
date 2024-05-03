import AppModal from "components/Modal/Modal";
import { ReactComponent as NafatLogo } from "assets/images/Naftah-Logo.svg";
import classes from "../../pages/Signup/SingupComponents/Naftah/naftah.module.scss";
import { Input, message } from "antd";
import { ReactComponent as AppleLogo } from "assets/svgs/Apple-logo.svg";
import { ReactComponent as GoogleStore } from "assets/svgs/GoogleStore.svg";
import { useEffect, useState } from "react";
import { timeConverter } from "utils/Helper";
import { nafathInstitutionalStatus } from "services/Login";

export default function NafathVerification({
  setNaftahOpen,
  naftahOpen,
  nafathInfo,
  saveStepOne,
}) {
  const [time, setTime] = useState<number>(180);

  const completeNaftahProcess = async () => {
    const body = {
      nationalId: nafathInfo.national_id,
      transId: nafathInfo.transId,
      random: nafathInfo.random,
    };
    try {
      const { data } = await nafathInstitutionalStatus(body);
      message.success(`Your account status is ${data.status}`);
      saveStepOne();
      setNaftahOpen(false);
    } catch (error) {
      if (error.response.data.status !== "WAITING")
        message.error(error.response.data.status);
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
    <div>
      <AppModal
        width={426}
        footer={null}
        onCancel={() => setNaftahOpen(false)}
        isModalVisible={naftahOpen}
      >
        <div className={classes["naftah-container"]}>
          <div className={classes["naftah-logo-container"]}>
            <div style={{ width: "55px", height: "24px" }}>
              <NafatLogo />
            </div>
            <h5>Naftah App</h5>
          </div>
          <div className={classes["naftah-content"]}>
            <h1>Verify your naftah</h1>
            <p>
              Please open Nafath App and select the below number to complete
              your kyc step one.
            </p>
          </div>
          <div className={classes["naftah-code-container"]}>
            <Input
              className={classes["naftah-input"]}
              readOnly
              value={nafathInfo.random}
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
      </AppModal>
    </div>
  );
}
