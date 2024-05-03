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
  Radio,
} from "antd";

import {
  getBankList,
  updateBorrower,
  updateIndividualInvestor,
} from "../../../../services/ApiHandler";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  IBANInputHandler,
  PhoneNoInputHandler,
} from "../../../../utils/Helper";
import dayjs from "dayjs";
// import FileUpload from "../../Components/FileUpload";
const { Option } = Select;

const UpdateBorrower = ({ setIsModalOpen, userProfile, apiCall }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [bankOptions, setBankOptions] = useState([]);
  const onFinish = async (values) => {
    console.log("Update", values);
    const body = {
      ...values,
      user_id: userProfile?.id,
      dob: dayjs(userProfile?.dob, "YYYY-MM-DD").format("YYYY-MM-DD"),
      company_endorsement: 1,
      high_level_mission: 0,
      senior_position: 0,
      marriage_relationship:0,
    };
    // const body = {
    //   user_id: params.id,
    //   education: values.education,
    //   source_of_income: values.income,
    //   average_income: values.yearly_income,
    //   net_worth: values.netWorth,
    //   dob: moment(values.dob).format("YYYY-MM-DD"),
    //   iban_number: values.IBAN,
    //   wallet_id: values.wallet,
    //   dnaneer_iban: values.dnaneer_iban === "SA" ? null : values.dnaneer_iban,
    // };

    try {
      setLoader(true);
      const { data } = await updateBorrower(body);
      if (data) {
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
  const debtOptions = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 0,
    },
  ];
  const timeOptions = [
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
  useEffect(() => {
    (async () => {
      // const id = params.id;
      try {
        setLoader(true);
        const { data } = await getBankList();
        if (data) {
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
            cr_number: userProfile?.cr_number,
            business_name: userProfile?.business_name,
            position: userProfile?.position,
            legal_type: userProfile?.legal_type,
            dob: dayjs(userProfile?.dob, "YYYY-MM-DD"),
            phone_number: userProfile?.phone_number,
            address: userProfile?.wathq?.address?.general?.address,
            name: userProfile?.name,
            saudi_id_number: userProfile?.saudi_id_number,
            netWorth: userProfile?.individual?.net_worth,
            personal_iban_number: userProfile?.personal_iban_number ?? "SA",
            seeking_amount: userProfile?.seeking_amount,
            repayment_duration: userProfile?.repayment_duration,
            existing_obligations: userProfile?.existing_obligations,
            bank_id: userProfile?.bank_id,
          }}
        >
          <h2>Company Information</h2>
          <Form.Item
            name="cr_number"
            label="Commercial Registration Number"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[1-9][0-9]*$/,
                message: "Only positive integer numbers are allowed!",
              },
            ]}
          >
            <Input placeholder="Enter CR-Number" allowClear />
          </Form.Item>

          <Form.Item
            name="business_name"
            label="Business Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter Business Name"></Input>
          </Form.Item>
          <Form.Item
            name="legal_type"
            label="Legal Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Select Legal Type"></Input>
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter address"></Input>
          </Form.Item>
          <h1>Contact person information</h1>
          <Form.Item
            name="name"
            label="Borrower Name"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[A-Za-z]+$/,
                message: "Please enter alphabets only.",
              },
            ]}
          >
            <Input maxLength={20} placeholder="Enter Borrowers" allowClear />
          </Form.Item>
          <Form.Item
            name="saudi_id_number"
            label="National id"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^\d+$/, // Ensure it contains only digits
                message: "Please enter digits only.",
              },
              {
                min: 10, // Minimum length of 10 digits
                message: "ID Number must be at least 10 digits long.",
              },
              {
                max: 10, // Maximum length of 10 digits
                message: "ID Number cannot exceed 10 digits.",
              },
            ]}
          >
            <Input maxLength={10} placeholder="National id"></Input>
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[A-Za-z]+$/,
                message: "Please enter alphabets only.",
              },
            ]}
          >
            <Input maxLength={20} placeholder="Enter Position" />
          </Form.Item>
          <Form.Item
            name="phone_number"
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
            name="personal_iban_number"
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
            label="Personal IBAN Number"
            getValueFromEvent={IBANInputHandler}
          >
            <Input maxLength={24} placeholder="IBAN " />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise?.resolve();
                  }
                  const dob = new Date(value?.toDate());
                  const today = new Date();
                  let age = today?.getFullYear() - dob?.getFullYear();
                  const monthDiff = today?.getMonth() - dob?.getMonth();

                  if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today?.getDate() < dob?.getDate())
                  ) {
                    age--;
                  }

                  if (age >= 18) {
                    return Promise?.resolve();
                  }

                  return Promise?.reject("You must be at least 18 years old.");
                },
              },
            ]}
          >
            <DatePicker showToday style={{ width: "100%" }} />
          </Form.Item>
          <h1>Fund Request Information</h1>

          <Form.Item>
            <Form.Item
              name="seeking_amount"
              rules={[
                {
                  required: true,
                  message: "Please enter amount",
                },
              ]}
              label="Fund Needed"
            >
              <Select
                placeholder={"Select An Amount"}
                optionFilterProp="children"
                size="large"
              >
                <Option value="0-300k">0-300k</Option>
                <Option value="300k-600k">300k-600k</Option>
                <Option value="600-1M">600-1M</Option>
                <Option value="1M-2M">1M-2M</Option>
                <Option value="2M-4M">2M-4M</Option>
                <Option value="4M-7.5M">4M-7.5M</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="existing_obligations"
              rules={[
                {
                  required: true,
                  message: "Please enter schedule",
                },
              ]}
              label="Existing Obligation"
            >
              <Select>
                {debtOptions?.map((option, i) => (
                  <Option key={i} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="repayment_duration"
              rules={[
                {
                  required: true,
                  message: "Please enter Select Option",
                },
              ]}
              label="Repayment Schedule"
            >
              <Select>
                {timeOptions?.map((option, i) => (
                  <Option key={i} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Select Bank"
              name="bank_id"
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

export default UpdateBorrower;
