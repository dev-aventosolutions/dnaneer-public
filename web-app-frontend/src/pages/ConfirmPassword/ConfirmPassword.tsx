import { useNavigate } from "react-router-dom";
import { ReactComponent as Start } from "assets/svgs/Start.svg";
import "./confirmPassword.scss";
import { Button, Form } from "antd";
import AppInput from "components/Input/Input";
import { ReactComponent as FormLockIcon } from "assets/svgs/form-lock-icon.svg";
import PasswordChecker from "components/PasswordChecker/PasswordChecker";
import { useState } from "react";
import { passwordTester } from "utils/Helper";

const FormItem = Form.Item;

const ConfirmPassword = () => {
  const navigate = useNavigate();
  const [passwordLength, setPasswordLength] = useState(0);
  const [testPassword, setPasswordTest] = useState({
    lengthVal: false,
    oneNumVal: false,
    oneUpCaseVal: false,
    oneLowCaseVal: false,
    specialVal: false,
  });
  const onChangePassword = (e) => {
    const { value } = e.target;
    setPasswordLength(value.length);
    setPasswordTest(passwordTester(testPassword, value));
  };
  return (
    <div className="confirm-password-container">
      <div style={{ textAlign: "center" }}>
        <div>
          <Start />
        </div>
        <h1 className="heading">Forget Password</h1>
        <Form>
          <FormItem name="password">
            <div>
              <AppInput
                iconRender={true}
                label="Create Password"
                placeholder="Create Password"
                prefix={<FormLockIcon />}
                onChange={onChangePassword}
              />

              <PasswordChecker testPassword={testPassword} />
            </div>
          </FormItem>
          <FormItem name="confirm">
            <AppInput
              iconRender={true}
              label="Re-Enter Password"
              placeholder="Re-Enter Password"
              prefix={<FormLockIcon />}
              onChange={onChangePassword}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              shape="round"
              block
              style={{ height: "52px", marginTop: "1rem" }}
              onClick={() => navigate("/dashboard")}
            >
              Confirm Password
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmPassword;
