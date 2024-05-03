import { Row, Col } from "antd";
import Installments from "./Installments";
import classes from "./dashboardBody.module.scss";
import SideCard from "borrower/Components/BorrowerSideCard/BorrowerSideCard";
const DashboardBody = () => {
  return (
    <Row gutter={[22, 32]}>
      <Col
        flex="auto"
        xs={{
          order: 2,
        }}
        lg={{
          order: 1,
        }}
        sm={{
          order: 2,
        }}
      >
        <Installments classes={classes} />
      </Col>
      <Col
        xs={{
          order: 1,
        }}
        lg={{
          order: 2,
        }}
        sm={{
          order: 1,
        }}
      >
        <SideCard />
      </Col>
    </Row>
  );
};

export default DashboardBody;
