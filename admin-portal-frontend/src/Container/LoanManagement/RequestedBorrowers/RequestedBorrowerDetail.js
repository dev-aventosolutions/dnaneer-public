import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Row,
  Spin,
  Table,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getSingleRequestedBorrower } from "../../../services/ApiHandler";
import _ from "lodash";
import { documentHeadings } from "../../../utils/GeneralConstants";
import SupportedDocuments from "../../Investors/RequestedInvestors/SuppportedDocuments";
const { Panel } = Collapse;

const RequestedBorrowerDetail = ({
  label,
  visible,
  handleCancel,
  handleOk,
  flag,
  id,
}) => {
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [footer, setFooter] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        try {
          const { data } = await getSingleRequestedBorrower(id);
          if (data) {
            const wathq = JSON.parse(data?.data?.[0]?.user.wathq);
            console.log("getInvestorsList---->", {
              ...data?.data?.[0],
              user: { ...data?.data?.[0].user, wathq: wathq },
            });
            setDetail({
              ...data?.data?.[0],
              user: { ...data?.data?.[0].user, wathq: wathq },
            });
          }
        } catch (error) {
          console.log("err", error.response?.data.message);
          message.error(error.response?.data.message);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [flag]);
  useEffect(() => {
    if (detail?.status !== "approved") {
      setFooter([
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{
              margin: "0 15px",
              width: "200px",
              cursor: "pointer",
              backgroundColor: "#3AC318",
              color: "white",
              borderRadius: "30px",
            }}
            onClick={async () => {
              setLoading(true);
              await handleOk("approved", id);
              setLoading(false);
            }}
            loading={loading}
          >
            Approve
          </Button>
          <Button
            style={{
              margin: "0 15px",
              width: "200px",
              cursor: "pointer",
              backgroundColor: "#fff",
              color: "#FA3131",
              border: "1px solid rgba(138,133,149,.2)",
              borderRadius: "30px",
            }}
            onClick={async () => {
              setLoading(true);
              await handleOk("rejected", id);
              setLoading(false);
            }}
            loading={loading}
          >
            Reject
          </Button>
        </div>,
      ]);
    } else {
      setFooter(false);
    }
  }, [detail?.status, loading]);
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
  return (
    <Modal
      className="logout-modal"
      open={visible}
      onCancel={handleCancel}
      centered
      width={1200}
      closeIcon={<CloseOutlined />}
      footer={footer}
    >
      <Spin spinning={loading}>
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            color: "#5b2cd3",
          }}
        >
          {label}
        </h1>
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Panel header="Basic Information" key="1">
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <Col lg={4} sm={12}>
                <h4>Name</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.user?.name ? detail?.user?.name : "-"}
                </p>
              </Col>
              <Col lg={7} sm={12}>
                <h4>Email</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.user?.email ? detail?.user?.email : "-"}
                </p>
              </Col>
              <Col lg={4} sm={12}>
                <h4>Phone</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.user?.phone_number
                    ? detail?.user?.phone_number
                    : "-"}
                </p>
              </Col>
            </Row>
          </Panel>
          <Panel header="Company Information" key="2">
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <Col lg={5} sm={12}>
                <h4>Bussiness Name</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.business_name ? detail?.business_name : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Business Activity</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.business_activity ? detail?.business_activity : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>CR Number</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.cr_number ? detail?.cr_number : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>CR Expiry</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.cr_expiry_date ? detail?.cr_expiry_date : "-"}
                </p>
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                paddingLeft: "15px",
                paddingRight: "15px",
                gap: "50px",
              }}
            >
              <Col lg={5} sm={12}>
                <h4>Capital</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.capital ? detail?.capital : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Legal Type</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.legal_type ? detail?.legal_type : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Address</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.address ? detail?.address : "-"}
                </p>
              </Col>
            </Row>
          </Panel>
          <Panel header="Bank Details" key="3">
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <Col lg={8} sm={12}>
                <h4>Personal IBAN Number</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.accounts?.personal_iban_number
                    ? detail?.accounts?.personal_iban_number
                    : "-"}
                </p>
              </Col>
              <Col lg={6} sm={12}>
                <h4>Bank Name</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.accounts?.name ? detail?.accounts?.name : "-"}
                </p>
              </Col>
              {/* <Col lg={5} sm={12}>
                <h4>Wallet Id</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.accounts?.wallet_id
                    ? detail?.accounts?.wallet_id
                    : "-"}
                </p>
              </Col> */}
            </Row>
          </Panel>

          <Panel
            header={
              <span
                style={{
                  display: "inline-flex",
                }}
              >
                Wathq Information
              </span>
            }
            key="5"
          >
            {detail?.user?.wathq ? (
              <>
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>CR-Number</h4>
                    <p>
                      {detail?.user?.wathq?.crNumber
                        ? detail?.user?.wathq.crNumber
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>CR-Entity Number</h4>
                    <p>
                      {detail?.user?.wathq?.crEntityNumber
                        ? detail?.user?.wathq?.crEntityNumber
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Status</h4>
                    <p>
                      {detail?.user?.wathq?.status?.name
                        ? detail?.user?.wathq.status?.name
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Address</h4>
                    <p>
                      {detail?.user?.wathq?.address?.general?.address
                        ? detail?.user?.wathq?.address?.general?.address
                        : "-"}
                    </p>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>Location</h4>
                    <p>
                      {detail?.user?.wathq?.location?.name
                        ? detail?.user?.wathq?.location?.name
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Expiry Date</h4>
                    <p>
                      {detail?.user?.wathq?.expiryDate
                        ? detail?.user?.wathq?.expiryDate
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Paid Amount</h4>
                    <p>
                      {detail?.user?.wathq?.capital?.paidAmount
                        ? detail?.user?.wathq?.capital?.paidAmount
                        : "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Subscribed Amount</h4>
                    <p>
                      {detail?.user?.wathq?.capital?.subscribedAmount ?? "-"}
                    </p>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col lg={5} sm={12}>
                    <h4>Announced Ammount</h4>
                    <p>
                      {detail?.user?.wathq?.capital?.announcedAmount ?? "-"}
                    </p>
                  </Col>{" "}
                  <Col lg={5} sm={12}>
                    <h4>Share Price</h4>
                    <p>
                      {detail?.user?.wathq?.capital?.share?.sharePrice ?? "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Shares Count</h4>
                    <p>
                      {detail?.user?.wathq?.capital?.share
                        ? detail?.user?.wathq?.capital?.share?.sharesCount
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
                    dataSource={detail?.user?.wathq?.parties}
                    pagination={false}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </Panel>
          <Panel header={"Documents"} key="3">
            <>
              {detail?.borrower_documents_for_single_request?.length > 0 ? (
                <>
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
                    {detail?.borrower_documents_for_single_request?.map(
                      (doc) =>
                        documentHeadings.companyDocs?.includes(doc?.type) && (
                          <div style={{ margin: "10px" }}>
                            <Col lg={9} sm={12}>
                              <SupportedDocuments document={doc} />
                            </Col>
                          </div>
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
                    {detail?.borrower_documents_for_single_request?.map(
                      (doc) =>
                        documentHeadings.financialDocs?.includes(doc?.type) && (
                          <div style={{ margin: "10px" }}>
                            <Col lg={9} sm={12}>
                              <SupportedDocuments document={doc} />
                            </Col>
                          </div>
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
                    {detail?.borrower_documents_for_single_request?.map(
                      (doc) =>
                        documentHeadings.bankDocs?.includes(doc?.type) && (
                          <div style={{ margin: "10px" }}>
                            <Col lg={9} sm={12}>
                              <SupportedDocuments document={doc} />
                            </Col>
                          </div>
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
      </Spin>
    </Modal>
  );
};

export default RequestedBorrowerDetail;
