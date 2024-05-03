import { useState, useEffect } from "react";
import Button from "components/Button/Button";
import { ReactComponent as BackArrow } from "assets/svgs/BackArrow.svg";
import AuthContainer from "components/AuthContainer/AuthContainer";
import AppInput from "components/Input/Input";
import { Checkbox, Form, message } from "antd";
import { ReactComponent as User } from "assets/svgs/form-user-icon.svg";
import { ReactComponent as FormLockIcon } from "assets/svgs/form-lock-icon.svg";
import { ReactComponent as PhoneIcon } from "assets/svgs/Phone.svg";
import { getInstitutionalNaftah } from "services/Login";
import { PhoneNoInputHandler } from "utils/Helper";
import Input from "components/Input/Input";

const InstitutionalStepTwo = ({
  individual,
  userId,
  setUserId,
  setShowInstitutionalStepTwo,
  setNafathInfo,
  setShowNafath,
  setShowPhone,
  institutionalStepTwoData,
  setInstitutionalStepTwoData,
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [iAgree, setIAgree] = useState(false);
  const [phoneNum, setPhoneNum] = useState("+966");

  const backHandler = () => {
    setShowNafath(false);
    setShowInstitutionalStepTwo(false);
    setShowPhone(true);
  };
  const nextHandler = async (values) => {
    try {
      const body = {
        national_id: values.national_id,
        phone_number: values.phone_number,
        locale: "ar",
        user: userId,
      };
      setLoader(true);
      {
        const { data } = await getInstitutionalNaftah(body);
        message.success("Nafath Notification Sent");
        setNafathInfo({ ...body, data });
        setShowNafath(true);
      }
      setShowInstitutionalStepTwo(false);
    } catch (error) {
      const err = error.response.data.errors;
      Object.keys(err).forEach(function (key, index) {
        message.error(err[key][0]);
      });
    } finally {
      setLoader(false);
    }
  };
  const onChangePhone = (e) => {
    //  console.log(e.target.value.length)
    const { value } = e.target;
    // console.log("value", value, value[4])
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
    <AuthContainer>
      <Button
        style={{ padding: "none" }}
        className="singUp-back-btn"
        icon={<BackArrow />}
        onClick={backHandler}
      >
        Back
      </Button>
      <p className="title">Institutional Investor</p>
      <h2>Investments Manager Registration</h2>
      <div style={{ marginTop: "34px" }}>
        <Form
          onFinish={nextHandler}
          initialValues={{
            phone_number: "+966",
          }}
        >
          <Form.Item
            name="national_id"
            rules={[
              {
                required: true,
                message: "Please enter your National ID",
              },
            ]}
          >
            <AppInput
              label="National ID"
              placeholder="National ID"
              prefix={<User />}
            />
          </Form.Item>
          <Form.Item
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please enter your valid phone!",
              },
              {
                pattern: /^\+9665\d{8}$/,
                message:
                  "Phone number must start with '+9665' and be followed by 8 digits.",
              },
            ]}
            getValueFromEvent={PhoneNoInputHandler}
          >
            <AppInput
              maxLength={13}
              label="Phone number"
              placeholder="XXXXXXXX"
              value={phoneNum}
              prefix={<PhoneIcon />}
              className={"appInput"}
            />
          </Form.Item>
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
            <div style={{ marginTop: "10px" }} className="terms-radio">
              <Checkbox
                value={iAgree}
                onClick={(e: any) => {
                  setIAgree(e.target.checked);
                }}
              >
                <span className="terms">
                  I am authorized to invest on behalf of the registered company
                </span>
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginTop: "40px" }}
              className="otp-next-btn"
              htmlType="submit"
            >
              Next
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthContainer>
  );
};

export default InstitutionalStepTwo;
