import { Button } from "antd";

const AuthButton = ({ name, htmlType,loading=false }) => {
  return (
    <Button
      block
      type="primary"
      shape="round"
      htmlType={htmlType}
      style={{ height: "55px" }}
      loading={loading}
    >
      {name}
    </Button>
  );
};

export default AuthButton;
