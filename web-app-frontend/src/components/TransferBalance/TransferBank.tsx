import { Form, Select } from "antd";
import { ReactComponent as TransferBack } from "assets/svgs/TransferBack.svg";
import { ReactComponent as BankBlack } from "assets/svgs/BankBlack.svg";
import Button from "components/Button/Button";
import Input from "components/Input/Input";

const TransferBank = ({
  handleBack,
  handleNext,
  setTransferValues,
  userProfile,
}) => {
  const onFinish = (values) => {
    setTransferValues(values);
    handleNext();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const validateAmount = (balance) => {
    return {
      validator(_, value) {
        if (parseFloat(value) <= balance) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Amount cannot exceed your balance"));
      },
    };
  };
  return (
    <>
      <div className="transfer-back" onClick={handleBack}>
        <TransferBack />
        <p>Back</p>
      </div>
      <div className="modal-content">
        <div className="header">
          <BankBlack />
          <h1>Transfer Information</h1>
        </div>
        {
          <Form
            name="basic"
            className="info-form-container"
            initialValues={{
              bank: userProfile?.accounts?.name,
              iban: userProfile?.accounts?.personal_iban_number,
            }}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item name="iban">
              <Input
                label="IBAN number"
                placeholder="IBAN number"
                className={"infoInput"}
                maxLength={24}
                disabled
              />
            </Form.Item>

            <Form.Item name="bank">
              <Input
                label="Bank name"
                placeholder="Bank name"
                className={"infoInput"}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please enter your amount!",
                },
                validateAmount(userProfile.accounts?.balance),
              ]}
            >
              <Input
                type="number"
                label="Enter amount"
                placeholder="Enter amount"
                className={"infoInput"}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                block
                style={{ height: "52px", marginTop: "22px" }}
              >
                Proceed
              </Button>
            </Form.Item>
          </Form>
        }{" "}
      </div>
    </>
  );
};

export default TransferBank;
