import { Row, Col, message } from "antd";

import Button from "components/Button/Button";
import { ReactComponent as Copy } from "assets/svgs/Copy.svg";
const TransferDocument = ({ onCancel, userProfile }) => {
  const onFinish = () => {
    onCancel();
  };
  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("IBAN Number copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  return (
    <>
      <h1>Make a deposit into your investment account</h1>
      <div className="modal-content">
        <div className="transfer-document-container">
          <h2>
            To make a deposit into your investment account that includes
            profits, follow these steps:
          </h2>
          <p className="document">
            1- Go to the account page of your personal bank (SAMBA, SAIB, Al
            Rajhi, Al Ahli, Riyadh, Alinma, Al-Jazira, Alawwal, AlBilad...)
          </p>
          <p className="document">2- Enter your name as the recipient.</p>
          <p className="document">
            3- Add your investment account with profits for collective debt
            financing as the recipient.
          </p>
          <p className="document">4- Confirm the recipient.</p>
          <p className="document">
            5- Transfer the funds to your investment account.
            <br />
            If your personal account is with Arab National Bank, provide your
            investment account number in the format outlined in this document.
            <br />
            Please be aware that the process of depositing into your investment
            account with profits will take approximately 24 working hours.
          </p>
        </div>
        <div className="document-info">
          <Row>
            <Col lg={8}>
              <p>Dananeer Account #</p>
              <h1>{userProfile?.accounts?.dnaneer_account_no}</h1>
            </Col>
            <Col lg={8}>
              <p>Bank IBAN</p>
              <h1>{userProfile?.accounts?.personal_iban_number}</h1>
            </Col>
            <Col
              lg={8}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => {
                  copyText(userProfile?.accounts?.personal_iban_number);
                }}
              >
                <Copy />
              </div>
            </Col>
          </Row>
        </div>
        <Button
          block
          style={{ height: "52px", marginTop: "22px" }}
          onClick={onFinish}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default TransferDocument;
