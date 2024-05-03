import { SetStateAction, Dispatch, useState } from "react";
import Modal from "components/Modal/Modal";
import Transfer from "./Transfer";
import TransferDocument from "./TransferDocument";

import "./TransferBalance.scss";
import { Button } from "antd";

interface ModalProps {
  isModalVisible?: boolean;
  setIsModalVisible?: Dispatch<SetStateAction<boolean>>;
  onOk?: () => void;
  onCancel?: () => void;
  userProfile?: any;
}

const TransferBalance = ({
  isModalVisible,
  setIsModalVisible,
  onOk,
  userProfile,
}: ModalProps): JSX.Element => {
  //   const [transferInfo, setTransferInfo] = useState(false);
  const [currentDivIndex, setCurrentDivIndex] = useState(0);

  const handleNext = () => {
    setCurrentDivIndex((prevIndex) => prevIndex + 1);
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setCurrentDivIndex(0);
  };

  const divContents = [
    <Transfer handleNext={handleNext} />,
    <TransferDocument onCancel={onCancel} userProfile={userProfile} />,
  ];

  const currentDivContent = divContents[currentDivIndex];
  return (
    <div>
      <Modal
        width={600}
        centered
        className="transfer-balance-model"
        isModalVisible={isModalVisible}
        onOk={onOk}
        onCancel={onCancel}
        footer={false}
      >
        <>
          <div className="log-icon">{/* <Logout /> */}</div>
          {userProfile.kyc_step == 5 ? (
            currentDivContent && <div>{currentDivContent}</div>
          ) : userProfile.kyc_step == 0 ||
            userProfile.kyc_step == 1 ||
            userProfile.kyc_step == 2 ? (
            <div>
              <h2 style={{ color: "white" }}>Please complete your KYC form.</h2>
            </div>
          ) : userProfile.kyc_step == 3 ? (
            <div>
              <h2 style={{ color: "white" }}>Your KYC form is under review</h2>
            </div>
          ) : (
            userProfile.kyc_step == 4 && (
              <div>
                <h2 style={{ color: "white" }}>
                  Your KYC form is rejected. Please contact Administrator.
                </h2>
              </div>
            )
          )}
          {userProfile.kyc_step != 5 && (
            <Button
              block
              style={{ height: "52px", marginTop: "36px",backgroundColor: "#5b2cd3",color: "white",borderColor: "transparent",borderRadius: "50px"}}
              onClick={() => {
                setIsModalVisible(false);
              }}
            >
              Ok
            </Button>
          )}
        </>
      </Modal>
    </div>
  );
};

export default TransferBalance;
