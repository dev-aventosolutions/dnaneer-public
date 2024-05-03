import { useEffect, useState } from "react";
import Input from "components/Input/Input";
import {
  Row,
  Col,
  Collapse,
  Form,
  Table,
  Button,
  Select,
  message,
  Spin,
  Divider,
} from "antd";
import { ReactComponent as Expand } from "assets/svgs/Expand.svg";
import DatePicker from "components/DatePicker/DatePicker";
import { ReactComponent as EditIcon } from "assets/svgs/EditIcon.svg";
import dayjs from "dayjs";
import { IBANInputHandler, PhoneNoInputHandler } from "utils/Helper";
import { Option } from "antd/es/mentions";
import { getBankList } from "services/Login";
import { updateBorrower } from "services/BorrowerApis";
import "./Profile.scss";
import { documentHeadings } from "utils/GeneralConstants";
import DocumentsSupport from "pages/Opportunity/Detail/SuppportedDocuments";

const { Panel } = Collapse;
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Date of Birth",
    dataIndex: "birthDate",
    key: "birthDate",
  },
  {
    title: "Identity Number",
    dataIndex: "identity",
    render: (identity) => identity.id,
    key: "identity",
  },
  {
    title: "Relation",
    dataIndex: "relation",
    render: (relation) => relation.name,
    key: "relation",
  },
  {
    title: "Nationality",
    dataIndex: "nationality",
    render: (nationality) => nationality.name,
    key: "nationality",
  },
];
const seekingOptions: { label: string; value: string | number }[] = [
  {
    label: "0-300k",
    value: "0-300k",
  },
  {
    label: "300k-600k",
    value: "300k-600k",
  },
  {
    label: "600k-1M",
    value: "600k-1M",
  },
  {
    label: "1M-2M",
    value: "1M-2M",
  },
  {
    label: "2M-4M",
    value: "2M-4M",
  },
  {
    label: "4M-7.5M",
    value: "4M-7.5M",
  },
];
const durationOptions: { label: string; value: string | number }[] = [
  {
    label: "0 months - 3 months",
    value: "0-3 months",
  },
  {
    label: "3 months - 6 months",
    value: "3 months- 6 months",
  },
  {
    label: "6 months - 1 year",
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

const PersonalInformation = ({ profileDetail, getProfileDetails }) => {
  const [activeKey, setActiveKey] = useState(1);
  const [activeKeyTwo, setActiveKeyTwo] = useState(2);
  const [activeKeyThree, setActiveKeyThree] = useState(3);
  const [activeKeyFour, setActiveKeyFour] = useState(4);
  const [activeKeyFive, setActiveKeyFive] = useState(null);
  const [activeKeySix, setActiveKeySix] = useState(null);
  const [wathqInfo, setWathqInfo] = useState<any>({});
  const [editInfo, setEditInfo] = useState(false);
  const [bankList, setBankList] = useState(null);
  const [tabKey, setTabKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function handleCollapseChange(keys) {
    setActiveKey(keys[0]);
  }
  function handleCollapseChangeTwo(keys) {
    setActiveKeyTwo(keys[0]);
  }
  function handleCollapseChangeThree(keys) {
    setActiveKeyThree(keys[0]);
  }
  function handleCollapseChangeFour(keys) {
    setActiveKeyFour(keys[0]);
  }
  function handleCollapseChangeFive(keys) {
    setActiveKeyFive(keys[0]);
  }
  function handleCollapseChangeSix(keys) {
    setActiveKeySix(keys[0]);
  }
  const onFinish = async (values) => {
    setLoading(true);
    const body = {
      user_id: profileDetail?.id,
      name: values?.name,
      saudi_id_number: values?.saudi_id_number,
      position: values?.position ?? "",
      phone_number: values?.phone_number ?? "",
      dob: values?.dob ? values?.dob.format("YYYY-MM-DD") : null,
      bank_id: values?.bank_id ?? null,
      personal_iban_number: values?.personal_iban_number ?? "",
      seeking_amount: values?.seeking_amount ?? "",
      repayment_duration: values?.repayment_duration ?? "",
      existing_obligations: values?.existing_obligations ?? "",
    };
    try {
      const { data } = await updateBorrower(body);
      if (data) {
        getProfileDetails();
        message.success(data.message);
        setEditInfo(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message ?? "Something went wrong");
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    profileDetail?.wathq && setWathqInfo(JSON.parse(profileDetail?.wathq));
  }, [profileDetail]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBankList();
        if (data) {
          setBankList(data.data);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
      }
    })();
  }, []);

  return (
    <div className="info-panel-container">
      {profileDetail?.borrower && (
        <Spin spinning={loading}>
          <Form
            name="basic"
            className="info-form-container"
            initialValues={{
              // Company Information
              cr_number: profileDetail?.borrower?.cr_number ?? "",
              business_name: profileDetail?.borrower?.business_name ?? "",
              business_activity:
                profileDetail?.borrower?.business_activity ?? "",
              legal_type: profileDetail?.borrower?.legal_type ?? "",
              cr_expiry_date: profileDetail?.borrower?.cr_expiry_date ?? "",
              address: profileDetail?.borrower?.address ?? "",
              // Contact person information
              name: profileDetail?.name ?? "",
              saudi_id_number: profileDetail?.borrower?.saudi_id_number ?? "",
              position: profileDetail?.borrower?.position ?? "",
              phone_number: profileDetail?.borrower?.phone_number ?? "",
              dob: dayjs(profileDetail?.borrower?.dob, "YYYY-MM-DD") ?? "",
              // Banking Information
              bank_id: profileDetail?.accounts?.bank_id,
              personal_iban_number:
                profileDetail?.accounts?.personal_iban_number ?? "SA",
              // Fund Request Information
              seeking_amount: profileDetail?.borrower?.seeking_amount ?? "",
              repayment_duration:
                profileDetail?.borrower?.repayment_duration ?? "",
              existing_obligations:
                profileDetail?.borrower?.existing_obligations ?? "",
            }}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <div
              className="edit-info"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {editInfo ? (
                <div className="profile-btns">
                  <p onClick={() => setEditInfo(false)}>Discard</p>
                  <Button
                    className="profile-save-btn-borrower"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </div>
              ) : tabKey === "1" ? (
                <div>
                  <Button
                    className="profile-edit-btn"
                    icon={<EditIcon />}
                    onClick={() => setEditInfo(true)}
                  >
                    Edit
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="info-panel-container">
              <Collapse
                defaultActiveKey={["1"]}
                // expandIcon={({ isActive }) => }
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKey ? "active" : ""}`}
                onChange={handleCollapseChange}
                accordion
              >
                <Panel
                  header={
                    <span
                      style={{
                        display: "inline-flex",
                        background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        // textFillColor: "transparent",
                      }}
                    >
                      Company Information
                    </span>
                  }
                  key="1"
                >
                  {editInfo ? (
                    <>
                      <Row gutter={[32, 32]}>
                        <Col lg={6} md={6} sm={12}>
                          <Form.Item name="cr_number">
                            <Input
                              label="CR-Number"
                              placeholder="CR-Number"
                              className={"infoInputDisabled"}
                              value={"cr_number"}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <Form.Item name="business_name">
                            <Input
                              label="Business Name"
                              placeholder="Business Name"
                              className={"infoInputDisabled"}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <Form.Item name="business_activity">
                            <Input
                              label="Business Activity"
                              placeholder="Business Activity"
                              disabled
                              className={"infoInputDisabled"}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <Form.Item name="legal_type">
                            <Input
                              label="Legal Type"
                              placeholder="Legal Type"
                              disabled
                              className={"infoInputDisabled"}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={[32, 32]} style={{ marginTop: "-6px" }}>
                        <Col lg={6} sm={12}>
                          <Form.Item name="cr_expiry_date">
                            {/* commented because field is disabled */}
                            {/* <DatePicker
                            block={true}
                            label="Expiray Date"
                            placeholder="Expiray Date"
                            className="drawer-input-one drawer-input-one-date"
                            defaultValue={
                              profileDetail?.borrower?.cr_expiry_date
                                ? dayjs(
                                    profileDetail?.borrower?.cr_expiry_date,
                                    "YYYY-MM-DD"
                                  )
                                : null
                            }
                            onChange={(e) => {
                              form.setFieldsValue({ cr_expiry_date: e });
                            }}
                            disabledDate={(current) => {
                              // Get the current date
                              const today = dayjs();
                              // Disable dates that are after today
                              return current && current > today;
                            }}
                            disabled={true}
                          /> */}
                            <Input
                              label="Expiery Date"
                              placeholder="Expiery Date"
                              disabled
                              className={"infoInputDisabled"}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} sm={12}>
                          <Form.Item name="address">
                            <Input
                              label="Address"
                              placeholder="Address"
                              disabled
                              className={"infoInputDisabled"}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>CR-Number</p>
                          <h1>{profileDetail?.borrower?.cr_number ?? "-"}</h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Business Name</p>
                          <h1>
                            {profileDetail?.borrower?.business_name ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={7} sm={12}>
                          <p>Business Activity</p>
                          <h1>
                            {profileDetail?.borrower?.business_activity ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Legal Type</p>
                          <h1>{profileDetail?.borrower?.legal_type ?? "-"}</h1>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Expiray Date</p>
                          <h1>
                            {profileDetail?.borrower?.cr_expiry_date ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Address</p>
                          <h1>{profileDetail?.borrower?.address ?? "-"}</h1>
                        </Col>
                      </Row>
                    </>
                  )}
                </Panel>
              </Collapse>

              <Collapse
                defaultActiveKey={["2"]}
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKeyTwo ? "active" : ""}`}
                onChange={handleCollapseChangeTwo}
              >
                <Panel
                  header={
                    <span
                      style={{
                        display: "inline-flex",
                        background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        // textFillColor: "transparent",
                      }}
                    >
                      Contact person information
                    </span>
                  }
                  key="2"
                >
                  {editInfo ? (
                    <>
                      <Row gutter={[32, 32]}>
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your name!",
                              },
                              {
                                pattern: /^[A-Za-z]+$/,
                                message: "Please enter alphabets only.",
                              },
                            ]}
                          >
                            <Input
                              label="Name"
                              placeholder="Name"
                              className={"infoInput"}
                              maxLength={20}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="saudi_id_number"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your ID Number!",
                              },
                              {
                                pattern: /^\d+$/, // Ensure it contains only digits
                                message: "Please enter digits only.",
                              },
                              {
                                min: 10, // Minimum length of 10 digits
                                message:
                                  "ID Number must be at least 10 digits long.",
                              },
                              {
                                max: 10, // Maximum length of 10 digits
                                message: "ID Number cannot exceed 10 digits.",
                              },
                            ]}
                          >
                            <Input
                              maxLength={10}
                              label="ID Number"
                              placeholder="ID Number"
                              className={"infoInput"}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="position"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your Position!",
                              },
                              {
                                pattern: /^[A-Za-z]+$/,
                                message: "Please enter alphabets only.",
                              },
                            ]}
                          >
                            <Input
                              maxLength={20}
                              label="Position"
                              placeholder="Position"
                              className={"infoInput"}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} sm={12}>
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
                            <Input
                              label="Phone Number"
                              placeholder="Phone Number"
                              className={"infoInput"}
                              maxLength={13}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={[32, 32]} style={{ marginTop: "-6px" }}>
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="dob"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your Date of Birth",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value) {
                                    return Promise?.resolve();
                                  }
                                  const dob: any = new Date(value?.toDate());
                                  const today: any = new Date();
                                  let age: any =
                                    today?.getFullYear() - dob?.getFullYear();
                                  const monthDiff: any =
                                    today?.getMonth() - dob?.getMonth();

                                  if (
                                    monthDiff < 0 ||
                                    (monthDiff === 0 &&
                                      today?.getDate() < dob?.getDate())
                                  ) {
                                    age--;
                                  }

                                  if (age >= 18) {
                                    return Promise?.resolve();
                                  }

                                  return Promise?.reject(
                                    "You must be at least 18 years old."
                                  );
                                },
                              },
                            ]}
                          >
                            {(profileDetail?.borrower === null ||
                              profileDetail?.borrower?.dob) && (
                              <DatePicker
                                block={true}
                                label="Date of Birth"
                                placeholder="Date of Birth"
                                className="drawer-input-one drawer-input-one-date"
                                defaultValue={
                                  profileDetail?.borrower?.dob
                                    ? dayjs(
                                        profileDetail?.borrower?.dob,
                                        "YYYY-MM-DD"
                                      )
                                    : null
                                }
                                onChange={(e) => {
                                  form.setFieldsValue({ dob: e });
                                }}
                                disabledDate={(current) => {
                                  // Get the current date
                                  const today = dayjs();
                                  // Disable dates that are after today
                                  return current && current > today;
                                }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Name</p>
                          <h1>{profileDetail?.name ?? "-"}</h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>National ID</p>
                          <h1>
                            {profileDetail?.borrower?.saudi_id_number ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Position</p>
                          <h1>{profileDetail?.borrower?.position ?? "-"}</h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Phone Number</p>
                          <h1>
                            {profileDetail?.borrower?.phone_number ?? "-"}
                          </h1>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Date of Birth</p>
                          <h1>{profileDetail?.borrower?.dob ?? "-"}</h1>
                        </Col>
                      </Row>
                    </>
                  )}
                </Panel>
              </Collapse>

              <Collapse
                defaultActiveKey={["4"]}
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKeyFour ? "active" : ""}`}
                onChange={handleCollapseChangeFour}
              >
                <Panel
                  header={
                    <span
                      style={{
                        display: "inline-flex",
                        background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        // textFillColor: "transparent",
                      }}
                    >
                      Fund Request Information
                    </span>
                  }
                  key="4"
                >
                  {editInfo ? (
                    <>
                      <Row gutter={[32, 32]}>
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="seeking_amount"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your Fund needed!",
                              },
                            ]}
                          >
                            <Select
                              defaultValue={
                                profileDetail?.borrower?.seeking_amount ?? ""
                              } // Set the default value here
                              placeholder="Please enter your Fund needed!"
                            >
                              {seekingOptions?.map((item: any, i: number) => (
                                <Select.Option key={i} value={item.value}>
                                  {item.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="repayment_duration"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please enter your Repayment Duration!",
                              },
                            ]}
                          >
                            <Select
                              defaultValue={
                                profileDetail?.borrower?.repayment_duration ??
                                ""
                              } // Set the default value here
                              placeholder="Please enter your Repayment Duration!"
                            >
                              {durationOptions?.map((item: any, i: number) => (
                                <Select.Option key={i} value={item.value}>
                                  {item.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} sm={12}>
                          <Form.Item
                            name="existing_obligations"
                            label="Does the company have any existing debt obligations?"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your Fund needed!",
                              },
                            ]}
                          >
                            <Select
                              defaultValue={
                                profileDetail?.borrower?.existing_obligations ??
                                ""
                              } // Set the default value here
                              placeholder="Does the company have any existing debt obligations?"
                            >
                              {debtOptions?.map((item: any, i: number) => (
                                <Select.Option key={i} value={item.value}>
                                  {item.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Fund needed</p>
                          <h1>
                            {profileDetail?.borrower?.seeking_amount ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={6} sm={12}>
                          <p>Repayment schedule of loan</p>
                          <h1>
                            {profileDetail?.borrower?.repayment_duration ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Existing Debt</p>
                          <h1>
                            {profileDetail?.borrower?.existing_obligations === 1
                              ? "Yes"
                              : "No"}
                          </h1>
                        </Col>
                      </Row>
                    </>
                  )}
                </Panel>
              </Collapse>

              <Collapse
                defaultActiveKey={["3"]}
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKeyThree ? "active" : ""}`}
                onChange={handleCollapseChangeThree}
              >
                <Panel
                  header={
                    <span
                      style={{
                        display: "inline-flex",
                        background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        // textFillColor: "transparent",
                      }}
                    >
                      Banking Information
                    </span>
                  }
                  key="3"
                >
                  {editInfo ? (
                    <>
                      <Row gutter={[32, 32]}>
                        <Col lg={6} sm={12}>
                          <Form.Item name="bank_id">
                            <Select
                              defaultValue={profileDetail?.accounts?.bank_id} // Set the default value here
                              placeholder="Select Bank"
                            >
                              {bankList?.map((bank, i) => {
                                return (
                                  <Option key={i} value={bank.value}>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginTop: "2rem",
                                        gap: "4px",
                                      }}
                                    >
                                      <img
                                        src={bank.logo}
                                        alt={`Logo for ${bank.label}`}
                                        style={{
                                          width: "40px",
                                          height: "15px",
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
                        <Col lg={6} sm={12}>
                          <Form.Item
                            name="personal_iban_number"
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
                              label="IBAN"
                              placeholder="IBAN"
                              className={"infoInput"}
                              maxLength={24}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Bank name</p>
                          <h1>
                            {/* {profileDetail?.accounts?.logo ?? ""} */}
                            {profileDetail?.accounts?.name ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>IBAN</p>
                          <h1>
                            #
                            {profileDetail?.accounts?.personal_iban_number ??
                              "-"}
                          </h1>
                        </Col>
                      </Row>
                    </>
                  )}
                </Panel>
              </Collapse>

              <Collapse
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKeyFive ? "active" : ""}`}
                onChange={handleCollapseChangeFive}
              >
                {wathqInfo ? (
                  <Panel
                    header={
                      <span
                        style={{
                          display: "inline-flex",
                          background:
                            "linear-gradient(270deg, #2b48f4, #34a5ff)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          // textFillColor: "transparent",
                        }}
                      >
                        Wathq Information
                      </span>
                    }
                    key="5"
                  >
                    <>
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>CR-Number</p>
                          <h1>
                            {wathqInfo?.crNumber ? wathqInfo.crNumber : "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>CR-Entity Number</p>
                          <h1>
                            {wathqInfo?.crEntityNumber
                              ? wathqInfo?.crEntityNumber
                              : "-"}
                          </h1>
                        </Col>{" "}
                        <Col lg={5} sm={12}>
                          <p>Status</p>
                          <h1>
                            {wathqInfo?.status?.name
                              ? wathqInfo.status?.name
                              : "-"}
                          </h1>
                        </Col>{" "}
                        <Col lg={5} sm={12}>
                          <p>Address</p>
                          <h1>
                            {wathqInfo?.address?.general?.address
                              ? wathqInfo?.address?.general?.address
                              : "-"}
                          </h1>
                        </Col>
                      </Row>{" "}
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Location</p>
                          <h1>
                            {wathqInfo?.location?.name
                              ? wathqInfo?.location?.name
                              : "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Expiry Date</p>
                          <h1>
                            {wathqInfo?.expiryDate
                              ? wathqInfo?.expiryDate
                              : "-"}
                          </h1>
                        </Col>{" "}
                        <Col lg={5} sm={12}>
                          <p>Paid Amount</p>
                          <h1>
                            {wathqInfo?.capital?.paidAmount
                              ? wathqInfo?.capital?.paidAmount
                              : "-"}
                          </h1>
                        </Col>{" "}
                        <Col lg={5} sm={12}>
                          <p>Subscribed Amount</p>
                          <h1>{wathqInfo?.capital?.subscribedAmount ?? "-"}</h1>
                        </Col>
                      </Row>{" "}
                      <Row>
                        <Col lg={5} sm={12}>
                          <p>Announced Ammount</p>
                          <h1>{wathqInfo?.capital?.announcedAmount ?? "-"}</h1>
                        </Col>{" "}
                        <Col lg={5} sm={12}>
                          <p>Share Price</p>
                          <h1>
                            {wathqInfo?.capital?.share?.sharePrice ?? "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Shares Count</p>
                          <h1>
                            {wathqInfo?.capital?.share
                              ? wathqInfo?.capital?.share?.sharesCount
                              : "-"}
                          </h1>
                        </Col>
                      </Row>
                      <h2
                        style={{
                          // textAlign: "center",
                          marginTop: "30px",
                          background:
                            "linear-gradient(270deg, #2b48f4, #34a5ff)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          marginLeft: "1rem",
                        }}
                      >
                        Parties
                      </h2>
                      <div
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "30px",
                          padding: "10px",
                        }}
                      >
                        <Table
                          columns={columns}
                          dataSource={wathqInfo?.parties}
                          pagination={false}
                        />
                      </div>
                    </>
                  </Panel>
                ) : (
                  <></>
                )}
              </Collapse>
              <Collapse
                expandIcon={({ isActive }) => (
                  <div
                    style={{
                      transform: !isActive ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <Expand />
                  </div>
                )}
                className={`my-collapse ${activeKeySix ? "active" : ""}`}
                onChange={handleCollapseChangeSix}
              >
                <Panel
                  header={
                    <span
                      style={{
                        display: "inline-flex",
                        background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        // textFillColor: "transparent",
                      }}
                    >
                      Supported Documents
                    </span>
                  }
                  key="6"
                >
                  <>
                    {profileDetail?.borrower_documents ? (
                      <>
                        <Divider />

                        <h3>Company Documents</h3>
                        <Row
                          style={{
                            display: "flex",
                            alignItems: "stretch",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            marginTop: 0,
                          }}
                        >
                          {profileDetail?.borrower_documents?.map(
                            (doc) =>
                              documentHeadings.companyDocs?.includes(
                                doc?.type
                              ) && (
                                <Col lg={6} sm={12}>
                                  <DocumentsSupport document={doc} />
                                </Col>
                              )
                          )}
                        </Row>
                        <Divider />
                        <h3>Financial Documents</h3>
                        <Row
                          style={{
                            display: "flex",
                            alignItems: "stretch",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            marginTop: 0,
                          }}
                        >
                          {profileDetail?.borrower_documents?.map(
                            (doc) =>
                              documentHeadings.financialDocs?.includes(
                                doc?.type
                              ) && (
                                <Col lg={6} sm={12}>
                                  <DocumentsSupport document={doc} />
                                </Col>
                              )
                          )}
                        </Row>
                        <Divider />
                        <h3>Bank Information</h3>
                        <Row
                          style={{
                            display: "flex",
                            alignItems: "stretch",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            marginTop: 0,
                          }}
                        >
                          {profileDetail?.borrower_documents?.map(
                            (doc) =>
                              documentHeadings.bankDocs?.includes(
                                doc?.type
                              ) && (
                                <Col lg={6} sm={12}>
                                  <DocumentsSupport document={doc} />
                                </Col>
                              )
                          )}
                        </Row>
                      </>
                    ) : (
                      <p>No document attached</p>
                    )}
                  </>
                </Panel>
              </Collapse>
            </div>
          </Form>
        </Spin>
      )}
    </div>
  );
};

export default PersonalInformation;
