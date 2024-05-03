import { ReactNode } from "react";
import { Col, Row } from "antd";
interface MessageProps {
  children: ReactNode | ReactNode[] | string;
}

const DashboardCardsContainer = ({ children }: MessageProps): JSX.Element => {
  return (
    <div>
      <Row justify="end">
        <Col style={{ minWidth: "388px", maxWidth: "388px" }}> {children}</Col>
      </Row>
    </div>
  );
};

export default DashboardCardsContainer;
