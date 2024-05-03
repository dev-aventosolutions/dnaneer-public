import { useEffect, useState } from "react";
// import Input from "components/Input/Input";
import { Row, Col, Collapse, Form, Input, Table, Divider } from "antd";
import { ReactComponent as Expand } from "../../../../assets/svgs/Expand.svg";
import "./info.scss";
import SupportedDocuments from "../../../Investors/RequestedInvestors/SuppportedDocuments";
import { documentHeadings } from "../../../../utils/GeneralConstants";
const { Panel } = Collapse;

const BorrowerPersonalInformation = ({ editInfo, userProfile }) => {
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
                Company Information
              </span>
            }
            key="1"
          >
            <>
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <p>CR-Number</p>
                    <h1>
                      {userProfile?.wathq?.crNumber
                        ? userProfile?.wathq?.crNumber
                        : "-"}
                    </h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Business Name</p>
                    <h1>{userProfile?.wathq?.businessType?.name || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Business Activity</p>
                    <h1>{userProfile?.business_activity || "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Legal Type</p>
                    <h1>{userProfile?.legal_type}</h1>
                  </Col>

                  <Col lg={5} sm={12}>
                    <p>Expiray Date</p>
                    <h1>{userProfile?.wathq?.expiryDate ?? "-"}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Address</p>
                    <h1>{userProfile?.wathq?.address?.general?.address}</h1>
                  </Col>
                  <Col lg={5} sm={12}>
                    <p>Capital</p>
                    <h1>{userProfile?.capital}</h1>
                  </Col>
                </Row>
              </>
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
                Contact person information
              </span>
            }
            key="2"
          >
            <>
              <Row>
                <Col lg={5} sm={12}>
                  <p>Name</p>
                  <h1>{userProfile?.name || "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>National id</p>
                  <h1>{userProfile?.saudi_id_number || "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Position</p>
                  <h1>{userProfile?.position || "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Phone Number</p>
                  <h1>{userProfile?.phone_number || "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Date Of birth</p>
                  <h1>{userProfile?.dob || "-"}</h1>
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
          className={`my-collapse-three ${activeKeyThree ? "active" : ""}`}
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
                Fund Request Information
              </span>
            }
            key="3"
          >
            <>
              <Row>
                <Col lg={5} sm={12}>
                  <p>Fund needed</p>
                  <h1>{userProfile?.seeking_amount ?? "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Repayment schedule of loan</p>
                  <h1>{userProfile?.repayment_duration ?? "-"}</h1>
                </Col>
                <Col lg={5} sm={12}>
                  <p>Existing Debt</p>
                  <h1>
                    {userProfile?.existing_obligations == 1 ? "Yes" : "No"}
                  </h1>
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
                Documents
              </span>
            }
            key="4"
          >
            <>
              {userProfile?.borrower_documents ? (
                <>
                  <Divider />

                  <h3>Company documents</h3>
                  <Row
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "space-between",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      marginTop: 0,
                    }}
                  >
                    {userProfile?.borrower_documents?.map(
                      (doc) =>
                        documentHeadings.companyDocs?.includes(doc?.type) && (
                          <Col lg={9} sm={12}>
                            <SupportedDocuments document={doc} />
                          </Col>
                        )
                    )}
                  </Row>
                  <Divider />
                  <h3>Financial documents</h3>
                  <Row
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "space-between",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      marginTop: 0,
                    }}
                  >
                    {userProfile?.borrower_documents?.map(
                      (doc) =>
                        documentHeadings.financialDocs?.includes(doc?.type) && (
                          <Col lg={9} sm={12}>
                            <SupportedDocuments document={doc} />
                          </Col>
                        )
                    )}
                  </Row>
                  <Divider />
                  <h3>Bank information</h3>
                  <Row
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "space-between",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      marginTop: 0,
                    }}
                  >
                    {userProfile?.borrower_documents?.map(
                      (doc) =>
                        documentHeadings.bankDocs?.includes(doc?.type) && (
                          <Col lg={9} sm={12}>
                            <SupportedDocuments document={doc} />
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
          className={`my-collapse-three ${activeKeyFive ? "active" : ""}`}
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
                Banking Information
              </span>
            }
            key="5"
          >
            <Row>
              <Col lg={8} sm={12}>
                <p>Bank</p>
                <h1>
                  {userProfile?.bank_name ? `${userProfile?.bank_name}` : "-"}
                </h1>
              </Col>
              <Col lg={8} sm={12}>
                <p>Personal IBAN Number</p>
                <h1>
                  {userProfile?.personal_iban_number ? `SAR ${userProfile?.personal_iban_number}` : "-"}
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
            {userProfile?.wathq ? (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>CR-Number</h4>
                    <p>
                      {userProfile?.wathq?.crNumber
                        ? userProfile?.wathq.crNumber
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>CR-Entity Number</h4>
                    <p>
                      {userProfile?.wathq?.crEntityNumber
                        ? userProfile?.wathq?.crEntityNumber
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Status</h4>
                    <p>
                      {userProfile?.wathq?.status?.name
                        ? userProfile?.wathq.status?.name
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Address</h4>
                    <p>
                      {userProfile?.wathq?.address?.general?.address
                        ? userProfile?.wathq?.address?.general?.address
                        : "-"}
                    </p>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>Location</h4>
                    <p>
                      {userProfile?.wathq?.location?.name
                        ? userProfile?.wathq?.location?.name
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Expiry Date</h4>
                    <p>
                      {userProfile?.wathq?.expiryDate
                        ? userProfile?.wathq?.expiryDate
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Paid Amount</h4>
                    <p>
                      {userProfile?.wathq?.capital?.paidAmount
                        ? userProfile?.wathq?.capital?.paidAmount
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Subscribed Amount</h4>
                    <p>
                      {userProfile?.wathq?.capital?.subscribedAmount ?? "-"}
                    </p>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>Announced Ammount</h4>
                    <p>{userProfile?.wathq?.capital?.announcedAmount ?? "-"}</p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Share Price</h4>
                    <p>
                      {userProfile?.wathq?.capital?.share?.sharePrice ?? "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Shares Count</h4>
                    <p>
                      {userProfile?.wathq?.capital?.share
                        ? userProfile?.wathq?.capital?.share?.sharesCount
                        : "-"}
                    </p>
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
                  <Table
                    columns={columns}
                    dataSource={userProfile?.wathq?.parties}
                    pagination={false}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default BorrowerPersonalInformation;
