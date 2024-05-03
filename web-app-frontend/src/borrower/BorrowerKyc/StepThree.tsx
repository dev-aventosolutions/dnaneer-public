import {
  Button,
  Divider,
  RadioChangeEvent,
  Radio,
  Select,
  Form,
  message,
  Spin,
} from "antd";
import classes from "./steps.module.scss";
import "./borrowerKyc.scss";
import { useEffect, useState } from "react";
import FloatSelect from "components/Select/Select";
import RadioGroup from "components/RadioGroup/RadioGroup";
import { useNavigate } from "react-router-dom";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import { borrowerKycStep, getBorrowerKyc } from "services/BorrowerApis";

const { Option } = Select;

const StepThree = ({ data, handleSkip, onSuccess, onBack }) => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const timeOptions: { label: string; value: string | number }[] = [
    {
      label: "0-3 months",
      value: "0-3 months",
    },
    {
      label: "3 months- 6 months",
      value: "3 months- 6 months",
    },
    {
      label: "6 months- 1 year",
      value: "6 months- 1 year",
    },
    {
      label: "1 year - 5 years",
      value: "1 year - 5 years",
    },
  ];

  const debtOptions: { label: string; value: string | number }[] = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 0,
    },
  ];
  const getDetail = async () => {
    try {
      setLoading(true);
      const { data } = await getBorrowerKyc();
      if (data) {
        if (data?.data?.data?.step == 3) {
          navigate(`/borrower/status/pending`);
        } else if (data?.data?.data?.step == 4) {
          navigate(`/borrower/status/rejected`);
        } else if (data?.data?.data?.step == 5) {
          navigate("/borrower/login");
        } else if (data?.data?.data?.step < 3) {
          navigate(`/borrower-request/${data?.data?.data?.step}`);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("err", error.response.data.message);
      setLoading(false);

      // message.error(error.response.data.message);
    }
  };
  const onFinish = async (values) => {
    const body = {
      user_id: userProfile?.user_id,
      step: 3,
      seeking_amount: values?.funding,
      repayment_duration: values?.time,
      existing_obligations: values?.debt,
    };
    try {
      setLoading(true);
      const { data } = await borrowerKycStep(body);
      if (data) {
        message.success(data.message);
        getDetail();
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading}>
      <div>
        <div>
          <h1 style={{ fontSize: "20px" }} className={classes["step-heading"]}>
            Fund Request Information
          </h1>
        </div>

        <Divider style={{ margin: "0" }} />
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="register-input-container">
            <Form.Item
              name="funding"
              label="How much funding are you seeking (SAR)?"
            >
              <FloatSelect
                label=""
                className="drawer-select"
                defaultValue={"0-300k"}
              >
                <Option value="0-300k">0 - 300k</Option>
                <Option value="300k-600k">300k - 600k</Option>
                <Option value="600-1M">600k - 1M</Option>
                <Option value="1M-2M">1M - 2M</Option>
                <Option value="2M-4M">2M - 4M</Option>
                <Option value="4M-7.5M">4M - 7.5M</Option>
              </FloatSelect>
            </Form.Item>
          </div>

          <Form.Item
            name="time"
            label="What is the expected timeline for the loan repayment?"
          >
            <RadioGroup options={timeOptions} />
          </Form.Item>
          <div className="debt-options">
            <Form.Item
              name="debt"
              label="Does the company have any existing debt obligations?"
            >
              <RadioGroup options={debtOptions} />
            </Form.Item>
          </div>

          <Divider />
          <div className={classes["drawer-final-container"]}>
            <div className={classes["skip"]}></div>
            <div className={classes["previous"]} onClick={() => onBack()}>
              Previous step
            </div>

            <Button className={classes["complete-btn"]} htmlType="submit">
              Next
            </Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default StepThree;
