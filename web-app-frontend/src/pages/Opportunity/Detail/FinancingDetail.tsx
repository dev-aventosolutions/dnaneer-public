import { Row, Col, Popover } from "antd";
import { ReactComponent as Info } from "assets/svgs/Info.svg";
import { ReactComponent as DashboardInfo } from "assets/svgs/DashboardInfo.svg";
import "../opportunity.scss";
import { commaSeparator } from "utils/Helper";

const FinancingDetail = ({ detailOpportunity }) => {
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
    <>
      <Row>
        <Col xs={24}>
          <div style={{ marginBottom: "27px" }}>
            <h3 className="large-heading">Financing details</h3>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col md={6}>
          <FinancingElements
            heading="Financing Structure"
            value={detailOpportunity.financing_structure}
          />
        </Col>
        <Col md={6}>
          <FinancingElements
            heading="Financing type"
            value={detailOpportunity.financing_type}
          />
        </Col>
        <Col md={6}>
          <FinancingElements
            heading="Net ROI"
            value={detailOpportunity.net_roi + " %"}
          />
        </Col>
        <Col md={6}>
          <FinancingElements
            heading="Due Date"
            value={detailOpportunity.due_date}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "26px" }} gutter={[24, 24]}>
        <Col md={6}>
          <span
            className="financing-detail-info-icon"
            style={{ display: "flex" }}
          >
            <FinancingElements
              heading="Risk Score"
              value={detailOpportunity.risk_score}
            />
            <Popover
              content={content}
              placement="top"
              className="dashboard-popover"
            >
              <div style={{ position: "absolute", left: "71px", top: "-3px" }}>
                <Info />
              </div>
            </Popover>
          </span>
        </Col>

        <Col md={6}>
          <FinancingElements
            heading="Distributed Returns"
            value={
              commaSeparator(detailOpportunity.distributed_returns) + " SAR"
            }
          />
        </Col>
        <Col md={6}>
          <FinancingElements
            heading="Requested amount"
            value={commaSeparator(detailOpportunity.fund_needed) + " SAR"}
          />
        </Col>
        <Col md={6}>
          <FinancingElements
            heading="Repayment Frequency"
            value={
              detailOpportunity?.repayment_period
                ? detailOpportunity?.repayment_period == "1"
                  ? "Monthly"
                  : detailOpportunity?.repayment_period + " Months"
                : "-"
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default FinancingDetail;

const FinancingElements = ({ heading, value }) => {
  return (
    <div className="financing-element">
      <span className="secondary-text">{heading}</span>
      <span style={{ marginTop: "9px" }} className="medium-heading">
        {value}
      </span>
    </div>
  );
};
