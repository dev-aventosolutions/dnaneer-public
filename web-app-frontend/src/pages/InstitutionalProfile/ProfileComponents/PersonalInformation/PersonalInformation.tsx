import { useEffect, useState } from "react";
import Input from "components/Input/Input";
import {
  Row,
  Col,
  Collapse,
  Form,
  message,
  Button,
  Select,
  Modal,
  Table,
  Divider,
} from "antd";
import { ReactComponent as Expand } from "assets/svgs/Expand.svg";
import "./info.scss";
import "../../Profile.scss";
import {
  generateUnifonicOTP,
  getBankList,
  updateProfileIns,
} from "services/Login";
import { ReactComponent as EditIcon } from "assets/svgs/EditIcon.svg";
import FloatSelect from "components/Select/Select";
import { Option } from "antd/es/mentions";
import OtpForProfile from "pages/Login/OtpForProfile/OtpForProfile";
import RadioGroup from "components/RadioGroup/RadioGroup";
import { IBANInputHandler, PhoneNoInputHandler } from "utils/Helper";
import AppTable from "components/Table/Table";
import { generalOptions } from "pages/IndividualProfile/ProfileComponents/PersonalInformation/PersonalInformation";
import { approxyOptions } from "components/InstitutionalForms/StepTwo";

const { Panel } = Collapse;
const PHONE_REGEX = /^((?:[+?0?0?966]+)(?:\s?\d{2})(?:\s?\d{7}))$/;

