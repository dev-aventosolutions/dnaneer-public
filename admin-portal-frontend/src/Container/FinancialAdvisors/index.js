import React, { useState, useEffect } from "react";
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
import Modal from "../../sharedModules/Modal/Modal";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import {
  getAdvisorsList,
  deleteAdvisor,
  getAdvisor,
  exportAdvisorsList,
} from "../../services/ApiHandler";
import Layout from "../../sharedModules/defaultLayout";
import AdvisorForm from "./AdvisorForm";
import EditAdvisor from "./AdvisorForm/EditAdvisor";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [edit, setEdit] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const exportList = async () => {
    try {
      setExportLoading(true);
      const response = await exportAdvisorsList({
        page_no: currentPage,
        per_page: 15,
      });
      const link = document.createElement("a");
      link.href = response?.data?.data;
      link.target = "_blank";
      link.download = "exported-file.pdf"; // Set a default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("exportListError", response);
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      console.log("exportListError", error);
      message.error("something went wrong");
    }
  };
  const getFinacialAdvisors = async () => {
    try {
      setLoading(true);
      const { data } = await getAdvisorsList();
      const baseUrl = process.env.REACT_APP_baseURL;
      if (data) {
        console.log("getAdvisorsList", data.data[0]);
        const finalData = data.data[0].map((advisor) => {
          return {
            key: advisor.id,
            date: advisor.created_at.split("T")[0],
            email: advisor.email,
            image: `${baseUrl}${advisor.image}`,
            name: advisor.name,
            phone: advisor.phone_no,
            whatsApp: advisor.whatsapp_no,
            action: advisor.id,
          };
        });

        setTableData(finalData);
        // setCurrentPage(data.);
        // setInvestorsData()
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFinacialAdvisors();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    console.log("hadle ok");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalOpen(false);
    setInitialValues({});
    setEdit(false);
  };

  const deleteUserHandler = async (id) => {
    try {
      setLoading(true);
      const { data } = await deleteAdvisor(id);
      if (data) {
        console.log("deleteAdvisor", data);
        window.location.reload();
        message.success(data.message);
        // setInvestorsData()
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const editAdvisorHandler = async (id) => {
    setEdit(true);
    try {
      setLoading(true);
      const { data } = await getAdvisor(id);
      if (data) {
        console.log("getAdvisor", data.data[0]);
        const advisor = data.data[0];
        setInitialValues({
          email: advisor.email,
          id: advisor.id,
          name: advisor.name,
          phone: advisor.phone_no,
          whatsapp: advisor.whatsapp_no,
        });
        setIsModalOpen(true);
      }
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (id) => (
        <>
          <Popover
            placement="bottomLeft"
            content={
              <div className="action-content">
                <>
                  <div
                    className="action"
                    onClick={() => deleteUserHandler(id)}
                    style={{ cursor: "pointer" }}
                  >
                    <DeleteOutlined />
                    <b style={{ paddingLeft: "7px" }}>Delete</b>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    className="action"
                    onClick={() => editAdvisorHandler(id)}
                  >
                    <EditOutlined />
                    <b style={{ paddingLeft: "7px" }}> Edit Advisor</b>
                  </div>
                </>
              </div>
            }
            title={false}
            trigger="click"
            //   open={open}
            //   onOpenChange={handleOpenChange}
          >
            <div className="">
              <MoreOutlined />
            </div>
          </Popover>
        </>
      ),
    },
  ];

  return (
    <Layout sideKey="6">
      <Spin spinning={loading}>
        <Modal
          width={900}
          centered
          className="logout-modal"
          isModalVisible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
        >
          {edit ? (
            <EditAdvisor
              initialValues={initialValues}
              setIsModalOpen={setIsModalOpen}
              getFinacialAdvisors={getFinacialAdvisors}
            />
          ) : (
            <AdvisorForm
              initialValues={initialValues}
              setIsModalOpen={setIsModalOpen}
              getFinacialAdvisors={getFinacialAdvisors}
            />
          )}
        </Modal>
        <div className="round-div">
          <div className="rounded-header">
            <Row justify="space-between" align="middle">
              <Col>
                <h2>Financial Advisors</h2>
              </Col>
              <Col>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    type="gray"
                    shape="round"
                    style={{ marginRight: "15px" }}
                    onClick={showModal}
                  >
                    Add Financial Advisor
                  </Button>
                  <Button loading={exportLoading} onClick={exportList} type="gray" shape="round">
                    Export
                  </Button>
                </div>
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
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                defaultPageSize: 15,
                // total: total,
              }}
            />
          </div>
        </div>
      </Spin>
    </Layout>
  );
};

export default Home;
