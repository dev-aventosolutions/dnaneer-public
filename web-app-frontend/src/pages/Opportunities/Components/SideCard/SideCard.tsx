import { useState, useEffect } from "react";
import Button from "components/Button/Button";
import AppCard from "components/Card/Card";
import TransferBalance from "components/TransferBalance/TransferBalance";
import AddBalance from "components/TransferBalance/AddBalance";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import { Col, Row } from "antd";

import "./SideCard.scss";
import { getProfile } from "services/Login";
import { commaSeparator } from "utils/Helper";

const SideCard = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const institutional = localStorage.getItem("investor-type");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getProfile();
        if (data) {
          const userData = {
            ...data.data.user,
            nafath: await JSON.parse(data.data.user.nafath),
          };
          setUserProfile(userData);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onOk = () => {
    setTransferModalOpen(false);
  };
  const onCancel = () => {
    setTransferModalOpen(false);
  };

  const balanceModelOk = () => {
    setBalanceModalOpen(false);
  };
  const balanceModelCancel = () => {
    setBalanceModalOpen(false);
  };

  return (
    <>
      {userProfile && (
        <>
          <TransferBalance
            isModalVisible={transferModalOpen}
            userProfile={userProfile}
            setIsModalVisible={setTransferModalOpen}
            onOk={onOk}
            onCancel={onCancel}
          />
          <AddBalance
            isModalVisible={balanceModalOpen}
            userProfile={userProfile}
            onOk={balanceModelOk}
            setIsModalVisible={setBalanceModalOpen}
          />
          <Row justify="end">
            <Col style={{ minWidth: "262px", maxWidth: "262px" }}>
              <div
                className={
                  institutional === "institutional"
                    ? "sideCard-container sideCardO"
                    : "sideCard-container"
                }
              >
                <div style={{ marginBottom: "-2rem" }}>
                  <AppCard>
                    <h4
                      style={{
                        fontSize: "12px",
                        color: "#140A2B",
                        margin: "0",
                      }}
                    >
                      My Balance
                    </h4>
                    <div style={{ marginBottom: "43px" }}>
                      <span
                        style={{
                          color: "#5B2CD3",
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        {commaSeparator(
                          `${
                            userProfile?.accounts?.balance
                              ? userProfile?.accounts?.balance
                              : "0.00"
                          }`
                        )}
                      </span>
                      <span
                        style={{
                          marginLeft: "5px",
                          color: "#5B2CD3",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        SAR
                      </span>
                    </div>
                    <Button
                      style={{ width: "100%", height: "42px" }}
                      onClick={() => setBalanceModalOpen(true)}
                    >
                      Add Balance
                    </Button>
                    <Button
                      className="transfer-card-btn"
                      onClick={() => setTransferModalOpen(true)}
                    >
                      Transfer
                    </Button>
                  </AppCard>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SideCard;
