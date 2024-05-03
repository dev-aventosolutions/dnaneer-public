import React, { useState } from "react";
import Table from "../../../../Components/Table/Table";
import { Checkbox, Row, Col, Input, Button } from "antd";
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import Modal from "../../../../Components/Modal/Modal";

import { MoreOutlined } from "@ant-design/icons";

const Transfers = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    console.log("showModal");
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log("handleOk", handleOk);
    localStorage.removeItem("institutional");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "",
      dataIndex: "check",
      key: "check",
      align: "center",
      render: (text) => (
        <div>
          <Checkbox />
        </div>
      ),
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "IBAN Number",
      dataIndex: "iban",
      key: "iban",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Amount Requested",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      // render: (type) => (
      //   <div>
      //     <p className={`${type}-table-tag`}>
      //       {" "}
      //       <div className={`${type}-dot-tag dot`} />
      //       {type}
      //     </p>
      //   </div>
      // ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <div>
          <p className={`${status} status-table-tag`}>
            {" "}
            <div className={`dot`} />
            {status}
          </p>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (type) => (
        <div
          onClick={showModal}
          style={{cursor: "pointer" }}
        >
        <MoreOutlined />
        </div>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      check: "",
      bankName: "ANB",
      iban: "SA - 2434545646563846",
      date: "12 May 2023",
      amount: "200,000 (SAR)",
      status: "Verified",
      action: "afsdfsdaf",
    },
    {
      key: "2",
      check: "",
      bankName: "ANB",
      iban: "SA - 2434545646563846",
      date: "12 May 2023",
      amount: "200,000 (SAR)",
      status: "Rejected",
      action: "",
    },
    {
      key: "3",
      check: "",
      bankName: "ANB",
      iban: "SA - 2434545646563846",
      date: "12 May 2023",
      amount: "200,000 (SAR)",
      status: "Inactive",
      action: "",
    },
  ];
  return (
    <div>
      <Modal
        centered
        className="transfer-modal"
        isModalVisible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={800}
      >
        <h1>Transfer Request</h1>

        <Row gutter={[32, 32]}>
          <Col lg={6}>
            <label>Bank Name</label>
            <h2>ANB</h2>
          </Col>
          <Col lg={6}>
            <label>IBAN Number</label>
            <h2>SA-224354656757</h2>
          </Col>
          <Col lg={6}>
            <label>Amount Requested</label>
            <h2>200,000 (SAR)</h2>
          </Col>
          <Col lg={6}>
            <label>Date</label>
            <h2>12 May 2023</h2>
          </Col>
        </Row>
        <div className="footer-btns">
          <p className="cancel" onClick={() => handleCancel()}>
            Decline
          </p>
          <Button onClick={handleOk} block className="decline-btn">
            Decline
          </Button>
        </div>
      </Modal>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ["bottomCenter"],
          size: "medium",
          //current: currentPage,
          //onChange: (page) => setCurrentPage(page),
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
          //showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total}`
        }}
        bordered={true}
      />
    </div>
  );
};

export default Transfers;
