import { useState, useEffect } from "react";
import { Row, Col, Form, Input, message, Modal, Spin, Popover } from "antd";
import Button from "components/Button/Button";
import Otp from "components/OTP/Otp";
import { timeConverter } from "utils/Helper";
import { ReactComponent as EditProfile } from "assets/svgs/EditProfile.svg";
import { ReactComponent as DeActivate } from "assets/svgs/DeActivate.svg";
import "./Account.scss";
import {
  deactivateAccount,
  generateUnifonicOTP,
  updatePasswordIns,
  verifyOTP,
} from "services/Login";
import OtpForProfile from "pages/Login/OtpForProfile/OtpForProfile";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Info } from "assets/svgs/Info.svg";

export const PasswordPopoverContent = (
  <>
    <div className="dashboard-modal-content">
      <div>
        <p style={{ marginLeft: "-1rem", maxWidth: "380px" }}>
          <ul>
            <li>At least 8 characters</li>
            <li>At least one Number (0-9)</li>
            <li>At least 1 Uppercase</li>
            <li>At least 1 Lowercase</li>
            <li>
              {`Inclusion of at least one special character, e.g., ! @ # ? ]`}
            </li>
          </ul>
        </p>
      </div>
    </div>
  </>
);
const AccountContent = ({
  tabKey,
  editAccount,
  setEditAccount,
  userProfile,
  mode,
  setUpdate,
  update,
}: any) => {
  // const [editAccount, setEditAccount] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState<number>(60);
  const [confirmDeactivateModal, setConfirmDeactivateModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [confirmModal, setConfirmModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deactivateTime, setDeactivateTime] = useState<number>(60);
  const [deactivateOtp, setDeactivateOtp] = useState("");

  // For otp
  useEffect(() => {
    let timer;
    if (time !== 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [time]);

  const onFinish = async (values: any) => {
    if (values.confirm_password == values.new_password) {
      if (values.current_password) {
        setProfileData(values);
        sentOtp();
        setConfirmModel(true);
      }
    } else {
      message.error("New password and confirm password must be match");
    }
  };

  const updateProfile = async () => {
    try {
      if (profileData) {
        const { data } = await updatePasswordIns(profileData);
        if (data) {
          setUpdate(!update);
          message.success(data.message);
          setTime(60);
          setOtp("");
        }
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
      setTime(60);
      setOtp("");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Otp Modal functions
  const handleOtpCancel = () => {
    setConfirmModel(false);
  };

  const sentOtp = async () => {
    try {
      let body;

      setLoading(true);
      if (userProfile?.phone_number) {
        body = {
          phone_number: userProfile?.phone_number,
        };
      } else {
        body = {
          phone_number: userProfile?.institutional?.phone_number,
        };
      }
      const res = await generateUnifonicOTP(body);
      if (res) {
        setOtp("");
        setTime(60);
        setLoading(false);
        message.success("OTP Sent Successfully!");
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.errors.phone_number[0]);
    }
  };

  const handleDiscard = () => {
    setTime(0);
    setEditAccount(false);
  };

  // For Deactive
  useEffect(() => {
    let timer;
    if (deactivateTime !== 0) {
      timer = setInterval(() => {
        setDeactivateTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deactivateTime]);

  // For deactivate Modals
  const handleCancel = () => {
    setDeactivateTime(0);
    setConfirmDeactivateModal(false);
    setIsModalOpen(false);
  };

  const confirmAccountDelete = () => {
    sentDeactivteOtp();
    setConfirmDeactivateModal(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  // Verify Deactivate Otp
  const nextHandler = async () => {
    let body;

    if (deactivateOtp.length < 4) {
      return message.error("Please enter a valid OTP");
    } else {
      if (userProfile?.phone_number) {
        body = {
          source: userProfile?.phone_number,
          otp: deactivateOtp,
        };
      } else {
        body = {
          source: userProfile?.institutional?.phone_number,
          otp: deactivateOtp,
        };
      }
      try {
        const res = await verifyOTP(body);
        if (res) {
          const { data } = res;
          message.success(data.message);
          deactivateApiCall();
        }
      } catch (error) {
        setDeactivateOtp("");
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      }
    }
  };

  // Send Deativate Otp
  const sentDeactivteOtp = async () => {
    setLoading(true);
    let body;
    try {
      if (userProfile?.phone_number) {
        body = {
          phone_number: userProfile?.phone_number,
        };
      } else {
        body = {
          phone_number: userProfile?.institutional?.phone_number,
        };
      }

      const res = await generateUnifonicOTP(body);
      if (res) {
        setDeactivateOtp("");
        setDeactivateTime(60);
        setLoading(false);
        message.success("OTP Sent Successfully!");
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      setLoading(false);
      message.error(error.response.data.errors.phone_number[0]);
    }
  };

  //Deactive api call
  const deactivateApiCall = async () => {
    try {
      const { data } = await deactivateAccount();
      if (data) {
        localStorage.removeItem("institutional");
        localStorage.removeItem("token");
        window.location.reload();
        message.success(data.message);
        handleCancel();
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="account-panel-container">
      <Modal
        centered
        className="deactivate-modal"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        {confirmDeactivateModal ? (
          <Spin spinning={loading}>
            <div className="signUp-form-container">
              <h2>Please type the OTP received on your phone</h2>
              <Otp setOtp={setDeactivateOtp} otp={deactivateOtp} />
              <p className="timer">
                {deactivateTime !== 0
                  ? timeConverter(deactivateTime)
                  : "OTP expired"}{" "}
                {deactivateTime ? <span>left</span> : null}
              </p>
              <Button
                onClick={() => nextHandler()}
                block
                className="confirm-deactivate-btn"
              >
                Confirm deactivation
              </Button>
              <p className="cancel" onClick={() => handleCancel()}>
                Cancel
              </p>
              {deactivateTime == 0 ? (
                <p className="form-bottom" onClick={() => sentDeactivteOtp()}>
                  Resend OTP
                </p>
              ) : (
                <p className="form-bottom"></p>
              )}
            </div>
          </Spin>
        ) : (
          <>
            <div className="icon">
              <DeActivate />
            </div>
            <h1>Deactivate your account?</h1>
            <p
              className="cancel"
              style={{ marginTop: "12px", fontSize: "14px" }}
            >
              Are you sure you want to deactivate?
            </p>

            <Button
              onClick={() => confirmAccountDelete()}
              block
              className="confirm-deactivate-btn"
              style={{ marginTop: "35px" }}
            >
              Deactivate
            </Button>
            <p className="cancel" onClick={() => handleCancel()}>
              Cancel
            </p>
          </>
        )}
      </Modal>

      <Modal
        centered
        className="logout-modal"
        visible={confirmModal}
        onOk={() => {}}
        onCancel={handleOtpCancel}
        footer={false}
        maskClosable={false}
      >
        <OtpForProfile
          loading={loading}
          setTime={setTime}
          setOtp={setOtp}
          time={time}
          otp={otp}
          setIsModalOpen={setConfirmModel}
          user={userProfile}
          updateProfile={updateProfile}
          sentOtp={sentOtp}
        />
      </Modal>

      <div className="account-info">
        {editAccount && tabKey === "2" ? (
          <>
            <Form
              name="basic"
              className="account-form-container"
              initialValues={{
                email: userProfile?.email,
                password: "",
              }}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={32}>
                <Col lg={7} sm={12}>
                  <Form.Item
                    label="Current email"
                    name="email"
                    rules={[
                      {
                        // required: true,
                        type: "email",
                        message: "Please enter your email!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col lg={13} sm={12}>
                  <Form.Item
                    label="Change password"
                    name="current_password"
                    rules={[
                      {
                        required: false,
                        message: "Please input your password!",
                      },
                    ]}
                    initialValue=""
                  >
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                </Col>
                <div
                  className="edit-info"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div className="profile-btns">
                    <p onClick={() => handleDiscard()}>Discard</p>
                    <Button htmlType="submit" className="profile-edit-btn">
                      Save
                    </Button>
                  </div>
                </div>
              </Row>
              <Row gutter={32}>
                <Col lg={7} sm={12}>
                  {/* <Form.Item
                    name="newEmail"
                    rules={[
                      {
                        required: false,
                        type: "email",
                        message: "Please enter your email!",
                      },
                    ]}
                    initialValue=""
                  >
                    <Input placeholder="Enter new email" />
                  </Form.Item> */}
                </Col>
                <Col lg={7} sm={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Form.Item
                      name="new_password"
                      rules={[
                        {
                          required: false,
                          message: "Please input your password!",
                        },
                      ]}
                      initialValue=""
                    >
                      <Input.Password placeholder="Enter new password" />
                    </Form.Item>
                    <Popover
                      content={PasswordPopoverContent}
                      placement="top"
                      className="dashboard-popover"
                    >
                      <div style={{ marginLeft: ".5rem" }}>
                        <Info />
                      </div>
                    </Popover>
                  </div>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col lg={7} sm={12}>
                  {/* <Form.Item
                    name="confirmEmail"
                    rules={[
                      {
                        required: false,
                        type: "email",
                        message: "Please enter your email!",
                      },
                    ]}
                    initialValue=""
                  >
                    <Input placeholder="Confirm new email" />
                  </Form.Item> */}
                </Col>
                <Col lg={7} sm={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Form.Item
                      name="confirm_password"
                      rules={[
                        {
                          required: false,
                          message: "Please input your password!",
                        },
                      ]}
                      initialValue=""
                    >
                      <Input.Password placeholder="Confirm new password" />
                    </Form.Item>
                    <Popover
                      content={PasswordPopoverContent}
                      placement="top"
                      className="dashboard-popover"
                    >
                      <div style={{ marginLeft: ".5rem" }}>
                        <Info />
                      </div>
                    </Popover>
                  </div>
                </Col>
              </Row>
            </Form>
          </>
        ) : (
          <>
            <Row>
              <Col lg={10} sm={12}>
                <p>Email</p>
                <h1>{userProfile?.email}</h1>
              </Col>
              <Col lg={10} sm={12}>
                <p>Password</p>
                <h1>********</h1>
              </Col>
              <Col lg={4} sm={12}>
                <div
                  className="edit-profile-icon"
                  onClick={() => {
                    setEditAccount(true);
                  }}
                >
                  <EditProfile />
                </div>
              </Col>
            </Row>
            {/* <Row>
              <Col lg={5} sm={12} style={{ marginTop: "39px" }}>
                <p>Contract</p>
                <div className="document-view-container">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <PDF width="16px" height="16px" />
                    <span style={{ marginLeft: "10px", fontWeight: "800" }}>
                      عقد الوكالة بالاستثمار
                    </span>
                  </div>
                  <div>
                    <View />
                    <Download style={{ marginLeft: "10px" }} />
                  </div>
                </div>
              </Col>
            </Row> */}
          </>
        )}
      </div>
      <div className="deactivate-row">
        <p>Deactivate my account</p>
        <Button className="deactivate-btn" onClick={() => showModal()}>
          Deactivate
        </Button>
      </div>
    </div>
  );
};

export default AccountContent;
