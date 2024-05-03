import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Modal, Spin } from "antd";
import { rejectOpportunity } from "../../services/ApiHandler";
import { CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const RejectCase = ({
  label,
  visible,
  handleCancel,
  handleOk,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Success:", values);
    handleOk(values?.reason)
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    form.setFieldsValue({
      reason: '',
    });
  }, [visible])

  return (
    <Modal
      className="logout-modal"
      open={visible}
      onCancel={handleCancel}
      centered
      width={1200}
      footer={false}
      closeIcon={<CloseOutlined />}
    >
      {/* <Spin spinning={loading}> */}
      <h1>{label}</h1>
      <Form
        form={form}
        name="basic"
        initialValues={{
          reason: "",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Reason"
          name="reason"
          rules={[
            {
              required: true,
              message: "Please enter your reason!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Reason" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* </Spin> */}
    </Modal>
  );
};

export default RejectCase;
