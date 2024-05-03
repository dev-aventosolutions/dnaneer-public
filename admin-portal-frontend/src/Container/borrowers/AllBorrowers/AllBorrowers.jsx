import React, { useState, useEffect } from "react";
import { Pagination, Table, message } from "antd";

import { getBorrowerList } from "../../../services/ApiHandler";
import BorrowersDetail from "./BorrowersDetail";
import "../../../Components/Table/Table.scss";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const AllBorrowers = ({
  handleOk,
  visible,
  handleCancel,
  id,
  flag,
  filteredData,
  page,
  pagination,
  handlePageChange,
  setFlag,
  setId,
  showModal,
}) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Company",
      dataIndex: "cr_name",
      key: "cr_name",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (data) => data[1],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },

    {
      title: "CR Number",
      dataIndex: "cr_number",
      key: "cr_number",
      align: "center",
    },
    {
      title: "Created Date",
      dataIndex: "created_atr",
      key: "created_atr",
      align: "center",
      render: (data) => moment(data).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "kyc_step",
      key: "kyc_step",
      align: "center",
      render: (kyc_step) => (
        <div>
          <div
            className={`${
              kyc_step == 0
                ? "No-KYC-Step-Filled"
                : kyc_step == 1 || kyc_step == 2
                ? "KYC-Filled"
                : kyc_step == 3
                ? "Pending"
                : kyc_step == 4
                ? "Rejected"
                : kyc_step == 5 && "Verified"
            } status-table-tag`}
          >
            {" "}
            <div className={`dot`} />
            {kyc_step == 0
              ? "No KYC Step Filled"
              : kyc_step == 1 || kyc_step == 2
              ? "KYC Filled"
              : kyc_step == 3
              ? "Pending"
              : kyc_step == 4
              ? "Rejected"
              : kyc_step == 5 && "Verified"}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (id) => (
        <div
          onClick={() => {
            setId(id);
            setFlag(!flag);
            showModal();
          }}
        >
          <MoreOutlined />
        </div>
      ),
    },
  ];

  return (
    <div className="g-info">
      <BorrowersDetail
        label={"Borrower Details"}
        visible={visible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        id={id}
        flag={flag}
      />
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          onRow={(record, index) => {
            return {
              onClick: (e) => {
                navigate(`/borrowers/${record.key}`);
              },
            };
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <Pagination
            current={page}
            total={pagination?.total}
            onChange={handlePageChange}
            style={{ alignSelf: "flex-end" }}
            defaultPageSize={15}
          />
        </div>
      </div>
    </div>
  );
};

export default AllBorrowers;
