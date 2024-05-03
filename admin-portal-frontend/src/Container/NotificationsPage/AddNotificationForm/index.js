import React from "react";
import { Button, Form, Input, Select } from "antd";
const { Option } = Select;
const { TextArea } = Input;
const FailOpportunity = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>Add Notification</h1>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter your Title!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter your Description!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item
          name="user"
          label="User"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select User" allowClear>
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FailOpportunity;
