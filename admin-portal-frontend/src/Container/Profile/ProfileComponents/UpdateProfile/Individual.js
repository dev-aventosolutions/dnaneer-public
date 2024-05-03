import React, { useState, useEffect } from "react";

import {
  Form,
  Button,
  Input,
  message,
  Select,
  DatePicker,
  Spin,
  Row,
  Col,
} from "antd";

import {
  getBankList,
  getAdvisorsList,
  updateIndividualInvestor,
} from "../../../../services/ApiHandler";
import moment from "moment";
import { useParams } from "react-router-dom";
import { IBANInputHandler } from "../../../../utils/Helper";
import dayjs from "dayjs";
// import FileUpload from "../../Components/FileUpload";
const { Option } = Select;

const AddOpportunityForm = ({ setIsModalOpen, userProfile, apiCall }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [bankOptions, setBankOptions] = useState([]);
  const [advisorsOptions, setAdvisorsOptions] = useState([]);
  const params = useParams();
  const [showEmployeeFields, setShowEmployeeFields] = useState(
    userProfile?.individual?.employee === "Yes"
  );

  const handleEmployeeChange = (e) => {
    setShowEmployeeFields(e === "Yes");
  };

  useEffect(() => {
    (async () => {
      // const id = params.id;
      try {
        setLoader(true);
        const advisorsResponse = await getAdvisorsList();
        const { data } = await getBankList();
        if (data) {
          // console.log("advisorsResponse", advisorsResponse);
          // console.log("getBankList", data);
          setAdvisorsOptions(advisorsResponse.data.data[0]);
          setBankOptions(data.data);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    })();
  }, []);

  const onFinish = async (values) => {
    const body = {
      user_id: params.id,
      education: values.education,
      employee: values.employee,
      current_company: values.company,
      current_position: values.position,
      current_experience: values.experience,
      source_of_income: values.income,
      average_income: values.yearly_income,
      net_worth: values.netWorth,
      // plan_to_invest: values.planning,
      investment_objectives: values?.investment_objectivess,
      investment_knowledge: values?.investment_knowledge,
      dob: moment(values.dob).format("YYYY-MM-DD"),
      bank_id: values.bank,
      personal_iban_number: values.IBAN,
      dnaneer_account_no: values.wallet,
      balance: values.balance,
      advisor_id: values.advisor,
      classification_id: values?.classification_id,
      high_level_mission: values.high_level_mission,
      senior_position: values.senior_position,
      marriage_relationship: values.marriage_relationship,
      dnaneer_iban: values.dnaneer_iban === "SA" ? null : values.dnaneer_iban,
    };

    try {
      setLoader(true);
      const { data } = await updateIndividualInvestor(body);
      if (data) {
        console.log("opportunity", data);
        message.success(data.message);
      }
      apiCall();
      setIsModalOpen(false);
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
      setIsModalOpen(false);
    } finally {
      setLoader(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    message.error("Something Went Wrong");
    console.log("Failed:", errorInfo);
  };
  const objectiveOptions= [
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

  const investmentOptions= [
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
  return (
    <div className="add-opportunity-container">
      <h1>Update Individual Investor</h1>
      <Spin spinning={loader}>
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            education: userProfile?.individual?.education,
            employee: userProfile?.individual?.employee,
            company: userProfile?.individual?.current_company,
            position: userProfile?.individual?.current_position,
            experience: userProfile?.individual?.current_experience,
            dob: dayjs(
              JSON.parse(userProfile?.nafath).dateOfBirthG,
              "DD-MM-YYYY"
            ),
            income: userProfile?.individual?.source_of_income,
            yearly_income: userProfile?.individual?.average_income,
            netWorth: userProfile?.individual?.net_worth,
            investment_objectives:
              userProfile?.individual?.investment_objectives,
            investment_knowledge: userProfile?.individual?.investment_knowledge,
            // planning: userProfile?.individual?.plan_to_invest,
            IBAN: userProfile?.accounts?.personal_iban_number ?? "SA",
            bank: userProfile?.accounts?.bank_id,
            wallet: userProfile?.accounts?.dnaneer_account_no,
            balance: userProfile?.accounts?.balance,
            advisor: userProfile?.advisor_id,
            high_level_mission: userProfile?.individual?.high_level_mission,
            senior_position: userProfile?.individual?.senior_position,
            marriage_relationship:
              userProfile?.individual?.marriage_relationship,
            classification_id: userProfile?.classification_id,
            dnaneer_iban: userProfile?.accounts?.dnaneer_iban ?? "SA",
          }}
        >
          <h2>Personal Information</h2>
          <Form.Item
            name="education"
            label="Education"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Education" allowClear>
              <Option value="Postgraduate">Postgraduate </Option>
              <Option value="Undergraduate">Undergraduate </Option>
              <Option value="High school">High school </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="employee"
            label="Are you an employee"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              onChange={handleEmployeeChange}
              placeholder="Select Employment"
              allowClear
            >
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
          {showEmployeeFields && (
            <>
              <Form.Item label="Company" name="company">
                <Input placeholder="Company" />
              </Form.Item>

              <Form.Item label="Current Position" name="position">
                <Input placeholder="Position" />
              </Form.Item>

              <Form.Item name="experience" label="Years of Experience">
                <Select placeholder="Select Experience" allowClear>
                  <Select.Option value="Less than 1 year">
                    Less than 1 year
                  </Select.Option>
                  <Select.Option value="1-5 years">1-5 years</Select.Option>
                  <Select.Option value="More than 5 years">
                    More than 5 years
                  </Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker showToday style={{ width: "100%" }} />
          </Form.Item>
          <h1>General Information</h1>
          <Form.Item
            name="high_level_mission"
            label="Are you assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country?"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Option" allowClear>
              <Option value={1}>yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="senior_position"
            label="Are you in a senior management position or a job in an international organization?"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Option" allowClear>
              <Option value={1}>yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="marriage_relationship"
            label="Do you have a blood or marriage relationship, up to the second degree, with someone who is assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country, or in senior management positions or a job in an international organization?"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Option" allowClear>
              <Option value={1}>yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
          <h1>Financial Information</h1>
          <Form.Item
            name="income"
            label="What is your primary source of income"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Income" allowClear>
              <Option value="Salary">Salary</Option>
              <Option value="Investments income">Investments income</Option>
              <Option value="Personal savings">Personal savings</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="yearly_income"
            label="Yearly income average"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Yearly Income" allowClear>
              <Option value="0-300k SAR ">0-300k SAR</Option>
              <Option value="300k-600k SAR">300k-600k SAR</Option>
              <Option value="600-1M SAR">600-1M SAR</Option>
              <Option value="1M SAR ++">1M SAR ++</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="netWorth"
            label="Net Worth"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Yearly netWorth" allowClear>
              <Option value="5M SAR or less">5M SAR or less</Option>
              <Option value="5M SAR or more">5M SAR or more</Option>
            </Select>
          </Form.Item>
          {/* <Form.Item
            name="planning"
            label="How much you are planning to invest?"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Invest" allowClear>
              <Option value="0-15,000">0 - 15,000</Option>
              <Option value="15,000-50,000">15,000 - 50,000</Option>
              <Option value="50,000-300,000">50,000 - 300,000</Option>
              <Option value="300,000+">300,000+</Option>
            </Select>
          </Form.Item> */}
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
            <Select
              placeholder="What are your general investment objectives?"
              allowClear
              options={objectiveOptions}
            ></Select>
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
            <Select
              placeholder="Do you have any knowledge related to Investments?"
              allowClear
              options={investmentOptions}
            ></Select>
          </Form.Item>
          <h1>Personal Bank Information</h1>
          <Form.Item
            name="IBAN"
            rules={[
              {
                required: true,
                message: "Please enter your IBAN",
              },
              {
                pattern: /^SA\d{22}$/,
                message: "Invalid IBAN number",
              },
            ]}
            getValueFromEvent={IBANInputHandler}
          >
            <Input label="IBAN " maxLength={24} placeholder="IBAN " />
          </Form.Item>
          <Form.Item
            label="Select Bank"
            name="bank"
            rules={[
              {
                // type: "email",
                required: true,
                // message: "Please enter your email",
              },
            ]}
          >
            <Select
              className="drawer-select"
              placeholder="Select Bank"
              label="Select"
            >
              {bankOptions.map((bank, i) => {
                return (
                  <Option key={i} value={bank.value}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={bank.logo}
                        alt={`Logo for ${bank.label}`}
                        style={{
                          width: "40px",
                          height: "15px",
                          marginRight: "8px",
                        }}
                      />
                      {bank.label}
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <h1>Wallet Information</h1>
          <Form.Item
            label="Wallet ID"
            name="wallet"
            rules={[
              {
                required: true,
                message: "Please input your wallet!",
              },
            ]}
          >
            <Input placeholder="wallet" />
          </Form.Item>
          <Form.Item
            label="Balance"
            name="balance"
            rules={[
              {
                required: true,
                message: "Please input your balance!",
              },
            ]}
          >
            <Input placeholder="balance" />
          </Form.Item>
          <Form.Item
            // rules={[
            //   {
            //     pattern: /^SA\d{22}$/,
            //     message: "Invalid IBAN number",
            //   },
            // ]}
            getValueFromEvent={IBANInputHandler}
            label="Dnaneer IBAN"
            name="dnaneer_iban"
          >
            <Input maxLength={24} placeholder="Dnaneer IBAN" />
          </Form.Item>
          <h1>Financial Advisor</h1>
          <Form.Item name="advisor" label="Select Advisor">
            <Select placeholder="Select Advisor" allowClear>
              {advisorsOptions.map((advisor, i) => {
                return (
                  <Option key={i} value={advisor.id}>
                    {advisor.email}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Anti-money laundering and counter-terrorist financing (AML/CFT) risk assessment"
            name="classification_id"
          >
            <Select placeholder="Choose Profile Classification">
              <Option value={1}>Low risk</Option>
              <Option value={2}>Medium risk</Option>
              <Option value={3}>High risk</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loader}
              style={{
                margin: "20px auto 20px auto",
                width: "200px",
                height: "52px",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default AddOpportunityForm;
