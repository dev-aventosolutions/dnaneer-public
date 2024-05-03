import { useState } from "react";
import Button from "components/Button/Button";
import AppCard from "components/Card/Card";
import Modal from "components/Modal/Modal";
import { ReactComponent as AdvisorLogo } from "assets/svgs/AdvisorLogo.svg";
import { ReactComponent as Email } from "assets/svgs/Email.svg";
import { ReactComponent as Call } from "assets/svgs/Call.svg";
import { Col, Row } from "antd";

const SideCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        centered
        className="logout-modal"
        isModalVisible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="log-icon">
          <img src="/assets/images/Baddar.png" alt="Baddar" />
        </div>

        <h1>
          Your financial advisor is available to help you with your investment
          inquires. Reach out Directly.
        </h1>
        <div className="contact-rows">
          <div className="contact-row">
            <h2>Email: </h2>
            <p>aljuhani@dnaneer.com</p>
          </div>
          <div className="contact-row">
            <h2 style={{ marginLeft: "-39px" }}>Phone: </h2>
            <p>+966 54 100 1992</p>
          </div>
        </div>
        <Button onClick={handleOk} block className="close-btn">
          Close
        </Button>
      </Modal>
      <Row justify="end">
        <Col style={{ minWidth: "388px", maxWidth: "388px" }}>
          <div className="borrower-sideCard">
            <div style={{ marginBottom: "-8rem" }}>
              <AppCard className="advisor-card">
                <h1>Account Administrator</h1>
                <p>
                  Your account administrator is available to help you with your
                  investment inquires. Reach out Directly.
                </p>
                <div
                  className="advisor-profile"
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <div className="advisor-image">
                    <div className="advisor-logo">
                      <AdvisorLogo />
                    </div>
                    <img src="/assets/images/Baddar.png" alt="Baddar" />
                  </div>
                  <div style={{ marginLeft: "22px" }}>
                    <h2 style={{ margin: "0px" }}>Bader Aljuhani</h2>
                    {/* <p>Financial advisor</p> */}
                    <div
                      className="contact-icons"
                      style={{ width: "90px", marginTop: "10px" }}
                    >
                      <div className="contact-icon" onClick={() => showModal()}>
                        <Email />
                      </div>

                      <div className="contact-icon" onClick={() => showModal()}>
                        <Call />
                      </div>
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>
          </div>
          <AppCard className="capital-card">
            <div>
              <h1>Access More Capital</h1>
              <Button className="loan-btn">Request Loan</Button>
            </div>
          </AppCard>
        </Col>
      </Row>
    </>
  );
};

export default SideCard;
