import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import moment from "moment";
import {
  Row,
  Col,
  Button,
  Tabs,
  Tag,
  Table,
  Select,
  Progress,
  Spin,
  message,
  Space,
  Divider,
} from "antd";
import Layout from "../../sharedModules/defaultLayout";
import Modal from "../../sharedModules/Modal/Modal";
import {
  getOpportunityList,
  getSingleOpportunity,
} from "../../services/ApiHandler";
import CloseOpportunity from "./CloseOpportunity";
import FailOpportunity from "./FailOpportunity";
import { commaSeparator } from "../../utils/Helper";
import { useParams } from "react-router-dom";
import EditOpportunityForm from "../../sharedModules/EditOpportunityForm/EditOpportunityForm";
import SupportedDocuments from "../Investors/RequestedInvestors/SuppportedDocuments";
const { Option } = Select;

const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => `${amount} SAR`,
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => moment(date).format("DD-MM-YYYY"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const installmentColumns = [
  {
    title: "Amount",
    dataIndex: "amount",
    render: (amount) => `SAR ${amount}`,
  },
  {
    title: "Due Date",
    dataIndex: "due_date",
  },
  {
    title: "Principal",
    dataIndex: "principal",
  },
  {
    title: "Interest",
    dataIndex: "interest",
  },
  {
    title: "Fees",
    dataIndex: "fees",
    render: (fees) => `SAR ${fees}`,
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
      </Space>
    ),
  },
];

const Detail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fail, setFail] = useState(false);
  const [loading, setLoading] = useState([]);
  const [opportunityDetail, setOpportunityDetail] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [showEditOpportunityModal, setShowEditOpportunityModal] =
    useState(false);
  const params = useParams();

  console.log("params", params);

  const fetchOppertunityDetail = async () => {
    try {
      setLoading(true);
      const { data } = await getSingleOpportunity(params.id);
      if (data) {
        setOpportunityDetail(data.data[0]);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOppertunityDetail();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setFail(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fund_collect = parseFloat(opportunityDetail?.fund_collected);
    const fund_need = parseFloat(opportunityDetail?.fund_needed);
    const areEqual = fund_collect === fund_need;
    if (areEqual && opportunityDetail?.opportunity_status !== "defaulted") {
      setShowButton(true);
    }
  }, [opportunityDetail?.fund_collected, opportunityDetail?.fund_needed]);

  return (
    <div>
      <Spin spinning={loading}>
        <Layout sideKey="1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Details</h1>
            <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
              <Select
                style={{
                  width: "300px",
                }}
                popupMatchSelectWidth={360}
                value={"View Attached Documents"}
              >
                {opportunityDetail?.documents.map((document) => (
                  <Option>
                    <SupportedDocuments document={document} />
                  </Option>
                ))}
              </Select>

              <Button
                type="gray"
                shape="round"
                size={"middle"}
                onClick={() => setShowEditOpportunityModal(true)}
              >
                Edit Opportunity
              </Button>
            </div>
          </div>
          <Modal
            width={1200}
            centered
            className="logout-modal"
            isModalVisible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            {fail ? (
              <FailOpportunity
                setIsModalOpen={setIsModalOpen}
                setLoading={setLoading}
              />
            ) : (
              <CloseOpportunity
                setIsModalOpen={setIsModalOpen}
                setLoading={setLoading}
                totalAmount={opportunityDetail?.fund_needed}
                opportunityDetail={opportunityDetail}
              />
            )}
          </Modal>
          <Modal
            width={900}
            centered
            className="logout-modal"
            isModalVisible={showEditOpportunityModal}
            onOk={() => {
              setShowEditOpportunityModal(false);
            }}
            onCancel={() => {
              setShowEditOpportunityModal(false);
            }}
            footer={false}
          >
            <EditOpportunityForm
              setIsModalOpen={setShowEditOpportunityModal}
              data={opportunityDetail}
              updateHandler={() => fetchOppertunityDetail()}
            />
          </Modal>

          {opportunityDetail && (
            <>
              <div className="card-info">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontWeight: "700" }}>
                    #{opportunityDetail.opportunity_number}
                  </h3>
                  <h5
                    style={{
                      marginLeft: "10px",
                      fontWeight: "500",
                      color: "#8A8595",
                    }}
                  >
                    {opportunityDetail.industry_name}
                  </h5>
                </div>
                <div style={{ display: "flex" }}>
                  <Tag>{opportunityDetail.duration} months</Tag>
                  <Tag>
                    Creation date:{" "}
                    {moment(opportunityDetail.custom_created_at?.split("T")[0]).format(
                      "DD-MM-YYYY"
                    )}
                  </Tag>
                  <Tag>Annual ROI {" " + opportunityDetail.annual_roi}%</Tag>
                  <Tag>
                    Due Date:{" "}
                    {moment(opportunityDetail?.due_date).format("DD-MM-YYYY")}
                  </Tag>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "31px 0 12px 0",
                  }}
                >
                  <div>
                    <div style={{ color: "#5B2CD3" }}>
                      <span
                        style={{
                          fontSize: "18px",
                          color: "#5B2CD3",
                          fontWeight: "700",
                        }}
                      >
                        {commaSeparator(opportunityDetail.fund_collected)}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          marginLeft: "5px",
                          fontWeight: "500",
                        }}
                      >
                        SAR
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#8A8595",
                        fontWeight: "500",
                      }}
                    >
                      {(
                        (opportunityDetail.fund_collected /
                          opportunityDetail.fund_needed) *
                        100
                      ).toFixed(2)}
                      % Collected
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "15px",
                          marginLeft: "5px",
                          fontWeight: "800",
                        }}
                      >
                        {commaSeparator(opportunityDetail.fund_needed)}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          marginLeft: "5px",
                          fontWeight: "500",
                        }}
                      >
                        SAR
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#8A8595",
                        fontWeight: "500",
                      }}
                    >
                      Fund Needed
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <Progress
                    strokeColor="#5B2CD3"
                    //   type=""

                    percent={(
                      (opportunityDetail.fund_collected /
                        opportunityDetail.fund_needed) *
                      100
                    ).toFixed(2)}
                    showInfo={false}
                    //   size={[600,15]}
                  />
                  <p style={{ marginTop: 2 }}>100.00%</p>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                {showButton ? (
                  <>
                    <Button
                      onClick={showModal}
                      type="primary"
                      style={{
                        margin: "0 20px",
                        background: "#37b337",
                        fontWeight: "700",
                      }}
                    >
                      {" "}
                      Create Loan
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        setFail(true);
                        setIsModalOpen(true);
                        setLoading(true);
                      }}
                      style={{
                        margin: "0 20px",
                        background: "#f04040",
                        fontWeight: "700",
                      }}
                    >
                      Cancel Opportunity
                    </Button>
                  </>
                ) : null}
              </div>
              <Divider />
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: "Opportunity Investors",
                    key: "1",
                    children: (
                      <Table
                        size="small"
                        columns={columns}
                        pagination={false}
                        dataSource={opportunityDetail.investments}
                      />
                    ),
                  },
                  {
                    label: "Installments",
                    key: "2",
                    children: (
                      <Table
                        size="small"
                        columns={installmentColumns}
                        pagination={false}
                        dataSource={opportunityDetail.installments}
                      />
                    ),
                  },
                ]}
              />
            </>
          )}
        </Layout>
      </Spin>
    </div>
  );
};

export default Detail;
