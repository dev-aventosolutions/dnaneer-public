import React, { useState, useEffect } from "react";

import { Row, Col, Button, Form, Input, message, Spin } from "antd";
import axios from "axios";

const AdvisorForm = ({ setIsModalOpen, getFinacialAdvisors }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    console.log("Success:", values);
    if (!selectedFile) {
      return message.error("Please upload image");
    }
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const baseUrl = process.env.REACT_APP_baseURL;
    const file = selectedFile;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone_no", values.phone);
    formData.append("whatsapp_no", values.whatsapp);
    formData.append("image", file);
    console.log("formData", formData);

    try {
      const response = await axios.post(
        `${baseUrl}api/admin/create_advisor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        console.log("response", response);
        message.success(response?.message);
        getFinacialAdvisors();
        setLoading(false);

        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);

      console.error(error);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFileChange = async (event) => {
    console.log("event.target.files[0]", event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h1>Add Advisor </h1>
      <Spin spinning={loading}>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone num"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your Phone num!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Whatsapp  num"
            name="whatsapp"
            rules={[
              {
                required: true,
                message: "Please input your Whatsapp  num!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Profile Image" name="profile">
            <input type="file" onChange={onFileChange} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default AdvisorForm;
