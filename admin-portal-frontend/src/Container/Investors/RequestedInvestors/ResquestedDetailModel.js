import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Col, Collapse, Row, Spin, Table, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import SupportedDocuments from "./SuppportedDocuments";

const ResquestedDetailModel = ({
  label,
  visible,
  handleCancel,
  handleOk,
  data,
  loading,
  rejection,
}) => {
  return (
    <Modal
      className="logout-modal"
      open={visible}
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
            onClick={handleOk}
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
            onClick={rejection}
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
          {label}
        </h1>
        <Collapse defaultActiveKey={["1", "2"]}>
          <Collapse.Panel header="Basic Information" key="1">
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
                <h2>Email</h2>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {data?.email ? data?.email : "-"}
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
                  {data?.mode ? data?.mode?.toUpperCase() : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h2>Type</h2>
                <div
                  className={`${
                    data?.user_type === 1 ? "Individual" : "Institutional"
                  }-table-tag`}
                  style={{ margin: 0 }}
                >
                  <div
                    className={`${
                      data?.user_type === 1 ? "Individual" : "Institutional"
                    }-dot-tag dot`}
                  />
                  {data?.user_type === 1 ? "Individual" : "Institutional"}
                </div>
              </Col>
              <Col lg={24} sm={24}>
                <h2>Criteria</h2>
                {data?.criteria?.map((item, idx) => (
                  <p
                    key={idx}
                    style={{
                      color: "#4b5563",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    {"->"} {item?.name ? item?.name : "-"}
                  </p>
                ))}
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header="Supported Documents" key="2">
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
                {data?.document ? (
                  <SupportedDocuments document={data?.document} />
                ) : (
                  <p>No document attached</p>
                )}
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </Spin>
    </Modal>
  );
};

export default ResquestedDetailModel;
