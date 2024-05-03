import { useState, useEffect } from "react";
import { Col, Row, Button, message } from "antd";
import InvestInput from "./InvestInput";
import Card from "components/Card/Card";
import Modal from "components/Modal/Modal";
import AppButton from "components/Button/Button";
import Otp from "components/OTP/Otp";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import {
  investOpportunity,
  verifyUnifonicOTP,
  generateUnifonicOTP,
} from "services/Login";
import { commaSeparator, timeConverter } from "utils/Helper";
import { ReactComponent as InvestmentBack } from "assets/svgs/InvestmentBack.svg";
import { ReactComponent as TransferBack } from "assets/svgs/TransferBack.svg";
import { ReactComponent as Thanks } from "assets/svgs/Thanks.svg";
import { ReactComponent as No } from "assets/svgs/No.svg";
import { useNavigate } from "react-router-dom";

const Invest = ({ detailInvestment }) => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [investment, setInvestment] = useState<number>(0);
  const [investInpuVal, setInvestInput] = useState("");
  const [showInvestment, setShowInvestment] = useState(false);

  let Percent = (detailInvestment?.net_roi / 100).toFixed(2);
  let PercentAnnual = (detailInvestment?.annual_roi / 100).toFixed(2);
  let durationInyears = (detailInvestment?.duration / 12).toFixed(2);

  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const confirmTransfer = async () => {
    if (otp.length < 4) {
      return message.error("Enter OTP");
    } else {
      try {
        setButtonLoader(true);
        const { data } = await verifyUnifonicOTP({
          phone_number: userProfile?.phone_number,
          otp: otp,
        });
        if (data) {
          message.success(data?.message);
          try {
            setLoading(true);
            const { data } = await investOpportunity({
              user_id: userProfile?.id,
              opportunity_id: detailInvestment.id,
              amount: parseFloat(investInpuVal.replace(/,/g, "")),
            });
            if (data) {
              message.success(data?.message);
              setShowConfirm(true);
            }
          } catch (error) {
            console.log("err", error.response.data.message);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setButtonLoader(false);
      }
    }
  };
  const handlePercentage = () => {
    const fundAmount = parseInt(detailInvestment?.fund_needed);
    const investmentAmount = parseInt(investInpuVal.replace(/,/g, ""), 10);
    const percentage = (investmentAmount / fundAmount) * 100;
    return percentage;
  };

  const handleMode = () => {
    if (userProfile?.mode === "vip") return "vip";
    return "regular";
  };
  const hasBalance = () => {
    const investmentAmount = parseInt(
      investInpuVal.replace(/,/g, "") ? investInpuVal.replace(/,/g, "") : "0",
      10
    );
    const balance = parseInt(userProfile?.accounts?.balance);
    return investmentAmount <= balance;
  };

  const sendOTP = async () => {
    setButtonLoader(true);
    if (!userProfile?.phone_number) {
      message.warning("Kindly complete your KYC Form");
      setButtonLoader(false);
      return;
    } else {
      const body = {
        phone_number: userProfile?.phone_number,
      };
      try {
        const res = await generateUnifonicOTP(body);
        if (res) {
          message.success("OTP Sent Successfully!");
          setTime(60);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.errors.phone_number[0]);
      } finally {
        setButtonLoader(false);
      }
    }
  };
  const confirmModalHandler = () => {
    if (
      Number(userProfile?.accounts?.balance) >
      parseInt(investInpuVal.replace(/,/g, ""))
    ) {
      sendOTP();
    } else {
      setIsModalOpen(true);
    }
  };

  const maskCRNumber = (crNumber: any) => {
    // Your masking logic here
    if (typeof crNumber === "string" && crNumber.length >= 4) {
      const lastFourDigits = crNumber.slice(-4); // Get the last 4 digits
      return "*".repeat(crNumber.length - 4) + lastFourDigits;
    } else {
      return crNumber;
    }
  };
  return (
    <div>
      <Modal
        centered
        className="transfer-info-model"
        isModalVisible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="transfer-back" onClick={handleCancel}>
          <TransferBack />
          <p>Back</p>
        </div>

        <div className="modal-content">
          {Number(userProfile?.accounts?.balance) >
          parseInt(investInpuVal.replace(/,/g, "")) ? (
            <>
              {showConfirm ? (
                <>
                  <div className="questionIcon">
                    <Thanks />
                  </div>
                  <h1>You have successfully invested in this opportunity </h1>

                  <AppButton
                    block
                    style={{ height: "52px", marginTop: "36px" }}
                    onClick={() => {
                      setShowConfirm(false);
                      setIsModalOpen(false);
                      window.location.reload();
                    }}
                  >
                    Ok
                  </AppButton>
                </>
              ) : (
                <>
                  <h2>Please type the OTP received on your phone</h2>
                  <div className="deactivate-otp-container">
                    <Otp setOtp={setOtp} otp={otp} />
                  </div>
                  <p className="timer">
                    {time !== 0 ? timeConverter(time) : "OTP expired"}{" "}
                    {time ? <span>left</span> : null}
                  </p>
                  <AppButton
                    loading={buttonLoader}
                    block
                    style={{ height: "52px", marginTop: "108px" }}
                    onClick={confirmTransfer}
                  >
                    Confirm
                  </AppButton>
                </>
              )}
            </>
          ) : (
            <>
              <div className="questionIcon">
                <No />
              </div>
              <h1>You don’t have sufficient balance</h1>
              <p className="description">
                Please add balance to be able to continue
              </p>
              <Button
                block
                className="close-btn"
                style={{ height: "52px", marginTop: "36px" }}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Okay
              </Button>
              <p className="description" style={{ paddingBottom: "20px" }}>
                Dismiss
              </p>
            </>
          )}
        </div>
      </Modal>

      <Row justify="end">
        <Col style={{ minWidth: "388px", maxWidth: "388px" }}>
          <div className="invest box-shadow">
            {showInvestment ? (
              <>
                <div
                  onClick={() => setShowInvestment(false)}
                  className="back-header"
                >
                  <InvestmentBack />
                  <p>Back</p>
                </div>
                <h1 className="large-heading">You will invest</h1>
                <div className="invest-netPrice" style={{ marginTop: "9px" }}>
                  <span className="net-unit">
                    {investInpuVal}
                    <span style={{ marginLeft: "8px" }}>SAR</span>
                  </span>
                </div>
                <h1 className="large-heading">You will receive</h1>
                <div className="invest-net" style={{ marginTop: "9px" }}>
                  <span className="net-unit">
                    {(
                      +investInpuVal.replaceAll(",", "") +
                      +investInpuVal.replaceAll(",", "") *
                        +PercentAnnual *
                        +durationInyears
                    ).toFixed(2)}
                    <span style={{ marginLeft: "8px" }}>SAR</span>
                  </span>
                </div>
                <p className="net-roi">{`The annual ROI ${detailInvestment?.annual_roi}% * duration ${detailInvestment?.duration} months`}</p>
                <Button
                  style={{
                    marginTop: "37px",
                    width: "100%",
                    color: "#fff",
                    background: "#5B2CD3",
                    fontSize: "16px",
                    padding: "1.67rem 1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                  }}
                  shape="round"
                  loading={buttonLoader}
                  onClick={confirmModalHandler}
                >
                  Confirm
                </Button>
              </>
            ) : (
              <>
                <h1 className="large-heading">I will invest</h1>
                <br />
                <InvestInput
                  handleMode={handleMode}
                  investInpuVal={investInpuVal}
                  setInvestInput={setInvestInput}
                  handlePercentage={handlePercentage}
                  hasBalance={hasBalance}
                />
                <div className="invest-text">
                  <p>
                    Your expected return will be calculated automatically based
                    on the Annual ROI * duration
                  </p>
                </div>
                <div className="invest-net">
                  <span className="net-unit">
                    {commaSeparator(
                      (
                        +investInpuVal.replaceAll(",", "") *
                        +PercentAnnual *
                        +durationInyears
                      ).toFixed(2)
                    )}
                    <span style={{ marginLeft: "8px" }}>SAR</span>
                  </span>
                  <span className="net-text">Net return of investment</span>
                </div>
                {detailInvestment.already_invested ? (
                  <>
                    <Button
                      style={{
                        marginTop: "20px",
                        width: "100%",
                        color: "#fff",
                        background: "#bcb1d6",
                        fontSize: "16px",
                        padding: "1.67rem 1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "none",
                      }}
                      shape="round"
                      disabled={true}
                      onClick={() => setShowInvestment(true)}
                    >
                      Invest Now
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      style={{
                        marginTop: "20px",
                        width: "100%",
                        color: "#fff",
                        background:
                          (handleMode() === "regular" &&
                            handlePercentage() > 25) ||
                          investInpuVal.length === 0 ||
                          (handleMode() === "vip" && handlePercentage() > 100)
                            ? "#bcb1d6"
                            : "#5B2CD3",
                        fontSize: "16px",
                        padding: "1.67rem 1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "none",
                      }}
                      shape="round"
                      disabled={
                        (handleMode() === "regular" &&
                          handlePercentage() > 25) ||
                        investInpuVal.length === 0 ||
                        (handleMode() === "vip" && handlePercentage() > 100)
                          ? true
                          : false
                      }
                      onClick={() => setShowInvestment(true)}
                    >
                      Invest Now
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <Card className="details-card">
            <h1>Company Details</h1>
            <Row>
              <Col lg={12}>
                <p>Commercial registration</p>
                <h2>#{maskCRNumber(detailInvestment.cr_number)}</h2>
              </Col>
              <Col lg={12}>
                <p>Annual Revenue</p>
                <h2>{detailInvestment.annual_revenue}</h2>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <p>Establishment Date</p>
                <h2>{detailInvestment.establishment_date}</h2>
              </Col>
              <Col lg={12}>
                <p>Location</p>
                <h2>{detailInvestment.company_location}</h2>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Invest;
