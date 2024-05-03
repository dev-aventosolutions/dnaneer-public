import React, { useState } from "react";
import { getStatement } from "../../services/ApiHandler";
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

const Statement = () => {
  const [loading, setLoading] = useState(false);
  const [generateAccount, setGenerateAccount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleGenerateSearch = async () => {
    try {
      setLoading(true);
      const response = await getStatement(generateAccount, start, end);
      console.log("resporesponseresponsense", response);

      const finalData = response?.statement?.transactions?.map((item) => {
        return {
          key: item?.id,
          date: item?.postDate,
          amount: item?.amount?.amount + " " + item?.amount?.currencyCode,
          beneficiaryName: item?.beneficiaryName
            ? item?.beneficiaryName
            : item?.orderingParty,
          refNum: item?.refNum,
          runningBalance:
            item?.runningBalance?.amount?.toLocaleString() +
            " " +
            item?.runningBalance?.currencyCode,
          partTrnType: item?.partTrnType,
          from: item?.narrative?.narr1,
          to: item?.narrative?.narr3,
        };
      });
      console.log("response", finalData);

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
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "beneficiaryName",
      key: "beneficiaryName",
      align: "center",
    },
    {
      title: "Reference Number",
      dataIndex: "refNum",
      key: "refNum",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Running Balance",
      dataIndex: "runningBalance",
      key: "runningBalance",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "partTrnType",
      key: "partTrnType",
      align: "center",
    },
    {
      title: "Sent From",
      dataIndex: "from",
      key: "from",
      align: "center",
    },
    {
      title: "Recipient",
      dataIndex: "to",
      key: "to",
      align: "center",
    },
  ];
  return (
    <div className="round-div" > 
      <div className="rounded-header">
        <Row justify="center" align="middle">
          <Col>
            <h1>Statement</h1>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex" }}>
            <div className="investor-col-two">
              <div style={{ display: "flex", paddingLeft: "20px",alignItems: 'center' }}>
                <label
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Start:
                </label>
                <input
                  className="select-date"
                  name="start"
                  type="date"
                  onChange={(e) => {
                    setStart(e.target.value);
                  }}
                />
              </div>

              <div style={{ display: "flex", paddingLeft: "20px",alignItems: 'center' }}>
                <label
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  End:
                </label>
                <input
                  className="select-date"
                  name="end"
                  type="date"
                  onChange={(e) => {
                    setEnd(e.target.value);
                  }}
                />
              </div>
              <Input
                className="investor-search-input"
                style={{ display: "flex", marginLeft: "20px" }}
                size="large"
                placeholder="Enter Account Number"
                // eslint-disable-next-line no-undef
                onChange={(e) => {
                  setGenerateAccount(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  handleGenerateSearch();
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
      <Spin spinning={loading}>
        <div className="rounded-body" style={{ marginTop: "25px" }}>
          {console.log(tableData, "kkkk")}
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              position: ["bottomCenter"],
              size: "medium",
              //current: currentPage,
              //onChange: (page) => setCurrentPage(page),
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "15"],
              //showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total}`
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default Statement;
