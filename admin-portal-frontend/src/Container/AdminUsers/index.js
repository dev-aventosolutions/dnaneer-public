import React, { useState, useEffect } from "react";
import "./adminUser.scss";
import Table from "../../Components/Table/Table";
import Layout from "../../sharedModules/defaultLayout";
import Modal from "../../sharedModules/Modal/Modal";
import {
  Row,
  Col,
  Button,
  Avatar,
  Form,
  Spin,
  Input,
  Select,
  message,
} from "antd";
import { createAdminUser, getAdminUser } from "../../services/ApiHandler";

import {
  SearchOutlined,
  CloudDownloadOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { MoreOutlined } from "@ant-design/icons";
const { Option } = Select;
const Admin = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getAdminUser();
        const baseUrl = process.env.REACT_APP_baseURL;
        if (data) {
          console.log(data?.data?.[0]);

          const finalData = data?.data?.[0]?.map((user) => {
            return {
              key: user?.id,
              date: user?.created_at ? user?.created_at?.split("T")[0] : "-",
              email: user?.email,
              image: `${baseUrl}${user?.image}`,
              name: user?.name ? user?.name : "-",
              phone: user?.phone_no ? user?.phone_no : "-",
              type: user?.user_type,
              // action: user.id,
            };
          });
          console.log(finalData, "finalDatafinalData");
          setTableData(finalData);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, [flag]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    // {
    //   title: " ",
    //   dataIndex: "check",
    //   key: "check",
    //   align: "center",
    //   render: (text) => (
    //     <div>
    //       <Checkbox />
    //     </div>
    //   ),
    // },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (src) => {
        return src === "" ? (
          <Avatar
            style={{
              backgroundColor: "#87d068",
            }}
            icon={<UserOutlined />}
          />
        ) : (
          <Avatar size={34} src={<img src={src} alt="avatar" />} />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text) => <b>{text}</b>,
    },

    {
      title: "Creation Date",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => (
        <div>
          <div className={`${type}-table-tag`}>
            <div className={`${type}-dot-tag dot`} />
            {type}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (type) => (
        <div>
          <MoreOutlined />
        </div>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      check: "",
      name: "Magdi Moussa",
      image: "/assets/images/Mask Group.png",
      email: "magdi@dnaneer.com",
      date: "12 May 2023",
      type: "Admin",
      action: "",
    },
    {
      key: "2",
      check: "",
      name: "Bold text column",
      image: "",
      email: "magdi@dnaneer.com",
      date: "12 May 2023",
      type: "Super Admin",
      action: "",
    },
  ];

  const onFinish = (values) => {
    createAdminUser(values)
      .then((res) => {
        setIsModalOpen(false);
        setFlag(!flag);
        message.success(res?.data?.message);
      })
      .catch((err) => {});
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout sideKey="5">
      <Spin spinning={loading}>
        <div className="admin-users-container">
          <h1>Admin Users</h1>
          <Modal
            width={900}
            centered
            className="logout-modal"
            isModalVisible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            <h1>Add Admin User</h1>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              initialValues={{
                email: "",
                name: "",
                password: "",
              }}
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    type: "name",
                    message: "Please enter your name",
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("The passwords do not match!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              {/* <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select  role!",
                  },
                ]}
              >
                <Select placeholder="Select Role" allowClear>
                  <Option value="admin">Admin </Option>
                  <Option value="Super Admin">Super Admin </Option>
                </Select>
              </Form.Item> */}

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Row>
            <Col lg={12}>
              <Button
                icon={<PlusOutlined />}
                className="add-btn"
                onClick={showModal}
              >
                ADD NEW
              </Button>
            </Col>
            <Col lg={11}>
              <div className="investor-col-two">
                <Input
                  className="investor-search-input"
                  size="large"
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                />
                <Button icon={<CloudDownloadOutlined />} className="export-btn">
                  Export
                </Button>
              </div>
            </Col>
          </Row>
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
            bordered={true}
          />
        </div>
      </Spin>
    </Layout>
  );
};

export default Admin;
