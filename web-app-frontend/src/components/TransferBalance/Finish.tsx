import Button from "components/Button/Button";
import { ReactComponent as TransferBack } from "assets/svgs/TransferBack.svg";
import { ReactComponent as Thanks } from "assets/svgs/Thanks.svg";
import { getProfile } from "services/Login";
const Finish = ({
  handleBack,
  setIsModalVisible,
  setCurrentDivIndex,
  setUserProfile,
}) => {
  const finishHandler = async () => {
    const { data } = await getProfile();
    setUserProfile(data.data.user);
    setIsModalVisible(false);
    setCurrentDivIndex(0);
  };
  return (
    <div>
      <div className="transfer-back" onClick={handleBack}>
        <TransferBack />
        <p>Back</p>
      </div>

      <div className="modal-content">
        <div className="questionIcon">
          <Thanks />
        </div>
        <h1>Thanks!</h1>
        <p>Your transaction amount will be transferred within 24 hours</p>
        <Button
          block
          style={{ height: "52px", marginTop: "36px" }}
          onClick={finishHandler}
        >
          Ok
        </Button>
      </div>
    </div>
  );
};

export default Finish;
