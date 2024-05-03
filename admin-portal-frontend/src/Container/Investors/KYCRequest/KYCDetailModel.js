import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Col, Row, Spin, Table, message } from "antd";
import {
  createKYCRequest,
  getSignleKYCDetail,
} from "../../../services/ApiHandler";
import { CloseOutlined } from "@ant-design/icons";

import { Collapse } from "antd";
import SupportedDocuments from "../RequestedInvestors/SuppportedDocuments";
const { Panel } = Collapse;

const KYCDetailModel = ({
  visible,
  handleCancel,
  handleOk,
  rejection,
  id,
  flag,
  type,
  setFlag2,
  flag2,
  fetchInvestorsList,
}) => {
  const [loading, setLoading] = useState(false);
  const [investorsData, setInvestorsData] = useState(null);
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
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const { data } = await getSignleKYCDetail(id);
          if (data) {
            console.log("getInvestorsList", {
              ...data?.data[0],
              nafath: data?.data[0]?.nafath
                ? JSON.parse(data?.data[0]?.nafath)
                : data?.data[0]?.nafath,
              wathq: data?.data[0]?.wathq
                ? JSON.parse(data?.data[0]?.wathq)
                : data?.data[0]?.wathq,
            });
            setInvestorsData({
              ...data?.data[0],
              nafath: data?.data[0]?.nafath
                ? JSON.parse(data?.data[0]?.nafath)
                : data?.data[0]?.nafath,
              wathq: data?.data[0]?.wathq
                ? JSON.parse(data?.data[0]?.wathq)
                : data?.data[0]?.wathq,
            });
          }
        } catch (error) {
          console.log("err", error.response.data.message);
          // message.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [flag]);

  const requestHandle = (key) => {
    setLoading(true);
    createKYCRequest({ status: key, user_id: id })
      .then((res) => {
        handleOk();
        setFlag2(!flag2);
        message.success("Updated Successfully");
        fetchInvestorsList();
        setLoading(false);
      })
      .catch((error) => {
        message.error("Something went wrong");
        setLoading(false);
      });
  };

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
          </div>,
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
            KYC Request
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
                <Col lg={5} sm={12}>
                  <h4>Name</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.user_type === 1
                      ? investorsData?.nafath?.englishFirstName
                        ? investorsData?.nafath?.englishFirstName
                        : "-"
                      : investorsData?.institutional?.investor_name ?? "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h4>Email</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.email ? investorsData?.email : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h4>Phone</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.user_type === 1
                      ? investorsData?.phone_number
                        ? investorsData?.phone_number
                        : "-"
                      : investorsData?.institutional?.phone_number ?? "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h4>National ID Number</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.user_type === 1
                      ? investorsData?.national_id
                        ? investorsData?.national_id
                        : "-"
                      : investorsData?.institutional?.id_number ?? "-"}
                  </p>
                </Col>
              </Row>
              {investorsData?.individual?.employee &&
                investorsData?.individual?.employee == "Yes" && (
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
                      <h4>Currently Employeed</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {"Yes"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Current Company</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.current_company
                          ? investorsData?.individual?.current_company
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Current Experience</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.current_experience
                          ? investorsData?.individual?.current_experience
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Current Position</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.current_position
                          ? investorsData?.individual?.current_position
                          : "-"}
                      </p>
                    </Col>
                  </Row>
                )}
              <Row
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  gap: "15px",
                }}
              >
                <Col lg={6} sm={12}>
                  <h4>Type</h4>
                  <div
                    className={`${
                      investorsData?.user_type === 1
                        ? "Individual"
                        : "Institutional"
                    }-table-tag`}
                    style={{ margin: 0 }}
                  >
                    <div
                      className={`${
                        investorsData?.user_type === 1
                          ? "Individual"
                          : "Institutional"
                      }-dot-tag dot`}
                    />
                    {investorsData?.user_type === 1
                      ? "Individual"
                      : "Institutional"}
                  </div>
                </Col>
                <Col lg={6} sm={12}>
                  <h4>Mode</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.mode
                      ? investorsData?.mode?.toUpperCase()
                      : "-"}
                  </p>
                </Col>
                {investorsData?.user_type === 2 && (
                  <Col lg={5} sm={12}>
                    <h4>Position</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {investorsData?.institutional?.position
                        ? investorsData?.institutional?.position
                        : "-"}
                    </p>
                  </Col>
                )}
                {investorsData?.individual?.employee == "No" && (
                  <Col lg={5} sm={12}>
                    <h4>Currently Employeed</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {"No"}
                    </p>
                  </Col>
                )}
              </Row>
            </Panel>
            <Panel header="Financing Details" key="2">
              {investorsData?.user_type === 1 ? (
                <>
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
                      <h4>Education</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.education
                          ? investorsData?.individual?.education
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Source of Income</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.source_of_income
                          ? investorsData?.individual?.source_of_income
                          : "-"}
                      </p>
                    </Col>

                    <Col lg={5} sm={12}>
                      <h4>Average Income</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.average_income
                          ? investorsData?.individual?.average_income
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Net Worth</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.net_worth
                          ? investorsData?.individual?.net_worth
                          : "-"}
                      </p>
                    </Col>
                  </Row>
                  {/* <Row
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      gap: "55px",
                    }}
                  >
                    <Col lg={5} sm={12}>
                      <h4>Plan to Invest</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.individual?.plan_to_invest
                          ? investorsData?.individual?.plan_to_invest + " SAR"
                          : "-"}
                      </p>
                    </Col>
                  </Row> */}
                </>
              ) : (
                <>
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
                      <h4>Company Name</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.company_name
                          ? investorsData?.institutional?.company_name
                          : "-"}
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
                        {investorsData?.institutional?.address
                          ? investorsData?.institutional?.address
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Annual Revenue</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.annual_revenue
                          ? investorsData?.institutional?.annual_revenue +
                            " SAR"
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
                      <h4>Registration Number</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.registration_number
                          ? investorsData?.institutional?.registration_number
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Source of Income</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.source_of_income
                          ? investorsData?.institutional?.source_of_income
                          : "-"}
                      </p>
                    </Col>
                    {/* <Col lg={5} sm={12}>
                      <h4>Investor Name</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.investor_name
                          ? investorsData?.institutional?.investor_name
                          : "-"}
                      </p>
                    </Col> */}
                    <Col lg={5} sm={12}>
                      <h4>Phone Number</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.phone_number
                          ? investorsData?.phone_number
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
                      <h4>Legal Structure</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.legal_structure
                          ? investorsData?.institutional?.legal_structure
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>Establishment Date</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.establishment_date
                          ? investorsData?.institutional?.establishment_date
                          : "-"}
                      </p>
                    </Col>
                    <Col lg={5} sm={12}>
                      <h4>National ID Number</h4>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {investorsData?.institutional?.id_number
                          ? investorsData?.institutional?.id_number
                          : "-"}
                      </p>
                    </Col>
                  </Row>
                </>
              )}
            </Panel>
            <Panel header="Bank Information" key="3">
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
                  <h4>Bank Name</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.accounts?.name
                      ? investorsData?.accounts?.name
                      : "-"}
                  </p>
                </Col>
                <Col lg={8} sm={12}>
                  <h4>Personal IBAN Number</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.accounts?.personal_iban_number
                      ? investorsData?.accounts?.personal_iban_number
                      : "-"}
                  </p>
                </Col>
                <Col lg={5} sm={12}>
                  <h4>Balance</h4>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {investorsData?.accounts?.balance
                      ? investorsData?.accounts?.balance + " SAR"
                      : "-"}
                  </p>
                </Col>
              </Row>
            </Panel>
            {investorsData?.user_type === 1 ? (
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
                      {`${
                        investorsData?.nafath.englishFirstName
                          ? investorsData?.nafath.englishFirstName
                          : ""
                      } ${
                        investorsData?.nafath.englishLastName
                          ? investorsData?.nafath.englishLastName
                          : ""
                      } ${
                        investorsData?.nafath.englishSecondName
                          ? investorsData?.nafath.englishSecondName
                          : ""
                      } ${
                        investorsData?.nafath.englishThirdName
                          ? investorsData?.nafath.englishThirdName
                          : ""
                      }`}
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
                      {`${
                        investorsData?.nafath.firstName
                          ? investorsData?.nafath.firstName
                          : ""
                      } ${
                        investorsData?.nafath.familyName
                          ? investorsData?.nafath.familyName
                          : ""
                      } ${
                        investorsData?.nafath.fatherName
                          ? investorsData?.nafath.fatherName
                          : ""
                      } ${
                        investorsData?.nafath.grandFatherName
                          ? investorsData?.nafath.grandFatherName
                          : ""
                      }`}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Date of Birth</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      <div>
                        {investorsData?.nafath.dateOfBirthG
                          ? ` ${investorsData?.nafath.dateOfBirthG} (G)`
                          : "-"}
                      </div>
                      <div>
                        {investorsData?.nafath.dateOfBirthH
                          ? ` ${investorsData?.nafath.dateOfBirthH} (H)`
                          : "-"}
                      </div>
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Gender</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {investorsData?.nafath.gender
                        ? investorsData?.nafath.gender
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>Nationality</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {investorsData?.nafath.nationality
                        ? investorsData?.nafath.nationality
                        : "-"}
                    </p>
                  </Col>
                </Row>
                <Row
                  style={{
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <Col lg={5} sm={6}>
                    <h4>Service Name</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {investorsData?.nafath.ServiceName
                        ? investorsData?.nafath.ServiceName
                        : "-"}
                    </p>
                  </Col>
                  <Col lg={5} sm={12}>
                    <h4>ID Expiry Date</h4>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      <div>
                        {investorsData?.nafath.idExpiryDateG
                          ? ` ${investorsData?.nafath.idExpiryDateG} (G)`
                          : "-"}
                      </div>
                      <div>
                        {investorsData?.nafath.idExpiryDate
                          ? ` ${investorsData?.nafath.idExpiryDate} (H)`
                          : "-"}
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
                  {investorsData?.nafath.nationalAddress?.map(
                    (address, index) => (
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
                          <strong>Building Number:</strong>{" "}
                          {address.buildingNumber}
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
                    )
                  )}
                </Row>
              </Panel>
            ) : (
              <>
                <Panel header={<span>Wathq Information</span>} key="5">
                  <>
                    <Row>
                      <Col lg={5} sm={12}>
                        <h4>CR-Number</h4>
                        <p>
                          {investorsData?.wathq?.crNumber
                            ? investorsData?.wathq?.crNumber
                            : "-"}
                        </p>
                      </Col>
                      <Col lg={5} sm={12}>
                        <h4>CR-Entity Number</h4>
                        <p>
                          {investorsData?.wathq?.crEntityNumber
                            ? investorsData?.wathq?.crEntityNumber
                            : "-"}
                        </p>
                      </Col>{" "}
                      <Col lg={5} sm={12}>
                        <h4>Status</h4>
                        <p>
                          {investorsData?.wathq?.status?.nameEn
                            ? investorsData?.wathq?.status?.nameEn
                            : "-"}
                        </p>
                        <p>
                          {investorsData?.wathq?.status?.name
                            ? investorsData?.wathq?.status?.name
                            : "-"}
                        </p>
                      </Col>{" "}
                      <Col lg={5} sm={12}>
                        <h4>Address</h4>
                        <p>
                          {investorsData?.wathq?.address?.general?.address
                            ? investorsData?.wathq?.address?.general?.address
                            : "-"}
                        </p>
                      </Col>
                    </Row>{" "}
                    <Row>
                      <Col lg={5} sm={12}>
                        <h4>Location</h4>
                        <p>
                          {investorsData?.wathq?.location?.name
                            ? investorsData?.wathq?.location?.name
                            : "-"}
                        </p>
                      </Col>
                      <Col lg={5} sm={12}>
                        <h4>Expiry Date</h4>
                        <p>
                          {investorsData?.wathq?.expiryDate
                            ? investorsData?.wathq?.expiryDate
                            : "-"}
                        </p>
                      </Col>{" "}
                      <Col lg={5} sm={12}>
                        <h4>Paid Amount</h4>
                        <p>
                          {investorsData?.wathq?.capital?.paidAmount
                            ? investorsData?.wathq?.capital?.paidAmount
                            : "-"}
                        </p>
                      </Col>{" "}
                      <Col lg={5} sm={12}>
                        <h4>Subscribed Amount</h4>
                        <p>
                          {investorsData?.wathq?.capital?.subscribedAmount
                            ? investorsData?.wathq?.capital?.subscribedAmount
                            : "-"}
                        </p>
                      </Col>
                    </Row>{" "}
                    <Row>
                      <Col lg={5} sm={12}>
                        <h4>Announced Ammount</h4>
                        <p>
                          {investorsData?.wathq?.capital?.announcedAmount
                            ? investorsData?.wathq?.capital?.announcedAmount
                            : "-"}
                        </p>
                      </Col>{" "}
                      <Col lg={5} sm={12}>
                        <h4>Share Price</h4>
                        <p>
                          {investorsData?.wathq?.capital?.share
                            ? investorsData?.wathq?.capital?.share?.sharePrice
                            : "-"}
                        </p>
                      </Col>
                      <Col lg={5} sm={12}>
                        <h4>Shares Count</h4>
                        <p>
                          {investorsData?.wathq?.capital?.share
                            ? investorsData?.wathq?.capital?.share?.sharesCount
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
                        dataSource={investorsData?.wathq?.parties}
                      />
                    </div>
                  </>
                </Panel>
                <Panel header="Supported Documents" key="7">
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
                      {investorsData?.documents?.length ? (
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <div>
                            <h2>Legal Documents</h2>

                            {investorsData?.documents
                              ?.filter(
                                (doc) => doc?.module === "kyc_legal_documents"
                              )
                              .map((doc) => (
                                <SupportedDocuments document={doc} />
                              ))}
                          </div>
                          <div>
                            <div style={{ marginLeft: "170px" }}>
                              <h2>Other Documents</h2>

                              {investorsData?.documents
                                ?.filter(
                                  (doc) => doc?.module === "kyc_other_documents"
                                )
                                .map((doc) => (
                                  <SupportedDocuments document={doc} />
                                ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>No document attached</p>
                      )}
                    </Col>
                  </Row>
                </Panel>
              </>
            )}
          </Collapse>
        </Spin>
      </Modal>
    </>
  );
};

export default KYCDetailModel;
