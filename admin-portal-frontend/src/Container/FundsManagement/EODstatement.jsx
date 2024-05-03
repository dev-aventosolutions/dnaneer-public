import React, { useState } from "react";
import { getEODStatement } from "../../services/ApiHandler";
import {
  Space,
  Avatar,
  Row,
  Col,
  Button,
  message,
  Tag,
  Table,
  Form,
  Spin,
  Popover,
  Input,
  Breadcrumb,
} from "antd";

const EODstatement = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [date, setDate] = useState("");
  const [account, setAccount] = useState("");


  const getStatement = async () => {
    try {
      const response = await getEODStatement(date);
      console.log("response", response);
      const finalData = response?.data[0]?.map((advisor) => {
        return {
          key: advisor.id,
          date: advisor.created_at.split("T")[0],
          email: advisor.email,
          name: advisor.name,
          phone: advisor.phone_no,
          whatsApp: advisor.whatsapp_no,
          action: advisor.id,
        };
      });

      setTableData(finalData);
      // message.success(response?.data?.message);
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "WhatsApp",
      dataIndex: "whatsApp",
      key: "whatsApp",
      align: "center",
    },
    {
      title: "Image",
      key: "image",
      align: "center",
      dataIndex: "image",
      render: (url) => (
        <>
          <Avatar src={<img src={url} alt="avatar" />} />
        </>
      ),
    },
  ];
  return (
    <div className="round-div">
      <div className="rounded-header">
        <Row justify="center" align="middle">
          <Col>
            <h1>EOD Statement</h1>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex" }}>
            <div className="investor-col-two">
              <div style={{ display: "flex" }}>
                <label>Date:</label>
                <input
                  name="date"
                  type="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
              <Input
                className="investor-search-input"
                size="large"
                placeholder="Enter Account Number"
                // eslint-disable-next-line no-undef
                onChange={(e) => {
                    setAccount(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                    getStatement();
                  setLoading(true);
                }}
                // icon={<SearchOutlined />}
                className="fund-search-button"
                shape="round"
              >
                Generate
              </Button>
              {/* <input name="" type="date"/> */}
            </div>
          </Col>
          <Col>
            <Button className="fund-check-button" shape="round">
              Export
            </Button>
          </Col>
        </Row>
      </div>

      <div className="rounded-body" style={{ marginTop: "50px" }}>
        <Table
          columns={columns}
          dataSource={tableData}
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
        />
      </div>
    </div>
  );
};

export default EODstatement;
