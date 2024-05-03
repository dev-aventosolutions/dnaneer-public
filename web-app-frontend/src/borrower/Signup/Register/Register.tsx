import { useState } from "react";
import Button from "components/Button/Button";
import { Checkbox, Form, Radio, Spin, message } from "antd";
import { ReactComponent as Mail } from "assets/svgs/Mail.svg";
import { ReactComponent as Tick } from "assets/svgs/Tick.svg";
import { ReactComponent as Cross } from "assets/svgs/Cut.svg";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FormLockIcon } from "assets/svgs/form-lock-icon.svg";
// import { ReactComponent as PhoneIcon } from "assets/svgs/Phone.svg";
import BorrowerLayout from "components/AuthContainer/AuthContainer";
import AuthWrapper from "components/HOC/BorrowerAuth";
import AppInput from "components/Input/Input";
import BorrowerOtp from "borrower/Signup/Otp/Otp";
import { generateBorrowerOtp, verifyCRNumber } from "services/BorrowerApis";
const Register = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [lengthVal, setLengthVal] = useState(false);
  const [oneNumVal, setOneNumVal] = useState(false);
  const [oneUpCaseVal, setOneUpCaseVal] = useState(false);
  const [oneLowCaseVal, setOneLowCaseVal] = useState(false);
  const [specialVal, setSpecialVal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iAgree, setIAgree] = useState(false);
  const [registerData, setRegisterData] = useState({
    cr_number: "",
    email: "",
  });
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setRegisterData(values);

    try {
      setLoading(true);
      const { data } = await generateBorrowerOtp({
        email: values?.email,
        cr_number: values?.cr_number,
        password: values?.password,
      });
      if (data) {
        setLoading(false);
        setShowOtp(true);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
      setLoading(false);
    }
    //   // setShowOtp(true);

    //   // navigate("/borrower/otp");
  };

  const onChangePassword = (e) => {
    const { value } = e.target;
    setPasswordLength(value.length);

    value.length >= 8 ? setLengthVal(true) : setLengthVal(false);

    const numRegex = new RegExp("(?=.*[0-9])");
    const numTest = numRegex.test(value);
    numTest ? setOneNumVal(true) : setOneNumVal(false);

    const upCaseRegex = new RegExp("(?=.*[A-Z])");
    const upCaseTest = upCaseRegex.test(value);
    upCaseTest ? setOneUpCaseVal(true) : setOneUpCaseVal(false);

    const lowCaseRegex = new RegExp("(?=.*[a-z])");
    const lowCaseTest = lowCaseRegex.test(value);
    lowCaseTest ? setOneLowCaseVal(true) : setOneLowCaseVal(false);

    const symbolRegex = new RegExp("(?=.*[!@#$%^&*])");
    const symbolTest = symbolRegex.test(e.target.value);
    symbolTest ? setSpecialVal(true) : setSpecialVal(false);
  };
  return (
    <Spin spinning={loading}>
      <BorrowerLayout>
        <h1>Get Started</h1>
        {showOtp ? (
          <>
            <BorrowerOtp setShowOtp={setShowOtp} registerData={registerData} />
          </>
        ) : (
          <Form
            name="signup"
            initialValues={{
              type: "individual",
              cr_number: registerData?.cr_number,
              email: "",
              password: "",
            }}
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="cr_number"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Please enter your Commercial Registration Number",
                },
              ]}
            >
              <AppInput
                // max={9}
                maxLength={10}
                label="Commercial Registration Number"
                //   value={phoneNum}
                prefix={"#"}
                // disabled={disabled}
                //   onChange={onChangePhone}
                // className={"appInput"}
              />
            </Form.Item>

            <div style={{ marginTop: "16px" }}>
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
                <AppInput label="Email" placeholder="Email" prefix={<Mail />} />
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
                  label="Create Password"
                  placeholder="Create Password"
                  prefix={<FormLockIcon />}
                  onChange={onChangePassword}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("The passwords do not match!");
                    },
                  }),
                ]}
              >
                <AppInput
                  iconRender={true}
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  prefix={<FormLockIcon />}
                />
              </Form.Item>

              {passwordLength >= 1 && (
                <div className="password-validations">
                  <p style={{ color: lengthVal ? "#17B890" : "#C4C1CA" }}>
                    {lengthVal ? <Tick /> : <Cross />}
                    At least 8 characters
                  </p>
                  <p style={{ color: oneNumVal ? "#17B890" : "#C4C1CA" }}>
                    {oneNumVal ? <Tick /> : <Cross />}
                    At least one Number (0-9)
                  </p>
                  <p style={{ color: oneUpCaseVal ? "#17B890" : "#C4C1CA" }}>
                    {oneUpCaseVal ? <Tick /> : <Cross />}
                    At least 1 Uppercase
                  </p>
                  <p style={{ color: oneLowCaseVal ? "#17B890" : "#C4C1CA" }}>
                    {oneLowCaseVal ? <Tick /> : <Cross />}
                    At least 1 Lowercase
                  </p>

                  <p style={{ color: specialVal ? "#17B890" : "#C4C1CA" }}>
                    {specialVal ? <Tick /> : <Cross />}
                    Inclusion of at least one special character, e.g., ! @ # ? ]
                  </p>
                </div>
              )}
            </div>

            <Form.Item
              name="isApproved"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (iAgree) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Please accept terms & conditions");
                  },
                }),
              ]}
            >
              <div className="terms-radio">
                <Checkbox
                  value={iAgree}
                  onClick={(e: any) => {
                    setIAgree(e.target.checked);
                  }}
                >
                  <span className="terms">
                    I agree to{" "}
                    <a
                      href="https://dnaneer.com/terms-conditions/"
                      target="_blank"
                    >
                      {" "}
                      Terms & Conditions
                    </a>
                    <span>&</span>
                    <a
                      href="https://dnaneer.com/privacy-policy/"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </Checkbox>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                //   loading={loader}
                htmlType="submit"
                block={true}
                className="phone-submit"
              >
                Register
              </Button>
            </Form.Item>
            <a onClick={() => navigate("/borrower/login")}>
              <p className="form-bottom">Log in</p>
            </a>
          </Form>
        )}
      </BorrowerLayout>
    </Spin>
  );
};

const RegisterPage = AuthWrapper(Register);

const BorrowerRegister = () => {
  const [individual, setIndividual] = useState<string>("borrower");

  return <RegisterPage individual={individual} setIndividual={setIndividual} />;
};

export default BorrowerRegister;
