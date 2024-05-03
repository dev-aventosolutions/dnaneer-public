import React, { useState, useEffect, useRef } from "react";
import "./AddOpportunityForm.scss";
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
  InputNumber,
} from "antd";
import {
  createOpportunity,
  opportunityDropDown,
  getCRInfo,
} from "../../services/ApiHandler";
import moment from "moment";
import FileUpload from "../../Components/FileUpload";
import { IBANInputHandler, PhoneNoInputHandler } from "../../utils/Helper";
import dayjs from "dayjs";
import { constantDropdownOptions } from "../../utils/GeneralConstants";
const { Option } = Select;

const AddOpportunityForm = ({ setIsModalOpen, refreshHandler }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [dropData, setDropData] = useState(null);
  const [files, setFiles] = useState([]);
  const [disableFeild, setDisableFeild] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoader(true);
        const { data } = await opportunityDropDown();
        if (data) {
          setDropData(data?.data[0]);
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
    const createDate = dayjs(values.created_at);
    const dueDate = dayjs(values.due_date);

    const currentDate = dayjs(); // Get the current date

    // Calculate the difference between the opportunity creation date and today's date
    const daysDifference = createDate.diff(currentDate, "day");

    if (daysDifference > 2) {
      message.error(
        "Opportunity creation date cannot be after 2 days of today's date"
      );
      return;
    }

    if (dueDate.isBefore(createDate)) {
      message.error("Opportunity due date cannot be before the creation date");
      return;
    }
    const formData = new FormData();
    console.log("values.created_at", createDate.format());
    formData.append("opportunity_number", values.opportunity_number);
    formData.append("industry_id", values.industry_id);
    formData.append("risk_score", values.risk_score);
    formData.append("duration", values.duration);
    formData.append("financing_structure_id", values.financing_structure_id);
    formData.append("financing_type_id", values.financing_type_id);
    formData.append("annual_roi", values.annual_roi);
    formData.append("net_roi", values.net_roi);
    formData.append(
      "custom_created_at",
      createDate.format("YYYY-MM-DDTHH:mm:ssZ[Z]")
    );
    formData.append("due_date", dueDate.format("YYYY-MM-DD"));
    formData.append("repayment_period", values.repayment_period);
    formData.append("distributed_returns", values.distributed_returns);
    formData.append("fund_needed", values.fund_needed);
    formData.append("fund_collected", values.fund_collected);
    formData.append("cr_number", values.cr_number);
    formData.append("company_name", values.company_name);
    formData.append(
      "establishment_date",
      dayjs(values.establishment_date, "YYYY-MM-DD").format("YYYY-MM-DD")
    );
    formData.append("company_location", values.company_address);
    formData.append("company_legal_structure", values.legal_structure);
    formData.append("opportunity_status", values.opportunity_status);
    formData.append("annual_revenue", values.annual_revenue);
    formData.append("location_id", values.location_id);
    formData.append("iban", values.iban);
    formData.append("bank_id", values.bank_id);
    if (values.borrower_request_id !== "manually")
      formData.append("borrower_request_id", values.borrower_request_id);
    formData.append("contact_name", values.contact_name);
    formData.append("contact_email", values.contact_email);
    formData.append("contact_phone_number", values.contact_phone_number);

    // Append files
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const actualFile = file.originFileObj;
      formData.append(
        "files[]",
        actualFile,
        actualFile.name || `file_${index}`
      );
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      setLoader(true);
      const { data } = await createOpportunity(formData);
      if (data) {
        refreshHandler();
        message.success("Opportunity Created!");
        setIsModalOpen(false);
        form.resetFields();
        setFiles([]);
      }
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };
  const onFinishFailed = async (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const crInfoHandler = async () => {
    const fieldValue = form.getFieldValue("cr_number");
    if (fieldValue) {
      const body = {
        cr_number: fieldValue,
      };
      try {
        setLoader(true);
        const { data } = await getCRInfo(body);
        if (data) {
          form.setFieldsValue({
            company_name: `${data?.data?.company_name}`,
          });
          form.setFieldsValue({
            company_address: `${data?.data?.address}`,
          });
          form.setFieldsValue({
            legal_structure: `${data?.data?.legal_structure}`,
          });
          form.setFieldsValue({
            establishment_date: dayjs(
              data?.data?.establishment_date,
              "YYYY-MM-DD"
            ),
          });
          // setFormInitialValue({
          //   cr_number: data.data.cr_number,
          //   company_name: data.data.company_name,
          //   company_address: data.data.address,
          // });
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    } else {
      message.error("Please enter registration Number");
    }
  };
  const borrowerValue = (e) => {
    if (e == "manually") {
      setDisableFeild(false);
      form.setFieldsValue({
        contact_name: "",
      });
      form.setFieldsValue({
        contact_email: "",
      });
      form.setFieldsValue({
        contact_phone_number: "+966",
      });
    } else {
      setDisableFeild(true);
      const filteredObjects = dropData?.borrower_request.filter(
        (obj) => obj.id == e
      );
      form.setFieldsValue({
        contact_name: filteredObjects[0]?.name
          ? `${filteredObjects[0]?.name}`
          : "",
      });
      form.setFieldsValue({
        contact_email: filteredObjects[0]?.email
          ? `${filteredObjects[0]?.email}`
          : "",
      });
      form.setFieldsValue({
        contact_phone_number: filteredObjects[0]?.phone_number
          ? `${filteredObjects[0]?.phone_number}`
          : "",
      });
      form.setFieldsValue({
        cr_number: filteredObjects[0]?.cr_number
          ? `${filteredObjects[0]?.cr_number}`
          : "",
      });
      crInfoHandler();
    }
  };
  return (
    <div className="add-opportunity-container">
      <h1>Add Opportunity</h1>
      <Spin spinning={loader}>
        {dropData && (
          <Form
            name="basic"
            form={form}
            autoComplete="off"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              fund_collected: 0,
              distributed_returns: 0,
              iban: "SA",
              contact_phone_number: "+966",
            }}
          >
            <h2>Basic Information</h2>
            <Form.Item
              label="Opportunity number"
              name="opportunity_number"
              rules={[
                {
                  required: true,
                  message: "Please input your Opportunity number!",
                },
                {
                  pattern: /^[1-9]\d*$/,
                  message:
                    "Opportunity number cannot start with 0 or be a negative number!",
                },
              ]}
            >
              {/* <FloatLabel label="Opportunity" name="Opportunity"> */}
              <Input style={{ width: "100%" }} />
              {/* </FloatLabel> */}
            </Form.Item>
            <Form.Item
              name="industry_id"
              label="Industry"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select an industry" allowClear>
                {dropData.industries.map((industry, i) => {
                  return (
                    <Option value={industry.id} key={i}>
                      {industry.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="risk_score"
              label="Risk Score"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a Risk Score"
                options={constantDropdownOptions.riskScoreOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a Duration "
                options={constantDropdownOptions.durationOptions}
                allowClear
              />
            </Form.Item>
            <h2>Financing Details</h2>
            <Form.Item
              name="financing_structure_id"
              label="Financing Structure"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select a Financing Structure" allowClear>
                {dropData.financing_structure.map((finance, i) => {
                  return (
                    <Option value={finance.id} key={i}>
                      {finance.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="financing_type_id"
              label="Financing Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select a financing type" allowClear>
                {dropData.financing_type.map((finance, i) => {
                  return (
                    <Option value={finance.id} key={i}>
                      {finance.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Annual ROI %"
              name="annual_roi"
              rules={[
                {
                  required: true,
                  message: "Please input your ROI!",
                },
                {
                  pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/,
                  message: "Enter a valid number",
                },
              ]}
            >
              {/* <FloatLabel label="Annual ROI" name="Annual ROI"> */}
              <Input style={{ width: "100%" }} min={0.1} step={0.1} />
              {/* </FloatLabel> */}
            </Form.Item>
            <Form.Item
              label="Net ROI %"
              name="net_roi"
              rules={[
                {
                  required: true,
                  message: "Please input your Net ROI!",
                },
                {
                  pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/,
                  message: "Enter a valid number",
                },
                // ({ getFieldValue }) => ({
                //   validator(_, value) {
                //     if (
                //       !value ||
                //       parseFloat(value) <
                //         parseFloat(getFieldValue("annual_roi"))
                //     ) {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject(
                //       "Net ROI should be less than the Annual ROI"
                //     );
                //   },
                // }),
              ]}
            >
              {/* <FloatLabel label="Annual ROI" name="Annual ROI"> */}
              <Input style={{ width: "100%" }} min={0.1} step={0.1} />
              {/* </FloatLabel> */}
            </Form.Item>
            <Form.Item
              name="created_at"
              label="Opportunity Creation Date"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker
                showToday
                showTime
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current > dayjs().add(2, "days").endOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="due_date"
              label="Due Date"
              rules={[
                {
                  required: true,
                },
              ]}
              dependencies={["created_at"]}
            >
              <DatePicker
                showToday
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current < form.getFieldValue("created_at")
                }
              />
            </Form.Item>
            <Form.Item
              name="repayment_period"
              label="Repayment Frequency"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select Income"
                options={constantDropdownOptions.incomeOptions}
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="Distributed Returns (SAR)"
              name="distributed_returns"
              rules={[
                {
                  pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/,
                  message: "Enter a valid number",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Funds Needed (SAR)"
              name="fund_needed"
              rules={[
                {
                  required: true,
                  message: "Please input your Needed Amount!",
                },
                {
                  pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/,
                  message: "Enter a valid number",
                },
              ]}
            >
              {/* <FloatLabel label="Funding Amount" name="Funding Amount"> */}
              <Input style={{ width: "100%" }} min={1} />
              {/* </FloatLabel> */}
            </Form.Item>
            <Form.Item
              label="Funds Collected (SAR)"
              name="fund_collected"
              rules={[
                {
                  required: true,
                  message: "Please input your Needed Amount!",
                },
                {
                  pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/,
                  message: "Enter a valid number",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            {/*  */}

            <h2>Borrower</h2>
            <Form.Item
              name="borrower_request_id"
              label="Borrower Listing"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select borrower listing"
                onChange={(e) => borrowerValue(e)}
              >
                <Option value={"manually"}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {"Add manually"}
                  </div>
                </Option>
                {dropData?.borrower_request?.map((borrower, i) => {
                  return (
                    <Option value={borrower?.id} key={i}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {borrower?.cr_number}
                        {" - "}
                        {borrower?.business_name}
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Row gutter={[32, 32]}>
              <Col lg={12}>
                <Form.Item
                  label="Name"
                  name="contact_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                    {
                      pattern: /^[A-Za-z ]+$/,
                      message: "Only alphabets are allowed in the name field!",
                    },
                  ]}
                >
                  <Input disabled={disableFeild} />
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  name="contact_email"
                  label="Email"
                  rules={[
                    {
                      type: "email",
                      required: true,
                    },
                  ]}
                >
                  <Input disabled={disableFeild} />
                </Form.Item>
              </Col>
            </Row>

            <Col lg={12}>
              <Form.Item
                label="Phone Number"
                name="contact_phone_number"
                phone
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                  {
                    pattern: /^\+9665\d{8}$/,
                    message:
                      "Phone number must start with '+9665' and be followed by 8 digits.",
                  },
                ]}
                getValueFromEvent={PhoneNoInputHandler}
              >
                <Input maxLength={13} disabled={disableFeild} />
              </Form.Item>
            </Col>
            {/*  */}
            <h2>Company Details</h2>
            <Row gutter={[32, 32]}>
              <Col lg={19}>
                <Form.Item
                  label="Commercial Registration Number"
                  name="cr_number"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please input your Commercial registration number!",
                    },
                    {
                      pattern: /^[1-9][0-9]*$/,
                      message: "Only positive integer numbers are allowed!",
                    },
                  ]}
                >
                  <Input maxLength={10} disabled={disableFeild} />
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Button
                  style={{
                    position: "absolute",
                    top: "29px",
                    right: "0",
                    height: "inherit",
                  }}
                  onClick={crInfoHandler}
                >
                  Check
                </Button>
              </Col>
            </Row>

            <Row gutter={[32, 32]}>
              <Col lg={12}>
                <Form.Item
                  label="Company Name"
                  name="company_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Company Name!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item name="establishment_date" label="Establishment Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Due Date"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[32, 32]}>
              <Col lg={12}>
                <Form.Item
                  label="Company Address"
                  name="company_address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Company Address!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  name="legal_structure"
                  label="Company Legal Structure"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="annual_revenue"
              label="Annual Revenue"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select Annual Revenue"
                options={constantDropdownOptions.annualRevenueOptions}
              />
            </Form.Item>
            <Form.Item
              name="location_id"
              label="Location"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select a Location" allowClear>
                {dropData.cities.map((cities, i) => {
                  return (
                    <Option value={cities.id} key={i}>
                      {cities.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <h2>Bank Information</h2>
            <Row gutter={[32, 32]}>
              <Col lg={12}>
                <Form.Item
                  label="IBAN"
                  name="iban"
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
                  <Input maxLength={24} />
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  name="bank_id"
                  label="Bank Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select Bank">
                    {dropData.bank_list.map((bank, i) => {
                      return (
                        <Option value={bank.id} key={i}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={bank?.logo}
                              alt={`Logo for ${bank?.id}`}
                              style={{
                                width: "40px",
                                height: "15px",
                                marginRight: "8px",
                              }}
                            />
                            {bank.name}
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <h2>Status</h2>
            <Form.Item
              name="opportunity_status"
              label="Opportunity Status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Opportunity Status"
                options={constantDropdownOptions.opportunityStatusOptions}
              />
            </Form.Item>

            {/* <h2>Classification</h2>
            <Row gutter={[32, 32]}>
              <Col lg={12}>
                <Form.Item
                  label="Anti-money laundering and counter-terrorist financing (AML/CFT) risk assessment"
                  name="borrower_contact"
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                >
                  <Select placeholder="Choose Profile Classification">
                    <Option value="Low risk">Low risk</Option>
                    <Option value="Medium risk">Medium risk</Option>
                    <Option value="High risk">High risk</Option>{" "}
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
            <FileUpload setFiles={setFiles} files={files} />
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
        )}
      </Spin>
    </div>
  );
};

export default AddOpportunityForm;
