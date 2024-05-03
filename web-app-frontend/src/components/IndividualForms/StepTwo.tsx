import { useEffect, useState } from "react";
import { Form, Divider, Select, Row, Col, Spin, message } from "antd";
import classes from "./steps.module.scss";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import RadioGroup from "components/RadioGroup/RadioGroup";
import AppSelect from "components/Select/Select";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";

import { getBankList, getProfile, individualStepOne } from "services/Login";
import { IBANInputHandler } from "utils/Helper";

const { Option } = Select;

const incomeOptions: { label: string; value: string | number }[] = [
  {
    label: "0 - 300k",
    value: "0 - 300k SAR",
  },
  {
    label: "300k - 600k",
    value: "300k - 600k SAR",
  },
  {
    label: "600k - 1M",
    value: "600k - 1M SAR",
  },
  {
    label: "1 Million+",
    value: "1M SAR ++",
  },
];

const sourceOptions: { label: string; value: string | number }[] = [
  {
    label: "Salary",
    value: "Salary",
  },
  {
    label: "Investments",
    value: "Investments income",
  },
  {
    label: "Personal savings",
    value: "Personal savings",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const netWorthOptions: { label: string; value: string | number }[] = [
  {
    label: "Less than 5 million (SAR)",
    value: "5M SAR or less",
  },
  {
    label: "More than 5 million (SAR)",
    value: "5M SAR or more",
  },
];

export const generalObjectiveOptions: {
  label: string;
  value: string | number;
}[] = [
  {
    label: "Capital growth",
    value: "Capital growth",
  },
  {
    label: "Saving",
    value: "Saving",
  },
  {
    label: "Additional income",
    value: "Additional income",
  },
];

export const investmentOptions: { label: string; value: string | number }[] = [
  {
    label: "Low",
    value: "Low",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "High",
    value: "High",
  },
];

interface Step2FormProps {
  onBack: () => void;
  handleSkip: (step: string) => void;
  onComplete: (step: string) => void;
}

//

function Step2Form({ onBack, handleSkip, onComplete }: Step2FormProps) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [loading, setLoading] = useState(false);
  const [bankOptions, setBankOptions] = useState([]);

  const onFinish = async (values) => {
    const body = {
      user_id: userProfile.id,
      kyc_step: 2,
      source_of_income: values.source,
      average_income: values.income,
      net_worth: values.worth,
      investment_objectives: values.investment_objectives,
      investment_knowledge: values.investment_knowledge,
      bank_id: values.bank,
      iban: values.IBAN,
    };
    try {
      setLoading(true);
      const { data } = await individualStepOne(body);
      if (data) {
        getNewData();
        onComplete("2");
        message.success(data.message);
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

  const getNewData = async () => {
    try {
      setLoading(true);
      const { data } = await getProfile();
      if (data) {
        setUserProfile(data.data.user);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      // message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchBankList = async () => {
    try {
      const { data } = await getBankList();
      if (data) setBankOptions(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);
  return (
    <div className="stepForm-container">
      <h1>Financial Information</h1>
      <Spin spinning={loading}>
        <Form
          name="financialInformation"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            source: userProfile?.individual?.source_of_income,
            income: userProfile?.individual?.average_income,
            worth: userProfile?.individual?.net_worth,
            investment_objectives:
              userProfile?.individual?.investment_objectives,
            investment_knowledge: userProfile?.individual?.investment_knowledge,
            bank: userProfile?.accounts?.bank_id,
            IBAN: userProfile?.accounts?.personal_iban_number ?? "SA",
          }}
        >
          <Form.Item
            label="What is your primary source of income?"
            name="source"
            rules={[
              {
                required: true,
                message: "Please enter your source",
              },
            ]}
          >
            <Select
              className="drawer-select"
              placeholder="Select"
              defaultValue={userProfile?.individual?.source_of_income}
            >
              {sourceOptions.map((source, i) => {
                return (
                  <Option key={i} value={source.value}>
                    {source.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="income"
            label="Annual income in (SAR)"
            rules={[
              {
                required: true,
                message: "Please enter your Annual income in (SAR)",
              },
            ]}
          >
            <RadioGroup
              options={incomeOptions}
              defaultValue={userProfile?.individual?.average_income}
            />
          </Form.Item>
          <Form.Item
            name="worth"
            label="Net Worth (Excluding House)"
            rules={[
              {
                required: true,
                message: "Please enter your net worth",
              },
            ]}
          >
            <RadioGroup
              options={netWorthOptions}
              defaultValue={userProfile?.individual?.net_worth}
            />
          </Form.Item>
          <Form.Item
            name="investment_objectives"
            label="What are your general investment objectives?"
            rules={[
              {
                required: true,
                message: "Please enter your answer",
              },
            ]}
          >
            <RadioGroup
              options={generalObjectiveOptions}
              defaultValue={userProfile?.individual?.investment_objectives}
            />
          </Form.Item>
          <Form.Item
            name="investment_knowledge"
            label="Do you have any knowledge related to Investments?"
            rules={[
              {
                required: true,
                message: "Please enter your answer",
              },
            ]}
          >
            <RadioGroup
              options={investmentOptions}
              defaultValue={userProfile?.individual?.investment_knowledge}
            />
          </Form.Item>
          {/* <Form.Item
            name="planning"
            label="How much are you planning to invest in (SAR)?"
            rules={[
              {
                required: true,
                message: "Please enter your amount",
              },
            ]}
          >
            <RadioGroup
              options={objectiveOptions}
              defaultValue={userProfile?.individual?.plan_to_invest}
            />
          </Form.Item> */}
          {/* <Form.Item
          name="investment"
          label="Do you have any knowledge related to Investments?"
        >
          <RadioGroup options={investmentOptions} />
        </Form.Item> */}
          <h1>Bank Information</h1>
          <Row>
            <Col span={12}>
              <Form.Item
                name="IBAN"
                rules={[
                  {
                    required: true,
                    message: "Please enter your IBAN number",
                  },
                  {
                    pattern: /^SA\d{22}$/,
                    message: "Invalid IBAN number",
                  },
                ]}
                getValueFromEvent={IBANInputHandler}
              >
                <Input
                  label="IBAN "
                  placeholder="IBAN "
                  className={`drawer-input-two ${classes["bank-input"]}`}
                  maxLength={24}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                // label="What is your Bank?"
                name="bank"
                rules={[
                  {
                    required: true,
                    message: "Please enter your bank",
                  },
                ]}
              >
                <Select
                  className="drawer-select"
                  placeholder="Select Bank"
                  defaultValue={userProfile?.accounts?.bank_id}
                >
                  {bankOptions.map((bank, i) => {
                    return (
                      <Option key={i} value={bank.value}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "2rem",
                          }}
                        >
                          <img
                            src={bank.logo}
                            alt={`Logo for ${bank.label}`}
                            style={{
                              width: "40px",
                              height: "15px",
                              paddingRight: "7px",
                            }}
                          />
                          {bank.label}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Form.Item>
            <div
              className="drawer-final-container-two"
              style={{ paddingBottom: "30px" }}
            >
              <div className="skip" onClick={() => handleSkip("2")}>
                Skip for now
              </div>
              <div className="previous" onClick={() => onBack()}>
                Previous step
              </div>
              <Button className="complete-btn" htmlType="submit">
                Complete
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default Step2Form;
