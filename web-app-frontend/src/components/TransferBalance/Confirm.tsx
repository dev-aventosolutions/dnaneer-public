import Button from "components/Button/Button";
import { ReactComponent as TransferBack } from "assets/svgs/TransferBack.svg";
import { ReactComponent as QuestionIcon } from "assets/svgs/QuestionIcon.svg";
import { commaSeparator } from "utils/Helper";
import { Spin } from "antd";
const Confirm = ({
  handleBack,
  handleNext,
  transferValues,
  sentOtp,
  setTime,
  loading,
}) => {
  return (
    <div>
      <div className="transfer-back" onClick={handleBack}>
        <TransferBack />
        <p>Back</p>
      </div>
      <Spin spinning={loading}>
       
        <div className="modal-content">
          <div className="questionIcon">
            <QuestionIcon />
          </div>
          <h1>Confirm Payment Transfer</h1>
          <p>You are about to transfer</p>
          <p className="amount">{commaSeparator(transferValues?.amount)} SAR</p>
          <Button
            block
            style={{ height: "52px", marginTop: "36px" }}
            onClick={() => {
              sentOtp();
              setTime(0);
            }}
          >
            Confirm
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default Confirm;