const PersonalInformation = ({ userProfile, setUpdate, update }: any) => {
  const [editInfo, setEditInfo] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState(1);
  const [activeKeyOne, setActiveKeyOne] = useState(null);
  const [activeKeyTwo, setActiveKeyTwo] = useState(null);
  const [activeKeyThree, setActiveKeyThree] = useState(null);
  const [activeKeyFour, setActiveKeyFour] = useState(null);
  const [activeKeyFive, setActiveKeyFive] = useState(null);
  const [activeKeySix, setActiveKeySix] = useState(null);
  const [bankList, setBankList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [time, setTime] = useState<number>(60);
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [wathqInfo, setWathqInfo] = useState({
    crNumber: "",
    status: { name: "" },
    address: { general: { address: "" } },
    location: {
      name: "",
    },
    capital: {
      share: {
        sharePrice: 0,
        sharesCount: 0,
      },
      paidAmount: 0,
      announcedAmount: 0,
      subscribedAmount: 0,
    },
    expiryDate: "",
    crEntityNumber: 0,
    parties: [
      {
        name: "",
        identity: {
          id: "",
          type: "",
        },
        relation: {
          id: 0,
          name: "",
        },
        birthDate: "",
        nationality: {
          id: "",
          name: "",
        },
      },
    ],
  });
  const [nafathInfo, setNafathInfo] = useState({});

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

  const incomeOptions: { label: string; value: string | number }[] = [
    {
      label: "Investments",
      value: "investments",
    },
    {
      label: "Business Income",
      value: "business_income",
    },
    {
      label: "Rental Income",
      value: "Rental Income",
    },
    {
      label: "others",
      value: "others",
    },
  ];

  const anualOptions: { label: string; value: string | number }[] = [
    {
      label: "0-20m",
      value: "0-20m",
    },
    {
      label: "20m-50m",
      value: "20m-50m",
    },
    {
      label: "50m -200m",
      value: "50m -200m",
    },
    {
      label: "200m+",
      value: "200m+",
    },
  ];

  function handleCollapseChange(keys: any) {
    setActiveKey(keys[0]);
  }

  function handleCollapseChangeOne(keys: any) {
    setActiveKeyOne(keys[0]);
  }

  function handleCollapseChangeTwo(keys: any) {
    setActiveKeyTwo(keys[0]);
  }

  function handleCollapseChangeThree(keys: any) {
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBankList();
        if (data) {
          setBankList(data.data);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      }
    })();
    setWathqInfo(JSON.parse(userProfile?.wathq));
  }, [userProfile]);

  const onFinish = async (values: any) => {
    try {
      const {
        CRNumber,
        companyName,
        establishmentDate,
        companyAddress,
        companyLegalStructure,
        ...updatedValues
      } = values;
      updatedValues.user_id = userProfile?.id;
      updatedValues.personal_iban_number = updatedValues.personal_iban_number
        ? updatedValues.personal_iban_number
        : userProfile?.accounts?.personal_iban_number;
      updatedValues.bank_id = updatedValues.bank_id
        ? updatedValues.bank_id
        : userProfile?.accounts?.bank_id;
      setProfileData(updatedValues);
      await sentOtp();
      setIsModalOpen(true);
    } catch (error) {
      console.log("err", error);
    }
  };

  const updateProfile = async () => {
    try {
      if (profileData) {
        const { data } = await updateProfileIns(profileData);
        if (data) {
          setUpdate(!update);
          setEditInfo(false);
          message.success(data.message);
          setTime(60);
          setOtp("");
        }
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    }
  };

  const sentOtp = async () => {
    try {
      setLoading(true);
      const body = {
        phone_number: userProfile?.phone_number,
      };
      const res = await generateUnifonicOTP(body);
      if (res) {
        setOtp("");
        setTime(60);
        setLoading(false);
        message.success("OTP Sent Successfully!");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.message);
      throw new Error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOk = () => {};
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let timer;
    if (time > 0) {
      timer = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [time]);

  const handleDiscard = () => {
    setTime(0);
    setEditInfo(false);
  };

  return (
    <div className="info-panel-container">
      {/* {check == "otp" && <OtpForProfile 
      setCheck={setCheck}
      user={userProfile}

      />} */}
      <Modal
        centered
        className="logout-modal"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        maskClosable={false}
      >
        <OtpForProfile
          loading={loading}
          setIsModalOpen={setIsModalOpen}
          user={userProfile}
          updateProfile={updateProfile}
          sentOtp={sentOtp}
          setTime={setTime}
          setOtp={setOtp}
          time={time}
          otp={otp}
        />
      </Modal>
      <Form
        name="basic"
        className="info-form-container"
        initialValues={{
          user_id: userProfile?._id,
          CRNumber: userProfile?.institutional?.registration_number ?? "-",
          companyName: userProfile?.institutional?.company_name ?? "-",
          establishmentDate:
            userProfile?.institutional?.establishment_date ?? "-",
          companyAddress: userProfile?.institutional?.address ?? "-",
          companyLegalStructure:
            userProfile?.institutional?.legal_structure ?? "-",

          bank: userProfile?.accounts?.bank,
          personal_iban_number:
            userProfile?.accounts?.personal_iban_number ?? "SA",
          bank_id: userProfile?.accounts?.bank_id,

          source_of_income: userProfile?.institutional?.source_of_income,
          annual_revenue: userProfile?.institutional?.annual_revenue,
          annual_investment_amount:
            userProfile?.institutional?.annual_investment_amount,
          investor_name: userProfile?.institutional?.investor_name,
          position: userProfile?.institutional?.position,
          id_number: userProfile?.institutional?.id_number,
          phone_number: userProfile?.phone_number,
          dob: userProfile?.dob,

          high_level_mission: userProfile?.institutional?.high_level_mission,
          senior_position: userProfile?.institutional?.senior_position,
          marriage_relationship:
            userProfile?.institutional?.marriage_relationship,

          wallet_id: userProfile?.accounts?.dnaneer_account_no,
          balance: userProfile?.accounts?.balance,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
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
              <p onClick={() => handleDiscard()}>Discard</p>
              <Button className="profile-save-btn" htmlType="submit">
                Save
              </Button>
            </div>
          ) : (
            <div>
              <Button
                className="profile-edit-btn"
                icon={<EditIcon />}
                onClick={() => setEditInfo(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <Collapse
          // defaultActiveKey={["1"]}
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
          className={`my-collapse ${activeKeyOne ? "active" : ""}`}
          onChange={handleCollapseChangeOne}
          accordion
        >
          <Panel
            header={
              <span
                style={{
                  background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
                  display: "inline-flex",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  // textFillColor: "transparent",
                }}
              >
                Company Information
              </span>
            }
            key="4"
          >
            {editInfo ? (
              <>
                <Row gutter={[32, 32]}>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="CRNumber"
                      rules={[
                        {
                          message: "Please enter your CRNumber!",
                        },
                      ]}
                    >
                      <Input
                        label="CR Number"
                        placeholder="CR Number"
                        className={"infoInput"}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="companyName"
                      rules={[
                        {
                          message: "Please enter your company Nname!",
                        },
                      ]}
                    >
                      <Input
                        label="Company Name"
                        placeholder="Company Name"
                        className={"infoInput"}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="establishmentDate"
                      rules={[
                        {
                          message: "Please enter your Establishment Date!",
                        },
                      ]}
                    >
                      <Input
                        label="Establishment Date"
                        placeholder="Establishment Date"
                        className={"infoInput"}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="companyAddress"
                      rules={[
                        {
                          message: "Please enter your Company Address!",
                        },
                      ]}
                    >
                      <Input
                        label="Company Address"
                        placeholder="Company Address"
                        className={"infoInput"}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ marginTop: "-6px" }}>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="companyLegalStructure"
                      rules={[
                        {
                          message: "Please enter your Company Legal Structure!",
                        },
                      ]}
                    >
                      <Input
                        label="Company Legal Structure"
                        placeholder="Company Legal Structure"
                        className={"infoInput"}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>CR Number</p>
                    <h1>
                      {userProfile?.institutional?.registration_number ?? "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Company Name</p>
                    <h1>{userProfile?.institutional?.company_name ?? "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Establishment Date</p>
                    <h1>
                      {userProfile?.institutional?.establishment_date ?? "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Company Address</p>
                    <h1>{userProfile?.institutional?.address ?? "-"}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Company Legal Structure </p>
                    <h1>
                      {userProfile?.institutional?.legal_structure ?? "-"}
                    </h1>
                  </Col>
                </Row>
              </>
            )}
          </Panel>
        </Collapse>
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
                Personal Information
              </span>
            }
            key="1"
          >
            {editInfo ? (
              <>
                <Row gutter={[32, 32]}>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="investor_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your name!",
                        },
                      ]}
                    >
                      <Input
                        label="Name"
                        placeholder="Name"
                        className={"infoInput"}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="id_number"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your valid national Id!",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        label="National ID Number"
                        placeholder="National Id"
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
                      ]}
                    >
                      <Input
                        label="Position"
                        placeholder="Position"
                        className={"infoInput"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ marginTop: "-6px" }}>
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
                        label="Phone"
                        placeholder="Phone"
                        className={"infoInput"}
                        maxLength={13}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="dob"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Date of birth",
                        },
                        // {
                        //   validator: (_, value) => {
                        //     if (!value) {
                        //       return Promise.resolve();
                        //     }

                        //     const dob = new Date(value.toDate());
                        //     const today = new Date();
                        //     let age = today.getFullYear() - dob.getFullYear();
                        //     const monthDiff = today.getMonth() - dob.getMonth();

                        //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                        //       age--;
                        //     }

                        //     if (age >= 18) {
                        //       return Promise.resolve();
                        //     }

                        //     return Promise.reject(new Error('You must be at least 18 years old.'));
                        //   },
                        // },
                      ]}
                    >
                      <Input
                        label="Date of birth"
                        placeholder="Date of birth"
                        className={"infoInput"}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div>
                  <Divider />
                  <Form.Item
                    name="high_level_mission"
                    label="Are you assigned to
                    high-level missions in the Kingdom of Saudi Arabia or in a foreign
                    country?"
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={
                        userProfile?.institutional?.high_level_mission
                      }
                      placeholder="High Level Mission"
                      options={generalOptions}
                      style={{ maxWidth: "20rem" }}
                    />
                  </Form.Item>
                  <Divider />
                  <Form.Item
                    name="senior_position"
                    label="Are you in a senior
                     management position or a job in an international organization?"
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={userProfile?.institutional?.senior_position}
                      placeholder="senior position"
                      options={generalOptions}
                      style={{ maxWidth: "20rem" }}
                    />
                  </Form.Item>
                  <Divider />
                  <Form.Item
                    name="marriage_relationship"
                    label="Do you have a blood or marriage relationship, up to 
                    the second degree, with someone who
                    is assigned to high-level missions in the Kingdom of Saudi Arabia
                    or in a foreign country, or in senior management positions or a
                    job in an international organization?"
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                    style={{ maxWidth: "50rem" }}
                  >
                    <Select
                      defaultValue={
                        userProfile?.institutional?.marriage_relationship
                      }
                      placeholder="marriage relationship"
                      options={generalOptions}
                      style={{ maxWidth: "20rem" }}
                    />
                  </Form.Item>
                </div>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Name</p>
                    <h1>{userProfile?.institutional?.investor_name ?? "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>National Id</p>
                    <h1>{userProfile?.institutional?.id_number ?? "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Position</p>
                    <h1>{userProfile?.institutional?.position ?? "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Phone</p>
                    <h1>{userProfile?.phone_number ?? "-"}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Date of Birthday</p>
                    <h1>{userProfile?.dob ?? "-"}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Address</p>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <h1>City: </h1>
                      <p>{userProfile?.nafath?.nationalAddress?.[0]?.city}</p>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <h1>District: </h1>
                      <p>
                        {userProfile?.nafath?.nationalAddress?.[0]?.district}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <h1>Street Name: </h1>
                      <p>
                        {userProfile?.nafath?.nationalAddress?.[0]?.streetName}
                      </p>
                    </div>
                  </Col>
                </Row>
                <>
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: 25,
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>
                      Are you assigned to high-level missions in the Kingdom of
                      Saudi Arabia or in a foreign country?
                    </p>
                    <h1 style={{ marginRight: "5rem" }}>
                      {userProfile?.institutional?.high_level_mission
                        ? "Yes"
                        : "No"}
                    </h1>
                  </div>
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: 25,
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>
                      Are you in a senior management position or a job in an
                      international organization?
                    </p>
                    <h1 style={{ marginRight: "5rem" }}>
                      {userProfile?.institutional?.senior_position
                        ? "Yes"
                        : "No"}
                    </h1>
                  </div>
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <p style={{ maxWidth: "50rem", marginBottom: 0 }}>
                      Do you have a blood or marriage relationship, up to the
                      second degree, with someone who is assigned to high-level
                      missions in the Kingdom of Saudi Arabia or in a foreign
                      country, or in senior management positions or a job in an
                      international organization?
                    </p>
                    <h1 style={{ marginRight: "5rem" }}>
                      {userProfile?.institutional?.marriage_relationship
                        ? "Yes"
                        : "No"}
                    </h1>
                  </div>
                </>
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
          className={`my-collapse-two ${activeKeyTwo ? "active" : ""}`}
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
                Financial Information
              </span>
            }
            key="2"
          >
            {editInfo ? (
              <>
                <Row gutter={[32, 32]}>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="source_of_income"
                      label="Source of income"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Source of income!",
                        },
                      ]}
                    >
                      {/* <RadioGroup
                        defaultValue={
                          userProfile?.institutional?.source_of_income
                        }
                        options={incomeOptions}
                      /> */}
                      <Select
                        defaultValue={
                          userProfile?.institutional?.source_of_income
                        } // Set the default value here
                        placeholder="Please enter your Source of income!"
                      >
                        {incomeOptions?.map((item: any, i: number) => (
                          <Select.Option key={i} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                      {/* <Input
                        label="Source of income"
                        placeholder="Source of income"
                        className={"infoInput"}
                      /> */}
                    </Form.Item>
                  </Col>
                  <Col lg={6} sm={12}>
                    <Form.Item
                      name="annual_revenue"
                      label="Annual Revenue"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Annual Revenue!",
                        },
                      ]}
                    >
                      <Select
                        defaultValue={
                          userProfile?.institutional?.annual_revenue
                        } // Set the default value here
                        placeholder="Please enter your Annual Revenue!"
                      >
                        {anualOptions?.map((item: any, i: number) => (
                          <Select.Option key={i} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                      {/* <Input
                        type="number"
                        label="Annual Revenue"
                        placeholder="Annual Revenue"
                        className={"infoInput"}
                      /> */}
                    </Form.Item>
                  </Col>
                  {userProfile?.institutional?.annual_investment_amount && (
                    <Col lg={6} sm={12}>
                      <Form.Item
                        name="annual_investment_amount"
                        label="Annual Investment"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Annual Investment!",
                          },
                        ]}
                      >
                        <Select
                          defaultValue={
                            userProfile?.institutional?.annual_investment_amount
                          } // Set the default value here
                          placeholder="Please enter your Annual Investment!"
                        >
                          {approxyOptions?.map((item: any, i: number) => (
                            <Select.Option key={i} value={item.value}>
                              {item.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <Row gutter={[32, 32]}>
                  <Col lg={6} sm={12}>
                    <Form.Item label="Bank" name="bank_id">
                      <Select
                        defaultValue={userProfile?.accounts?.bank_id} // Set the default value here
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
                                }}
                              >
                                <img
                                  src={bank.logo}
                                  alt={`Logo for ${bank.label}`}
                                  style={{
                                    width: "40px",
                                    height: "15px",
                                    marginRight: "5px",
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
                      label="Personal IBAN"
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
                        label="Personal IBAN"
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
                    <p>Source of income</p>
                    <h1>
                      {userProfile?.institutional?.source_of_income
                        ? userProfile?.institutional?.source_of_income
                        : "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Annual Revenue</p>
                    <h1>
                      {userProfile?.institutional?.annual_revenue
                        ? userProfile?.institutional?.annual_revenue + " SAR"
                        : "-"}
                    </h1>
                  </Col>
                  {userProfile?.institutional?.annual_investment_amount && (
                    <Col lg={5} sm={12}>
                      <p>Annual Investment</p>
                      <h1>
                        {userProfile?.institutional?.annual_investment_amount
                          ? userProfile?.institutional
                              ?.annual_investment_amount + " SAR"
                          : "-"}
                      </h1>
                    </Col>
                  )}
                  <Col lg={5} sm={12}>
                    <p>Bank name</p>
                    <h1>
                      {userProfile?.accounts?.name
                        ? userProfile?.accounts?.name
                        : "-"}
                    </h1>
                  </Col>
                </Row>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Personal IBAN</p>
                    <h1>
                      {userProfile?.accounts?.personal_iban_number
                        ? userProfile?.accounts?.personal_iban_number
                        : "-"}
                    </h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Dnaneer IBAN Number</p>
                    <h1>
                      {userProfile?.accounts?.dnaneer_iban
                        ? userProfile?.accounts?.dnaneer_iban
                        : "-"}
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
          className={`my-collapse-three ${activeKeyFour ? "active" : ""}`}
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
                Wathq Information
              </span>
            }
            key="4"
          >
            <>
              <Row>
                <Col lg={5} sm={12}>
                  <p>CR-Number</p>
                  <h1>{wathqInfo?.crNumber ? wathqInfo?.crNumber : "-"}</h1>
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
                    {wathqInfo?.status?.name ? wathqInfo?.status?.name : "-"}
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
                  <h1>{wathqInfo?.expiryDate ? wathqInfo?.expiryDate : "-"}</h1>
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
                  <h1>
                    {wathqInfo?.capital?.subscribedAmount
                      ? wathqInfo?.capital?.subscribedAmount
                      : "-"}
                  </h1>
                </Col>
              </Row>{" "}
              <Row>
                <Col lg={5} sm={12}>
                  <p>Announced Ammount</p>
                  <h1>
                    {wathqInfo?.capital?.announcedAmount
                      ? wathqInfo?.capital?.announcedAmount
                      : "-"}
                  </h1>
                </Col>{" "}
                <Col lg={5} sm={12}>
                  <p>Share Price</p>
                  <h1>
                    {wathqInfo?.capital?.share
                      ? wathqInfo?.capital?.share?.sharePrice
                      : "-"}
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
                  background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
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
                <AppTable columns={columns} dataSource={wathqInfo?.parties} />
              </div>
              {/* <Table columns={columns} dataSource={wathqInfo?.parties} /> */}
            </>
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
          className={`my-collapse-two ${activeKeySix ? "active" : ""}`}
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
                Wallet Information
              </span>
            }
            key="6"
          >
            <>
              <Row>
                <Col lg={8} sm={12}>
                  <p>Wallet ID (Dnaneer Acc Number)</p>
                  <h1>
                    {userProfile?.accounts?.dnaneer_account_no
                      ? `${userProfile?.accounts?.dnaneer_account_no}`
                      : "-"}
                  </h1>
                </Col>
                <Col lg={8} sm={12}>
                  <p>Balance</p>
                  <h1>
                    {userProfile?.accounts?.balance
                      ? `${userProfile?.accounts?.balance} SAR`
                      : "-"}
                  </h1>
                </Col>
              </Row>
            </>
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default PersonalInformation;
