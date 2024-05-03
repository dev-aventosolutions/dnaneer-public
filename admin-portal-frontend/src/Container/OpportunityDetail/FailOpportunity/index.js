import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { rejectOpportunity } from "../../../services/ApiHandler";
const { TextArea } = Input;
const FailOpportunity = ({ setIsModalOpen, setLoading }) => {
  let navigate = useNavigate();
  const params = useParams();
  const onFinish = (values) => {
    rejectOpportunity({ status:"rejected",reason: values.reason, opportunity_id: params.id, })
    setIsModalOpen(false)
    setLoading(false)
    navigate("/")
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoading(false)
  };

  return (
    <div>
      <h1>Cancel Opportunity</h1>
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
    </div>
  );
};

export default FailOpportunity;
