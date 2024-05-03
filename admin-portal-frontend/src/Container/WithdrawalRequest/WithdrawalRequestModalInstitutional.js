import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Col, Collapse, Row, Spin, Table, message } from "antd";
import {
  accpetFundRequest,
  getTranferRequestDetail,
} from "../../services/ApiHandler";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";

const WithdrawalRequestModalInstitutional = ({
  visible,
  handleCancel,
  handleOk,
  rejection,
  id,
  flag,
  type,
  setFlag2,
  flag2,
  request,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [withdrawalDetails, setWithdrawalDetails] = useState({});

  const requestHandle = (key) => {
    setLoading(true);
    accpetFundRequest({ status: key, id: id })
      .then((res) => {
        handleOk();
        setFlag2(!flag2);
        message.success("Updated ");
        setLoading(false);
      })
      .catch((error) => {
        message.error("Something went wrong");
        setLoading(false);
      });
  };
  const getDetails = async () => {
    try {
      const response = await getTranferRequestDetail(id);
      setWithdrawalDetails(response?.data?.data);
    } catch (error) {
      message.error(error.message ?? "Something Went Wrong");
    }
  };
  useEffect(() => {
    if (id) getDetails();
  }, [id]);
  useEffect(() => {
    console.log("institutional", withdrawalDetails);
  }, [withdrawalDetails]);

  return (
    <>
      <Modal
        className="logout-modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={1200}
        closeIcon={<CloseOutlined />}
        footer={[
          request === "accepted" || request === "rejected" ? null : (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                data
                style={{
                  margin: "0 15px",
                  width: "200px",
                  cursor: "pointer",
                  backgroundColor: "#3AC318",
                  color: "white",
                  borderRadius: "30px",
                }}
                onClick={() => requestHandle("approved")}
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
                onClick={() => rejection()}
              >
                Reject
              </Button>
            </div>
          ),
        ]}
      >
        <Spin spinning={loading}>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: "#5b2cd3",
            }}
          >
            Withdrawal Request
          </h1>
          <Collapse defaultActiveKey={["1"]}>
            <Collapse.Panel header="Investor Information" key="1">
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
                  <h2>Name</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.investor_name
                      ? withdrawalDetails?.institutional?.investor_name
                      : "-"}
                  </p>
                </Col>
                <Col lg={6} sm={12}>
                  <h2>Email</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.user?.email
                      ? withdrawalDetails?.user?.email
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Mode</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.user?.mode
                      ? withdrawalDetails?.user?.mode?.toUpperCase()
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Investor Type</h2>
                  <div
                    className={`Institutional-table-tag`}
                    style={{ margin: 0 }}
                  >
                    <div className={`Institutional-dot-tag dot`} />
                    Institutional
                  </div>
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
                <Col lg={6} sm={12}>
                  <h2>Phone Number</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.phone_number
                      ? withdrawalDetails?.institutional?.phone_number
                      : "-"}
                  </p>
                </Col>
                <Col lg={7} sm={12}>
                  <h2>Position</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.position
                      ? withdrawalDetails?.institutional?.position
                      : "-"}
                  </p>
                </Col>
                <Col lg={6} sm={12}>
                  <h2>Source of Income</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.source_of_income
                      ? withdrawalDetails?.institutional?.source_of_income
                      : "-"}
                  </p>
                </Col>
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header="Company Information" key="2">
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
                  <h2>Company</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.company_name
                      ? withdrawalDetails?.institutional?.company_name
                      : "-"}
                  </p>
                </Col>
                <Col lg={6} sm={12}>
                  <h2>Address</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.address
                      ? withdrawalDetails?.institutional?.address
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Annual Revenue</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.annual_revenue
                      ? withdrawalDetails?.institutional?.annual_revenue
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Establishment Date</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.establishment_date
                      ? withdrawalDetails?.institutional?.establishment_date
                      : "-"}
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
                <Col lg={6} sm={12}>
                  <h2>CR Number</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.registration_number
                      ? withdrawalDetails?.institutional?.registration_number
                      : "-"}
                  </p>
                </Col>
                <Col lg={7} sm={12}>
                  <h2>Legal Structure</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.legal_structure
                      ? withdrawalDetails?.institutional?.legal_structure
                      : "-"}
                  </p>
                </Col>
                <Col lg={6} sm={12}>
                  <h2>Source of Income</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.source_of_income
                      ? withdrawalDetails?.institutional?.source_of_income
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Investment Amount</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.institutional?.investment_amount
                      ? withdrawalDetails?.institutional?.investment_amount
                      : "-"}
                  </p>
                </Col>
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header="Bank Information" key="3">
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
                  <h2>Bank</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {data?.bank_name ? data?.bank_name : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Personal IBAN Number</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {data?.personal_iban_number ? data?.personal_iban_number : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Amount</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {data?.amount ? `${data?.amount} SAR` : "-"}
                  </p>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </Spin>
      </Modal>
    </>
  );
};

export default WithdrawalRequestModalInstitutional;
