import { useEffect, useState } from "react";
// import Input from "components/Input/Input";
import { Row, Col, Collapse, Form, Input, Table, Divider } from "antd";
import { ReactComponent as Expand } from "../../../../assets/svgs/Expand.svg";
import "./info.scss";
const { Panel } = Collapse;

const PersonalInformation = ({ editInfo, userProfile }) => {
  const [activeKey, setActiveKey] = useState(1);
  const [activeKeyTwo, setActiveKeyTwo] = useState(null);
  const [activeKeyThree, setActiveKeyThree] = useState(null);
  const [activeKeyFour, setActiveKeyFour] = useState(null);
  const [activeKeyFive, setActiveKeyFive] = useState(null);
  const [activeKeySix, setActiveKeySix] = useState(null);
  const [activeKeySeven, setActiveKeySeven] = useState(null);

  const [info, setInfo] = useState({});

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

  useEffect(() => {
    if (userProfile?.wathq) {
      setInfo(JSON.parse(userProfile?.wathq));
    } else {
      setInfo(JSON.parse(userProfile?.nafath));
    }
  }, [userProfile]);

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
  function handleCollapseChangeSeven(keys) {
    setActiveKeySeven(keys[0]);
  }
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
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
                Personal Information
              </span>
            }
            key="1"
          >
            <>
              {userProfile.institutional ? (
                <>
                  <Row>
                    <Col lg={8} sm={12}>
                      <p>Company</p>
                      <h1>{userProfile?.institutional?.company_name || "-"}</h1>
                    </Col>
                    <Col lg={8} sm={12}>
                      <p>Position</p>
                      <h1>{userProfile?.institutional?.position || "-"}</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={5} sm={12}>
                      <p>National ID Number</p>
                      <h1>{userProfile?.institutional?.id_number}</h1>
                    </Col>
                    <Col lg={5} sm={12}>
                      <p>Address</p>
                      <h1>{userProfile?.institutional?.address}</h1>
                    </Col>
                    <Col lg={5} sm={12}>
                      <p>Email</p>
                      <h1>{userProfile?.email}</h1>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col lg={5} sm={12}>
                      <p>Education</p>
                      <h1>{userProfile?.individual?.education || "-"}</h1>
                    </Col>
                    <Col lg={5} sm={12}>
                      <p>Employed</p>
                      <h1>
                        {userProfile?.individual?.employee
                          ? userProfile?.individual?.employee
                          : "-"}
                      </h1>
                    </Col>
                    {userProfile?.individual?.employee === "Yes" ? (
                      <>
                        <Col lg={5} sm={12}>
                          <p>Company</p>
                          <h1>
                            {userProfile?.individual?.current_company || "-"}
                          </h1>
                        </Col>
                        <Col lg={5} sm={12}>
                          <p>Position</p>
                          <h1>
                            {userProfile?.individual?.current_position || "-"}
                          </h1>
                        </Col>{" "}
                      </>
                    ) : null}
                  </Row>
                  {userProfile?.individual?.employee === "Yes" ? (
                    <Row>
                      <Col lg={5} sm={12}>
                        <p>Years of Exp.</p>
                        <h1>{userProfile?.individual?.current_experience}</h1>
                      </Col>
                      <Col lg={5} sm={12}>
                        <p>National ID Number</p>
                        <h1>
                          {userProfile?.national_id
                            ? userProfile?.national_id
                            : "-"}
                        </h1>
                      </Col>
                      <Col lg={5} sm={12}>
                        <p>Email</p>
                        <h1>{userProfile?.email}</h1>
                      </Col>
                    </Row>
                  ) : null}
                </>
              )}
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
            {userProfile.institutional ? (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Source of income</p>
                    <h1>
                      {userProfile?.institutional?.source_of_income || "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Yearly Avgrage income</p>
                    <h1>{userProfile?.institutional?.annual_revenue || "-"}</h1>
                  </Col>
                  {userProfile?.institutional?.annual_investment_amount && <Col lg={5} sm={12}>
                    <p>Approximate of annual investments amount (SAR)</p>
                    <h1>
                      {userProfile?.institutional?.annual_investment_amount ||
                        "-"}
                    </h1>
                  </Col>}
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Source of income</p>
                    <h1>{userProfile?.individual?.source_of_income || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Yearly Avgrage income</p>
                    <h1>{userProfile?.individual?.average_income || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Net worth</p>
                    <h1>{userProfile?.individual?.net_worth || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Investment Objective</p>
                    <h1>
                      {userProfile?.individual?.investment_objectives || "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Investment Knowledge</p>
                    <h1>
                      {userProfile?.individual?.investment_knowledge || "-"}
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
          className={`my-collapse-two ${activeKeyThree ? "active" : ""}`}
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
                Financial Advisor
              </span>
            }
            key="3"
          >
            {userProfile.institutional ? (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Advisor Name</p>
                    <h1>{userProfile?.advisor?.name || "-"}</h1>
                  </Col>

                  <Col lg={5} sm={12}>
                    <p>Phone Number</p>
                    <h1>{userProfile?.advisor?.phone_no || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Email</p>
                    <h1>{userProfile?.advisor?.email || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>WhatsApp Number</p>
                    <h1>{userProfile?.advisor?.whatsapp_no || "-"}</h1>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Advisor Name</p>
                    <h1>{userProfile?.advisor?.name || "-"}</h1>
                  </Col>

                  <Col lg={5} sm={12}>
                    <p>Phone Number</p>
                    <h1>{userProfile?.advisor?.phone_no || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Email</p>
                    <h1>{userProfile?.advisor?.email || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>WhatsApp Number</p>
                    <h1>{userProfile?.advisor?.whatsapp_no || "-"}</h1>
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
                Banking Information
              </span>
            }
            key="4"
          >
            <>
              <Row>
                <Col lg={5} sm={12}>
                  <p>Bank name</p>
                  <h1>{userProfile?.accounts?.name}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Personal IBAN Number</p>
                  <h1>#{userProfile?.accounts?.personal_iban_number}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Dnaneer IBAN Number</p>
                  <h1>{userProfile?.accounts?.dnaneer_iban ?? "-"}</h1>
                </Col>
              </Row>
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
          className={`my-collapse-two ${activeKeyFive ? "active" : ""}`}
          onChange={handleCollapseChangeFive}
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
            key="5"
          >
            <Row>
              <Col lg={8} sm={12}>
                <p>Dnaneer Acc#</p>
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
          {userProfile?.wathq ? (
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
              key="6"
            >
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>CR-Number</p>
                    <h1>{info?.crNumber ? info?.crNumber : "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>CR-Entity Number</p>
                    <h1>{info?.crEntityNumber ? info?.crEntityNumber : "-"}</h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Status</p>
                    <h1>{info?.status?.name ? info?.status?.name : "-"}</h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Address</p>
                    <h1>
                      {info?.address?.general?.address
                        ? info?.address?.general?.address
                        : "-"}
                    </h1>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Location</p>
                    <h1>{info?.location?.name ? info?.location?.name : "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Expiry Date</p>
                    <h1>{info?.expiryDate ? info?.expiryDate : "-"}</h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Paid Amount</p>
                    <h1>
                      {info?.capital?.paidAmount
                        ? info?.capital?.paidAmount
                        : "-"}
                    </h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Subscribed Amount</p>
                    <h1>
                      {info?.capital?.subscribedAmount
                        ? info?.capital?.subscribedAmount
                        : "-"}
                    </h1>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <p>Announced Ammount</p>
                    <h1>
                      {info?.capital?.announcedAmount
                        ? info?.capital?.announcedAmount
                        : "-"}
                    </h1>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <p>Share Price</p>
                    <h1>
                      {info?.capital?.share
                        ? info?.capital?.share?.sharePrice
                        : "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Shares Count</p>
                    <h1>
                      {info?.capital?.share
                        ? info?.capital?.share?.sharesCount
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
                  <Table columns={columns} dataSource={info?.parties} />
                </div>
              </>
            </Panel>
          ) : (
            <Panel header="Nafath Information" key="4">
              <Row
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                <Col lg={5} sm={24}>
                  <h4>Full Name</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {`${info?.englishFirstName ? info?.englishFirstName : ""} ${
                      info?.englishLastName ? info?.englishLastName : ""
                    } ${
                      info?.englishSecondName ? info?.englishSecondName : ""
                    } ${info?.englishThirdName ? info?.englishThirdName : ""}`}
                  </p>
                </Col>
                <Col lg={5} sm={24}>
                  <h4>اسْم ثُلاثيّ</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {`${info?.firstName ? info?.firstName : ""} ${
                      info?.familyName ? info?.familyName : ""
                    } ${info?.fatherName ? info?.fatherName : ""} ${
                      info?.grandFatherName ? info?.grandFatherName : ""
                    }`}
                  </p>
                </Col>
                <Col lg={5} sm={24}>
                  <h4>Date of Birth</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    <div>
                      {info?.dateOfBirthG ? ` ${info?.dateOfBirthG} (G)` : "-"}
                    </div>
                    <div>
                      {info?.dateOfBirthH ? ` ${info?.dateOfBirthH} (H)` : "-"}
                    </div>
                  </p>
                </Col>
                <Col lg={5} sm={24}>
                  <h4>Gender</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {info?.gender ? info?.gender : "-"}
                  </p>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                <Col lg={5} sm={24}>
                  <h4>Nationality</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {info?.nationality ? info?.nationality : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={24}>
                  <h4>Service Name</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {info?.ServiceName ? info?.ServiceName : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={24}>
                  <h4>ID Expiry Date</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    <div>
                      {info?.idExpiryDateG
                        ? ` ${info?.idExpiryDateG} (G)`
                        : "-"}
                    </div>
                    <div>
                      {info?.idExpiryDate ? ` ${info?.idExpiryDate} (H)` : "-"}
                    </div>
                  </p>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                {info?.nationalAddress?.map((address, index) => (
                  <Col>
                    <h4>Address {index + 1}</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      <strong>City:</strong> {address.city}
                      <br />
                      <strong>District:</strong> {address.district}
                      <br />
                      <strong>Post Code:</strong> {address.postCode}
                      <br />
                      <strong>Street Name:</strong> {address.streetName}
                      <br />
                      <strong>Building Number:</strong> {address.buildingNumber}
                      <br />
                      <strong>Additional Number:</strong>{" "}
                      {address.additionalNumber}
                      <br />
                      <strong>Is Primary Address:</strong>{" "}
                      {address.isPrimaryAddress}
                      <br />
                      <strong>Location Coordinates:</strong>{" "}
                      {address.locationCoordinates}
                    </p>
                  </Col>
                ))}
              </Row>
            </Panel>
          )}
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
          className={`my-collapse ${activeKeySeven ? "active" : ""}`}
          onChange={handleCollapseChangeSeven}
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
                General Information
              </span>
            }
            key="7"
          >
            <>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: 25,
                  alignItems: "center",
                }}
              >
                <p style={{ marginBottom: 0, marginTop: 0 }}>
                  Are you assigned to high-level missions in the Kingdom of
                  Saudi Arabia or in a foreign country?
                </p>
                <h1 style={{ marginRight: "5rem" }}>
                  {userProfile?.individual
                    ? userProfile?.individual?.high_level_mission === 1
                      ? "Yes"
                      : "No"
                    : userProfile?.individual?.high_level_mission === 1
                    ? "Yes"
                    : "No"}
                </h1>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: 25,
                }}
              >
                <p style={{ marginBottom: 0, marginTop: 0 }}>
                  Are you in a senior management position or a job in an
                  international organization?
                </p>
                <h1 style={{ marginRight: "5rem" }}>
                  {userProfile?.individual
                    ? userProfile?.individual?.senior_position === 1
                      ? "Yes"
                      : "No"
                    : userProfile?.institutional?.senior_position === 1
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
                <p
                  style={{
                    maxWidth: "50rem",
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                >
                  Do you have a blood or marriage relationship, up to the second
                  degree, with someone who is assigned to high-level missions in
                  the Kingdom of Saudi Arabia or in a foreign country, or in
                  senior management positions or a job in an international
                  organization?
                </p>
                <h1 style={{ marginRight: "5rem" }}>
                  {userProfile?.individual
                    ? userProfile?.individual?.marriage_relationship === 1
                      ? "Yes"
                      : "No"
                    : userProfile?.institutional?.marriage_relationship === 1
                    ? "Yes"
                    : "No"}
                </h1>
              </div>
            </>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default PersonalInformation;
