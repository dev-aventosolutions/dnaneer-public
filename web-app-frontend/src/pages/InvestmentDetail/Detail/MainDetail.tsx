import { Row, Col, Popover } from "antd";
import { ReactComponent as InvestmentOne } from "assets/svgs/InvestmentOne.svg";
import { ReactComponent as AnnualROI } from "assets/svgs/annual-roi.svg";
import { ReactComponent as Rating } from "assets/svgs/Rating.svg";
import { ReactComponent as Time } from "assets/svgs/Time.svg";
import { ReactComponent as Info } from "assets/svgs/Info.svg";
import { ReactComponent as DashboardInfo } from "assets/svgs/DashboardInfo.svg";
import "../Investment.scss";

const MainDetail = ({ detailInvestment }) => {
  const content = (
    <>
      <div className="dashboard-modal-content">
        <div>
          <DashboardInfo />
        </div>
        <div style={{ marginLeft: "14px" }}>
          <h1>Risk Score</h1>
          <p>
            Opportunities are ranked on a scale of A to D, as follows:
            <br />
            <strong className="bold-letter">A:</strong> Excellent opportunity,
            low risk.
            <br />
            <strong className="bold-letter">B:</strong> Very good to excellent
            opportunity, low to medium risk.
            <br />
            <strong className="bold-letter">C:</strong> Very good to good
            opportunity, medium risk.
            <br />
            <strong className="bold-letter">D:</strong> Good opportunity, high
            risk.
          </p>
        </div>
      </div>
    </>
  );
  return (
    <Row justify="center">
      <Col md={6}>
        <div className="main-detail-col1">
          <InvestmentOne />
          <div className="opportunity-code-container">
            <h3 style={{ fontWeight: "bold" }}>
              #{detailInvestment.opportunity_number}
            </h3>
            <h5 className="secondary-text">
              {detailInvestment.industry_name}
            </h5>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="flex-column-start ">
          <AnnualROI />
          <h2 className="medium-heading ">
            Annual ROI
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#5b2cd3" }}
            >
              {" "}
              {detailInvestment.annual_roi}%
            </span>
          </h2>
        </div>
      </Col>
      <Col md={6}>
        <div className="flex-column-start">
          <div style={{ display: "flex" }}>
            <Rating />
            <h2 className="medium-heading ">
              Risk Score: {detailInvestment.risk_score}
            </h2>
            <Popover
              content={content}
              placement="top"
              className="dashboard-popover"
            >
              <div style={{ marginLeft: ".5rem" }}>
                <Info />
              </div>
            </Popover>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="flex-column-start ">
          <Time />
          <h2 className="medium-heading ">
            {detailInvestment.duration} Months
          </h2>
        </div>
      </Col>
    </Row>
  );
};

export default MainDetail;
