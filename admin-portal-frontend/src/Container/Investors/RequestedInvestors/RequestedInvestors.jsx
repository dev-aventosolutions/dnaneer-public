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
  Tabs,
} from "antd";
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import {
  createVipRequest,
  getInvestorsList,
  getRequestedList,
} from "../../../services/ApiHandler";

import { MoreOutlined } from "@ant-design/icons";
import ResquestedDetailModel from "./ResquestedDetailModel";
import RejectCase from "./RejectCase";
const { Link } = Typography;
const RequestedInvestors = () => {
  const [loading, setLoading] = useState(false);
  const [investorsData, setInvestorsData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [rejectKycVisible, setRejectKycVisible] = useState(false);
  const [id, setId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [data, setData] = useState("");
  const [key, setKey] = useState("");
  const getInvestorsList = async () => {
    try {
      setLoading(true);
      const { data } = await getRequestedList();
      if (data) {
        console.log("getInvestorsList", data.data[0]);
        const finalData = data?.data[0]?.map((investor) => {
          return {
            key: investor.id,
            email: [investor.user_id, investor.email],
            type: investor.user_type === 1 ? "Individual" : "Institutional",
            criteria: investor?.criteria,
            doc: investor?.document,
            data: investor,
            // action: "",
          };
        });
        const Individuals = finalData?.filter(
          (investor) => investor?.type !== "Institutional"
        );
        setInvestorsData(Individuals);
        setFilteredData(Individuals);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      // message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getInvestorsList();
  }, []);

  const approvedCase = async () => {
    try {
      setLoading(true);
      await createVipRequest({ status: "approved", user_id: id });
      await getInvestorsList();
      message.success("Updated Successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const showModal = (key) => {
    setKey(key);
    setVisible(true);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Filter the data based on the search value
    const filtered = investorsData.filter((item) => {
      // Convert all data values to lowercase for case-insensitive search
      return Object.values(item).some((val) =>
        val?.toString()?.toLowerCase()?.includes(value.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
      // sorter: (a, b) => a.name.length - b.name.length,
      render: (email) => <b>{email[1]}</b>,
    },
    // {
    //   title: "Criteria",
    //   dataIndex: "criteria",
    //   key: "criteria",
    //   align: "center",
    //   render: (criteria) => (
    //     <div>
    //       {criteria?.map((criteria) => (
    //         <div>{criteria?.name ? criteria?.name : "-"}</div>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: "Supporting Document",
      dataIndex: "doc",
      key: "doc",
      align: "center",
      render: (document) =>
        document ? (
          <div>
            <a
              href={`${process.env.REACT_APP_baseURL}${document}`}
              download={"document.pdf"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      dataIndex: "data",
      key: "data",
      align: "center",
      render: (data) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ cursor: "pointer" }}
            className="fund-check-button"
            shape="round"
            onClick={() => {
              showModal(key);
              setData(data);
              setId(data.user_id);
              setFlag(!flag);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];
  const handleOk = async () => {
    await approvedCase();
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleRejectionSumbit = async (reason) => {
    createVipRequest({ status: "rejected", user_id: id, reject_note: reason })
      .then((res) => {
        message.success("Updated Successfully");
        getInvestorsList();
        setLoading(false);
        setRejectKycVisible(false);
      })
      .catch((error) => {
        message.error("Something went wrong");
        setLoading(false);
        setRejectKycVisible(false);
      });
  };
  const handleRejectModalCancel = () => {
    setRejectKycVisible(false);
  };
  const handleRejectReasonCancel = () => {
    setVisible(false);
    setRejectKycVisible(true);
  };
  return (
    <div className="rounded-body">
      <div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "All",
              key: "1",
              children: (
                <>
                  <div className="investors-table">
                    <Row>
                      <Col lg={12}>
                        <h1>Filters</h1>
                      </Col>
                      <Col lg={11}>
                        <div
                          className="investor-col-two"
                          style={{ marginTop: "10px" }}
                        >
                          <Input
                            className="investor-search-input"
                            size="large"
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            value={searchValue}
                            onChange={handleSearch}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Spin spinning={loading}>
                      <ResquestedDetailModel
                        label={"Investor Details"}
                        visible={visible}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        rejection={handleRejectReasonCancel}
                        flag={flag}
                        data={data}
                        loading={loading}
                      />
                      <RejectCase
                        visible={rejectKycVisible}
                        handleOk={handleRejectionSumbit}
                        handleCancel={handleRejectModalCancel}
                        label={"Add a reason of rejection"}
                      />
                      <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "medium",
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "30"],
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
                  </div>
                </>
              ),
            },
            {
              label: "Pending",
              key: "2",
              children: (
                <>
                  <div className="investors-table">
                    <Row>
                      <Col lg={12}>
                        <h1>Filters</h1>
                      </Col>
                      <Col lg={11}>
                        <div
                          className="investor-col-two"
                          style={{ marginTop: "10px" }}
                        >
                          <Input
                            className="investor-search-input"
                            size="large"
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            value={searchValue}
                            onChange={handleSearch}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Spin spinning={loading}>
                      <ResquestedDetailModel
                        label={"Investor Details"}
                        visible={visible}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        rejection={handleRejectReasonCancel}
                        flag={flag}
                        data={data}
                        loading={loading}
                      />
                      <RejectCase
                        visible={rejectKycVisible}
                        handleOk={handleRejectionSumbit}
                        handleCancel={handleRejectModalCancel}
                        label={"Add a reason of rejection"}
                      />
                      <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "medium",
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "30"],
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
                  </div>
                </>
              ),
            },
            {
              label: "Accepted",
              key: "3",
              children: (
                <>
                  <div className="investors-table">
                    <Row>
                      <Col lg={12}>
                        <h1>Filters</h1>
                      </Col>
                      <Col lg={11}>
                        <div
                          className="investor-col-two"
                          style={{ marginTop: "10px" }}
                        >
                          <Input
                            className="investor-search-input"
                            size="large"
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            value={searchValue}
                            onChange={handleSearch}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Spin spinning={loading}>
                      <ResquestedDetailModel
                        label={"Investor Details"}
                        visible={visible}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        rejection={handleRejectReasonCancel}
                        flag={flag}
                        data={data}
                        loading={loading}
                      />
                      <RejectCase
                        visible={rejectKycVisible}
                        handleOk={handleRejectionSumbit}
                        handleCancel={handleRejectModalCancel}
                        label={"Add a reason of rejection"}
                      />
                      <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "medium",
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "30"],
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
                  </div>
                </>
              ),
            },
            {
              label: "Rejected",
              key: "4",
              children: (
                <>
                  <div className="investors-table">
                    <Row>
                      <Col lg={12}>
                        <h1>Filters</h1>
                      </Col>
                      <Col lg={11}>
                        <div
                          className="investor-col-two"
                          style={{ marginTop: "10px" }}
                        >
                          <Input
                            className="investor-search-input"
                            size="large"
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            value={searchValue}
                            onChange={handleSearch}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Spin spinning={loading}>
                      <ResquestedDetailModel
                        label={"Investor Details"}
                        visible={visible}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        rejection={handleRejectReasonCancel}
                        flag={flag}
                        data={data}
                        loading={loading}
                      />
                      <RejectCase
                        visible={rejectKycVisible}
                        handleOk={handleRejectionSumbit}
                        handleCancel={handleRejectModalCancel}
                        label={"Add a reason of rejection"}
                      />
                      <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                          position: ["bottomCenter"],
                          size: "medium",
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "30"],
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
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RequestedInvestors;
