import AppCard from "components/Card/Card";
import { Col, Row } from "antd";
// import AppCard from "components/Card/Card";
import { ReactComponent as InvestmentOne } from "assets/svgs/InvestmentOne.svg";
import CardInfo from "./CardInfo";
import ThirdColumn from "./ThirdColumn";
import { useNavigate } from "react-router-dom";

const OpportunitiesCard = ({ id, opportunity }) => {
  const navigate = useNavigate();
  const onViewDetail = () => {
    const newId = Number(id);
    navigate("/dashboard/opportunities/" + newId);
  };
  return (
    <AppCard>
      <Row className="opportunities-card">
        <Col md={2}>
          <InvestmentOne />
        </Col>
        <Col md={15}>
          <CardInfo id={id} opportunity={opportunity} />
        </Col>
        <Col md={7}>
          <ThirdColumn opportunity={opportunity} onViewDetail={onViewDetail}/>
        </Col>
      </Row>
    </AppCard>
  );
};

export default OpportunitiesCard;
