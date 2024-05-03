import { Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import AppInput from "components/Input/Input";
import AuthContainer from "components/AuthContainer/AuthContainer";
import { ReactComponent as FormLockIcon } from "assets/svgs/form-lock-icon.svg";
import { ReactComponent as Mail } from "assets/svgs/Mail.svg";
import AuthButton from "borrower/Components/AuthButton/AuthButton";
import { useState } from "react";
import { borrowerLogin } from "services/BorrowerApis";
import { useRecoilState } from "recoil";
import { borrowerProfileAtom } from "store/user";
import { encryptUser } from "utils/Helper";
import LoginOtp from "pages/Login/LoginComponents/LoginOtp/LoginOtp";
import { generateOTP } from "services/Login";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useRecoilState(borrowerProfileAtom);
  const [switchForms, setSwitchForm] = useState<"login" | "otp">("login");
  const [userCredentials, setUserCredentials] = useState({});
  const onFinish = async (values) => {
    setUserCredentials(values);
    try {
      setLoading(true);
      const { data } = await borrowerLogin(values);
      if (data) {
        if (data?.data?.user?.kyc_step == 3) {
          navigate(`/borrower/status/pending`);
        } else if (data?.data?.user?.kyc_step == 4) {
          navigate(`/borrower/status/rejected`);
        } else if (data?.message == "OTP sent successfully.") {
          try {
            setSwitchForm("otp");
          } catch (error) {
            console.log("error", error);
          }
        } else if (data?.data?.user?.kyc_step < 3) {
          navigate(`/borrower-request/${data?.data?.user?.kyc_step}`);
        }
        setLoading(false);
        message.success(data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <AuthContainer>
      <>
        {switchForms === "login" ? (
          <>
            <p className="title">Company</p>
            <h2>Get Started</h2>
            <Form
              name="borrower-login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div style={{ marginTop: "34px" }}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please enter your email",
                    },
                  ]}
                >
                  <AppInput
                    label="Email"
                    placeholder="Email"
                    prefix={<Mail />}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                >
                  <AppInput
                    iconRender={true}
                    label="Password"
                    placeholder="Password"
                    prefix={<FormLockIcon />}
                    // onChange={onChangePassword}
                  />
                </Form.Item>
                <Form.Item>
                  <AuthButton
                    loading={loading}
                    name="Login"
                    htmlType="submit"
                  />
                </Form.Item>
              </div>
              <a href="/borrower/register">
                <p className="form-bottom-password">Register</p>
              </a>
            </Form>
          </>
        ) : (
          <>
            <LoginOtp
              userType={"borrower"}
              setSwitchForm={setSwitchForm}
              userId={userCredentials}
              nafathInfo={{}}
              setNafathInfo={()=>{}}
            />
          </>
        )}
      </>
    </AuthContainer>
  );
};

export default LoginForm;
