import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Col, Collapse, Row, Spin, Table, message } from "antd";
import {
  accpetFundRequest,
  getTranferRequestDetail,
} from "../../services/ApiHandler";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";

const WithdrawalRequestModalIndividual = ({
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
      setLoading(true);
      const response = await getTranferRequestDetail(id);
      setWithdrawalDetails(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message ?? "Something Went Wrong");
    }
  };
  useEffect(() => {
    if (id) getDetails();
  }, [id]);
  useEffect(() => {
    console.log("individual", withdrawalDetails);
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
                    {withdrawalDetails?.user?.name
                      ? withdrawalDetails?.user?.name
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
                  <div className={`Individual-table-tag`} style={{ margin: 0 }}>
                    <div className={`Individual-dot-tag dot`} />
                    Individual
                  </div>
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
                <Col lg={5} sm={12}>
                  <h2>Net Worth</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.individual?.net_worth
                      ? withdrawalDetails?.individual?.net_worth
                      : "-"}
                  </p>
                </Col>
                {/* <Col lg={6} sm={12}>
                  <h2>Plan to Invest</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.individual?.plan_to_invest
                      ? `${withdrawalDetails?.individual?.plan_to_invest} SAR`
                      : "-"}
                  </p>
                </Col> */}
                <Col lg={5} sm={12}>
                  <h2>Source of Income</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.individual?.source_of_income
                      ? withdrawalDetails?.individual?.source_of_income
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Avg. Income</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.individual?.average_income
                      ? withdrawalDetails?.individual?.average_income
                      : "-"}
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
                <Col lg={5} sm={12}>
                  <h2>Employee</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.individual?.employee
                      ? withdrawalDetails?.individual?.employee
                      : "-"}
                  </p>
                </Col>
                {withdrawalDetails?.individual?.employee === "Yes" && (
                  <>
                    <Col lg={6} sm={12}>
                      <h2>Company</h2>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {withdrawalDetails?.individual?.current_company
                          ? withdrawalDetails?.individual?.current_company
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h2>Experience</h2>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {withdrawalDetails?.individual?.current_experience
                          ? withdrawalDetails?.individual?.current_experience
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h2>Position</h2>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {withdrawalDetails?.individual?.current_position
                          ? withdrawalDetails?.individual?.current_position
                          : "-"}
                      </p>
                    </Col>
                  </>
                )}
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header="Bank Information" key="2">
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
                    {withdrawalDetails?.bank?.name
                      ? withdrawalDetails?.bank?.name
                      : "-"}
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
                    {withdrawalDetails?.personal_iban_number
                      ? withdrawalDetails?.personal_iban_number
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h2>Withdrawal Amount</h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {withdrawalDetails?.amount
                      ? `${withdrawalDetails?.amount} SAR`
                      : "-"}
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

export default WithdrawalRequestModalIndividual;
