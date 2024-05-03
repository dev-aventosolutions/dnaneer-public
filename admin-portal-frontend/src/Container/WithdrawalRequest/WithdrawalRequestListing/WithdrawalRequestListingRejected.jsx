import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Spin, message } from "antd";
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import Layout from "../../../sharedModules/defaultLayout";
import { Link, useParams } from "react-router-dom";
import {
  accpetFundRequest,
  createKYCRequest,
  getInvestorsList,
  getWithdrawalRequestListing,
} from "../../../services/ApiHandler";
import Table from "../../../Components/Table/Table";
import RejectCase from "../RejectCase";
import WithdrawalRequestModalIndividual from "../WithdrawalRequestModalIndividual";

const WithdrawalRequestListingRejected = ({ request }) => {
  const { status } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [transferData, setTransferData] = useState([]);
  const [rejectKycVisible, setRejectKycVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getWithdrawalRequestListing("rejected");
        if (data) {
          console.log("getInvestorsList---->", data.data[0]);
          const finalData = data.data[0].map((investor) => {
            return {
              data: investor,
              key: [investor?.id, investor?.user_type],
              // email: [investor?.user_id, investor?.email],
              iban: investor?.personal_iban_number,
              bank: investor?.bank_name,
              amount: investor?.amount,
              email: investor?.email,
              mode: investor?.mode,
              name: investor?.user_name ? investor?.user_name : "-",
              date: investor?.created_at
                ? investor?.created_at?.split("T")[0]
                : "-",
              type: investor?.user_type === 1 ? "Individual" : "Institutional",
              // mode: investor?.mode.toUpperCase(),
              // action: "",
            };
          });
          console.log("final Data", finalData);
          setTransferData(finalData);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [request]);

  const showModal = (key) => {
    setData(key);
    setId(key?.id);
    setType(key?.type);
    setVisible(true);
  }

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
    accpetFundRequest({ status: "rejected", id: id, reject_note: reason })
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
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Requested By",
      dataIndex: "name",
      key: "name",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
      //   render: (name) => (
      //     <b>
      //       <Link href={`/investors/${name[0]}`} style={{ color: "black" }}>
      //         {name[1]}
      //       </Link>
      //     </b>
      //   ),
    },
    {
      title: "Investor Type",
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
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      align: "center",
      //   render: (type) => (
      //     <div>
      //       <div className={`${type}-table-tag`}>
      //         {" "}
      //         <div className={`${type}-dot-tag dot`} />
      //         {type}
      //       </div>
      //     </div>
      //   ),
    },
    {
      title: "Bank name",
      dataIndex: "bank",
      key: "bank",
      align: "center",
      //   render: (type) => (
      //     <div>
      //       <div className={`${type}-table-tag`}>
      //         {" "}
      //         <div className={`${type}-dot-tag dot`} />
      //         {type}
      //       </div>
      //     </div>
      //   ),
    },
    {
      title: "IBAN Account #",
      dataIndex: "iban",
      key: "iban",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      //   render: (type) => (
      //     <div>
      //       <div className={`${type}-table-tag`}>
      //         {" "}
      //         <div className={`${type}-dot-tag dot`} />
      //         {type}
      //       </div>
      //     </div>
      //   ),
    },
    {
      title: "Action",
      dataIndex: "data",
      key: "action",
      align: "center",
      render: (key) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ cursor: "pointer" }}
            className="fund-transfer-button"
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

  const filteredData = transferData?.filter((transfers) => {
    const data = Object.values(transfers).join("").toLowerCase();
    return data.includes(searchInput.toLowerCase());
  });

  return (
    <Spin spinning={loading}>
      <WithdrawalRequestModalIndividual
        visible={visible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        rejection={handleRejectReasonCancel}
        flag={flag}
        id={id}
        type={type}
        setFlag2={setFlag2}
        flag2={flag2}
        request={request}
      />
      <RejectCase
        visible={rejectKycVisible}
        handleOk={handleRejectionSumbit}
        handleCancel={handleRejectModalCancel}
        label={"Add a reason of rejection"}
      />
      <Row>
        <Col lg={12}>
          <h1>Withdrawal Request</h1>
        </Col>
        <Col lg={11}>
          <div className="investor-col-two">
            <Input
              className="investor-search-input"
              size="large"
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button icon={<CloudDownloadOutlined />} className="export-btn">
              Export
            </Button>
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
        onRow={(record) => ({
          onClick: (e) => {
            /* Call some endPoint to log this click event */
            console.log(`user clicked on row ${record.t1}!`);
          },
        })}
      />
    </Spin>
  );
};

export default WithdrawalRequestListingRejected;
