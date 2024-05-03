import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

import moment from "moment";

import {
  getBankList,
  getAdvisorsList,
  updateInstitutionalInvestor,
} from "../../../../services/ApiHandler";
import {
  IBANInputHandler,
  PhoneNoInputHandler,
} from "../../../../utils/Helper";
import dayjs from "dayjs";
const { Option } = Select;

const AddOpportunityForm = ({ setIsModalOpen, userProfile, apiCall }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [bankOptions, setBankOptions] = useState([]);
  const [advisorsOptions, setAdvisorsOptions] = useState([]);
  const params = useParams();
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
      investor_name: values.name,
      id_number: values.id_number,
      position: values.position,
      phone_number: values.phone,
      dob: dayjs(values.dob, "YYYY-MM-DD").format("YYYY-MM-DD"),
      source_of_income: values.source_of_income,
      annual_revenue: values.annual_revenue,
      annual_investment_amount: values.annual_investment_amount,
      bank_id: values.bank,
      personal_iban_number: values.IBAN,
      dnaneer_account_no: values.wallet,
      balance: values.balance,
      advisor_id: values.advisor_id,
      classification_id: values.classification_id,
      high_level_mission: values.high_level_mission,
      senior_position: values.senior_position,
      marriage_relationship: values.marriage_relationship,
      dnaneer_iban: values.dnaneer_iban === "SA" ? null : values.dnaneer_iban,
    };

    try {
      setLoader(true);
      const { data } = await updateInstitutionalInvestor(body);
      if (data) {
        console.log("updateInstitutionalInvestor", data);
        message.success(data.message);
        setIsModalOpen(false);
        apiCall();
      }
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
  const approxyOptions= [
  {
    label: "0-500k",
    value: "0-500k",
  },
  {
    label: "500k-6.5m",
    value: "500k-6.5m",
  },
  {
    label: "6.5m-35m",
    value: "6.5m-35m",
  },
  {
    label: "35m+",
    value: "35m+",
  },
];

  useEffect(() => {
    console.log({ ...userProfile, wathq: JSON.parse(userProfile?.wathq) });
  }, [userProfile]);
  return (
    <div className="add-opportunity-container">
      <h1>Update Institutional Investor</h1>
      <Spin spinning={loader}>
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            name: userProfile?.institutional?.investor_name,
            id_number: userProfile?.institutional.id_number,
            position: userProfile?.institutional?.position,
            phone: userProfile?.phone_number,
            dob: userProfile?.institutional?.date_of_birth
              ? dayjs(userProfile?.institutional?.date_of_birth, "YYYY-MM-DD")
              : dayjs(),
            source_of_income: userProfile?.institutional?.source_of_income,
            annual_revenue: userProfile?.institutional?.annual_revenue,
            annual_investment_amount:
              userProfile?.institutional?.annual_investment_amount,
            bank: userProfile?.accounts?.bank_id,
            IBAN: userProfile?.accounts?.personal_iban_number ?? "SA",
            wallet: userProfile?.accounts?.dnaneer_account_no,
            balance: userProfile?.accounts?.balance,
            advisor_id: userProfile?.advisor_id,
            classification_id: userProfile?.classification_id,
            high_level_mission: userProfile?.institutional?.high_level_mission,
            senior_position: userProfile?.institutional?.senior_position,
            marriage_relationship:
              userProfile?.institutional?.marriage_relationship,
            dnaneer_iban: userProfile?.accounts?.dnaneer_iban,
          }}
        >
          <h2>Investments Manager (contact person)</h2>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter your Name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="id_number"
            label="Saudi Id"
            rules={[
              {
                required: true,
                message: "Please enter your Saudi Id No",
              },
            ]}
          >
            <Input placeholder="Saudi Id" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Position/Role"
            rules={[
              {
                required: true,
                message: "Please enter your Position",
              },
            ]}
          >
            <Input placeholder="Position" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please enter your Phone No",
              },
              {
                pattern: /^\+9665\d{8}$/,
                message:
                  "Phone number must start with '+9665' and be followed by 8 digits.",
              },
            ]}
            getValueFromEvent={PhoneNoInputHandler}
          >
            <Input maxLength={13} placeholder="Phone" />
          </Form.Item>
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
            name="source_of_income"
            label="Source of Income"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Income" allowClear>
              <Option value="investments">Investments</Option>
              <Option value="business_income">Business Income</Option>
              <Option value="Rental Income">Rental Income</Option>
              <Option value="others">others</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="annual_revenue"
            label="Approximately Annual Company Revenue (SAR)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Income" allowClear>
              <Option value="0-20m">0-20m</Option>
              <Option value="20m-50m">20m-50m</Option>
              <Option value="50m-200m">50m-200m</Option>
              <Option value="200m+">200m+</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bank"
            label="Select Bank"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Bank" allowClear>
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
          <Form.Item
            name="IBAN"
            label="Personal IBAN"
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
            <Input
              label="Personal IBAN Number"
              maxLength={24}
              placeholder="Personal IBAN"
            />
          </Form.Item>
          <Form.Item
            name="annual_investment_amount"
            label="Approximate of annual investments amount (SAR)"
          >
            <Select
              placeholder="Select annual investments amount"
              allowClear
              options={approxyOptions}
            />
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

          <Form.Item name="advisor_id" label="Select Advisor">
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
