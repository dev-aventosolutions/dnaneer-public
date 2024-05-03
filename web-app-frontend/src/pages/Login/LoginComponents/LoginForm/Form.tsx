import { useState } from "react";
import { Form, Radio, Space, Select, message } from "antd";
import { ReactComponent as PhoneIcon } from "assets/svgs/Phone.svg";
import AppInput from "components/Input/Input";
import Button from "components/Button/Button";
import { ReactComponent as FormLockIcon } from "assets/svgs/form-lock-icon.svg";
import { ReactComponent as Mail } from "assets/svgs/Mail.svg";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const LoginFields = ({ onFinish, onFinishFailed, userType, loader }) => {
  const navigate = useNavigate();
  const [phoneNum, setPhoneNum] = useState("+966");
  const onChangePhone = (e) => {
    const { value } = e.target;
    if (value[4] === undefined) {
      return setPhoneNum("+966");
    }
    if (value[4] !== "5") {
      return message.error("Number must start with 5");
    }

    if (value.length > 3 && /^\+\d*$/.test(value)) {
      return setPhoneNum(value);
    }
  };
  return (
    <Form
      name="basic"
      initialValues={{
        type: "individual",
        phone: "",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* {userType === "individual" ? (
        <>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please enter your phone no",
              },
            ]}
          >
            <div className="phone-item">
              <AppInput
                // max={9}
                maxLength={13}
                value={phoneNum}
                onChange={onChangePhone}
                label="Phone number"
                placeholder="XXXXXXXX"
                prefix={<PhoneIcon />}
                // disabled={disabled}
                className={"appInput"}
              />
            </div>
          </Form.Item>
        </>
      ) : ( */}
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
              label="Password"
              placeholder="Password"
              prefix={<FormLockIcon />}
              // onChange={onChangePassword}
            />
          </Form.Item>
        </div>
      {/* )} */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer",
        }}
        onClick={() => navigate("/forget-password")}
      >
        Forget password?
      </div>
      <Form.Item>
        <Button
          loading={loader}
          htmlType="submit"
          block={true}
          style={{ height: "55px", marginTop: "5px" }}
          // onClick={() => navigate("/dashboard")}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginFields;
