import { Row, Col } from "antd";
import SquareCard from "../Cards/SquareCard";
import RetangularCard from "../Cards/RectangularCard";
// const cardColors = {
//   blue: "#2B48F4",
//   lightBlue: "#73DCFA",
//   green: "#2BDAAE",
// };

const HeaderCards = ({ userProfile }) => {
  return (
    <div style={{ margin: "50px 0 61px 0" }}>
      <Row gutter={[20, 0]}>
        <Col md={9}>
          <RetangularCard title="Loan Amount" value={"SAR 1,250,000 "} />
        </Col>
        <Col md={5}>
          <SquareCard
            backgroundColor="blue"
            title={"Repayment period"}
            value={"12 months"}
          />
        </Col>
        <Col md={5}>
          <SquareCard
            backgroundColor="lightBlue"
            title={"Financing rate"}
            value={"7.4%"}
          />
        </Col>
        <Col md={5}>
          <SquareCard
            backgroundColor="green"
            title={"Status"}
            value={"Active"}
          />
        </Col>
      </Row>
    </div>
  );
};

export default HeaderCards;
