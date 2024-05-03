import React, { useState, useEffect } from "react";
import {
  Space,
  Avatar,
  Row,
  Col,
  Button,
  Tabs,
  Tag,
  Table,
  Form,
  Radio,
  Input,
  Breadcrumb,
  message,
  Pagination,
} from "antd";
import {
  LeftOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  acceptRequestedBorrower,
  getBorrowerList,
  getRequestedBorrowerList,
} from "../../../services/ApiHandler";
import RequestedBorrowerDetail from "./RequestedBorrowerDetail";

const RequestedBorrowers = ({ setLoading,page,setPage,pagination,setPagination }) => {
  const [borrowerData, setBorrowerData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [id, setId] = useState("");
  const [visible, setVisible] = useState(false);
 

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getRequestedBorrowerList(page);
        if (data) {
          const finalData = data?.data[0]?.data?.map((borrower) => {
            const wathiqInfo = JSON.parse(borrower?.user?.wathq ?? "{}");
            return {
              key: borrower?.id,
              email: borrower?.user?.email ? borrower?.user?.email : "-",
              name: borrower?.user?.name ? borrower?.user?.name : "-",
              cr_number: borrower?.cr_number ? borrower?.cr_number : "-",
              status: borrower?.status ? borrower?.status : "-",
              cr_name: wathiqInfo?.crName,
            };
          });
          setBorrowerData(
            finalData.filter((investor) => {
              const investorData = Object.values(investor)
                .join("")
                .toLowerCase();
              return investorData.includes(searchInput.toLowerCase());
            })
          );
          setPagination(data?.data?.[0]);
        }
      } catch (error) {
        console.log("err", error);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [flag2, page]);

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
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (data) => (
        <div
          className="loan-request-status"
          style={{
            backgroundColor:
              data == "approved"
                ? "#73f085"
                : data == "rejected"
                ? "#f01c1c"
                : "#ffe58f",
          }}
        >
          <div style={{ color: "white", textAlign: "center" }} shape="round">
            {data?.toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (data) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ cursor: "pointer" }}
            className="fund-transfer-button"
            shape="round"
            onClick={() => {
              setId(data);
              setFlag(!flag);
              showModal();
            }}
          >
            View
          </Button>
          {/* <button onClick={rejectCase(key)}>Reject</button> */}
        </div>
      ),
    },
  ];

  const handleOk = async (status, id) => {
    try {
      let body = {
        status,
        request_id: id,
      };
      const { data } = await acceptRequestedBorrower(body);
      if (data) {
        console.log("getInvestorsList---->", data?.data?.[0]?.data);
        setFlag2(!flag2);
        message.success("Request updated successfully");
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setVisible(false);
    }
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  const handlePageChange = (page) => {
    setPage(page);
    // You can make an API call to fetch data for the new page here
  };
  return (
    <div className="g-info">
      <RequestedBorrowerDetail
        label={"Requested Loan Details"}
        visible={visible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        id={id}
        flag={flag}
      />
      <div className="table-responsive">
        <Table columns={columns} dataSource={borrowerData} pagination={false} />
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

export default RequestedBorrowers;
