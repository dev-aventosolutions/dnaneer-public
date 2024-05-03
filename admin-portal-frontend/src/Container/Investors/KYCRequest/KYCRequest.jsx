import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table/Table";
import {
  Checkbox,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Spin,
  message,
  Modal,
} from "antd";
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";

import {
  createKYCRequest,
  getInvestorsList,
  getKYCRequestedList,
  getRequestedList,
} from "../../../services/ApiHandler";
import KYCDetailModel from "./KYCDetailModel.js";
import { MoreOutlined } from "@ant-design/icons";
import RejectCase from "./RejectCase";
import axiosInstance from "../../../services/instance";
const { Link } = Typography;

const KYCRequest = ({ fetchInvestorsList }) => {
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [investorsData, setInvestorsData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [rejectKycVisible, setRejectKycVisible] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getKYCRequestedList();
        if (data) {
          console.log("getInvestorsList", data.data[0]);
          const finalData = data.data[0].map((investor) => {
            return {
              key: [investor.id, investor.user_type],
              date: investor?.created_at.split("T")[0],
              email: [investor.user_id, investor.email],
              type: investor.user_type === 1 ? "Individual" : "Institutional",
              criteria: investor?.criteria,
              poa_agreement: investor?.poa_agreement,
              // action: "",
            };
          });
          console.log("final Data", finalData);
          setInvestorsData(finalData);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [flag2]);

  // };
  const showModal = (key) => {
    setId(key[0]);
    setType(key[1]);
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleRejectModalCancel = () => {
    setRejectKycVisible(false);
  };
  const handleRejectReasonCancel = () => {
    setVisible(false);
    setRejectKycVisible(true);
  };

  const handleRejectionSumbit = (reason) => {
    createKYCRequest({ status: "rejected", user_id: id, reject_note: reason })
      .then((res) => {
        message.success("Updated Successfully");
        setFlag2(!flag2);
        setLoading(false);
        setRejectKycVisible(false);
      })
      .catch((error) => {
        message.error("Something went wrong");
        setLoading(false);
        setRejectKycVisible(false);
      });
  };
  const columns = [
    { title: "Date", dataIndex: "date", key: "date", align: "left" },
    {
      title: "Email",
      dataIndex: "email",
      key: "name",
      align: "left",
      // sorter: (a, b) => a.name.length - b.name.length,
      render: (name) => <b>{name[1]}</b>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => (
        <div>
          <div className={`${type}-table-tag`}>
            {" "}
            <div className={`${type}-dot-tag dot`} />
            {type}
          </div>
        </div>
      ),
    },
    {
      title: "POA Agreement",
      dataIndex: "poa_agreement",
      key: "poa_agreement",
      align: "center",
      render: (doc) => (
        <div>
          {doc && (
            <a
              href={doc}
              download={"POA-Agreement.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => console.log("doc", doc)}
            >
              Download PDF
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "action",
      align: "center",
      render: (key) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ cursor: "pointer" }}
            className="fund-check-button"
            shape="round"
            onClick={() => {
              showModal(key);
              setFlag(!flag);
            }}
          >
            View
          </Button>
          {/* <button onClick={rejectCase(key)}>Reject</button> */}
        </div>
      ),
    },
  ];

  const filteredData = investorsData?.filter((investor) => {
    const investorData = Object.values(investor).join("").toLowerCase();
    return investorData.includes(searchInput.toLowerCase());
  });

  return (
    <div className="investors-table">
      <Spin spinning={loading}>
        <KYCDetailModel
          visible={visible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          rejection={handleRejectReasonCancel}
          flag={flag}
          id={id}
          type={type}
          setFlag2={setFlag2}
          flag2={flag2}
          fetchInvestorsList={fetchInvestorsList}
        />
        <RejectCase
          visible={rejectKycVisible}
          handleOk={handleRejectionSumbit}
          handleCancel={handleRejectModalCancel}
          label={"Add a reason of rejection"}
        />
        <Row>
          <Col lg={12}>
            <h1>Filters</h1>
          </Col>
          <Col lg={11}>
            <div className="investor-col-two" style={{ marginTop: 18 }}>
              <Input
                className="investor-search-input"
                size="large"
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredData}
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
          // onRow={(record) => ({
          //   onClick: (e) => {
          //     /* Call some endPoint to log this click event */
          //     console.log(`user clicked on row ${record.t1}!`);
          //   },
          // })}
        />
      </Spin>
    </div>
  );
};

export default KYCRequest;
