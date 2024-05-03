import { Row, Col, Divider } from "antd";
import InstallmentCard from "../../Cards/InstallmentCard";
import AppAccordion from "borrower/Components/Accordion/Accordion";
import { ReactComponent as Info } from "assets/svgs/Info.svg";
import "./installments.scss";
import moment from "moment";

const status = {
  Paid: "#2BDAAE",
  Overdue: "#ED615C",
  Pending: "#d7de1b",
  Scheduled: "#2B48F4",
};

const Header = ({}) => {
  return (
    <div className="installment-header-container">
      <Row>
        <Col md={6}>80,000 SAR</Col>
        <Col md={6}>Feb 23, 2023</Col>
        <Col md={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Info />
            <span style={{ marginLeft: "10px" }}>It is a long...</span>
          </div>
        </Col>
        <Col md={6}>
          <div
            className="installment-status"
            style={{ backgroundColor: status["Paid"], color: "#fff" }}
          >
            Paid
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Body = ({ installment }) => {
  const content = (title, value) => {
    return (
      <>
        <Divider />
        <div style={{ fontSize: "14px", color: "#8A8595", fontWeight: 500 }}>
          {title}
        </div>
        <div style={{ fontSize: "14px", color: "#140A2B", fontWeight: 700 }}>
          {value}
        </div>
      </>
    );
  };

  return (
    <Row>
      <Col md={3}></Col>
      <Col md={6}>{content("Principal", `${installment.interest} %`)}</Col>
      <Col md={5}>{content("Interest", `${installment.interest} %`)}</Col>
      <Col md={5}>{content("Fees", `SAR ${installment.fees}`)}</Col>
    </Row>
  );
};

const Installment = ({ installments, classes }) => {
  return (
    <div className="installments-container">
      {installments?.map((installment, i) => {
        return (
          <div key={i} className="installment-row">
            <div className="install-num">{i + 1}</div>
            <AppAccordion
              header={
                <div className="installment-header-container">
                  <h2
                    style={{ color: "#140a2b" }}
                  >{`SAR ${installment.amount}`}</h2>
                  <h2>{moment(installment.created_at).format("YYYY-MM-DD")}</h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      marginLeft: "-45px",
                    }}
                  >
                    <Info />
                    <h2 style={{ marginLeft: "10px" }}>
                      {installment.description}
                    </h2>
                  </div>
                  <div
                    className="installment-status"
                    style={{
                      backgroundColor:
                        status[
                          installment.status &&
                            installment.status.charAt(0).toUpperCase() +
                              installment.status.slice(1)
                        ],
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {installment.status &&
                      installment.status.charAt(0).toUpperCase() +
                        installment.status.slice(1)}
                  </div>
                </div>
              }
            >
              <div>
                <div style={{ marginTop: "10px" }}>
                  <Body installment={installment} />
                </div>
              </div>
            </AppAccordion>
          </div>
        );
      })}
    </div>
  );
};

export default Installment;
