import AppCard from "components/Card/Card";
import { Row, Col } from "antd";
import { ReactComponent as DnaneerRotated } from "assets/svgs/Dnaneer-rotated.svg";
import "./cards.scss";

const RetangularCard = ({ title, value }) => {
  return (
    <AppCard className={"card-wrapper"}>
      <Row>
        <Col xs={16}>
          <div className="rectangle-card-content">
            <div className="title">{title}</div>
            <div className="value">{value}</div>
          </div>
        </Col>
        <Col xs={8}>
          <div className="rectangle-right">
            <DnaneerRotated style={{ left: "22px", position: "relative" }} />
          </div>
        </Col>
      </Row>
    </AppCard>
  );
};
export default RetangularCard;
