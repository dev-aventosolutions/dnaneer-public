import { Row, Col } from "antd";

// import { ReactComponent as Profits } from "assets/svgs/Profits.svg";

import { ReactComponent as BorrowChart } from "assets/svgs/BorrowChart.svg";
// import { ReactComponent as Networks } from "assets/svgs/Networks.svg";
import { ReactComponent as Cone } from "../../assets/svgs/Cone-Circle.svg";

const AuthWrapper = (Component): Function => {
  return function Auth({ ...props }): JSX.Element {
    return (
      <div className="auth-container">
        <Row style={{ overflow: "hidden" }} align="stretch">
          <Col
            lg={{
              span: 15,
              order: 1,
            }}
            md={{
              span: 24,
              order: 2,
            }}
            xs={{
              order: 2,
              span: 24,
            }}
            sm={{
              span: 24,
              order: 2,
            }}
          >
            <div className="auth-col-one">
              <img
                src="/assets/images/BorrowerBg.png"
                alt="login"
                className="login-img"
              />
              <div className="profits">
                <BorrowChart />
              </div>
              <div className="networks">
                {/* <Networks /> */}
                <img src="/assets/images/BorrowNetwork.png" alt="networks" />
              </div>
              <div
                style={{
                  zIndex: "999999",
                  position: "absolute",
                  top: "-57px",
                  left: "-20px",
                }}
              >
                <Cone />
              </div>
              <div className="description">
                <h1
                  style={{
                    color: "#140A2B",
                  }}
                >
                  Access Future Revenues to Grow Your Business
                </h1>
                <p
                  style={{
                    color: "#140A2B",
                  }}
                >
                  Smart financing opportunities.
                </p>
                d
              </div>
              <p
                className="copyright-two"
                style={{
                  color: "#140A2B",
                }}
              >
                {" "}
                Dnaneer © Copyright 2023, All Rights Reserved
              </p>
            </div>
          </Col>
          <Col
            lg={{
              span: 9,
              order: 2,
            }}
            md={{
              span: 24,
              order: 1,
            }}
            xs={{
              order: 1,
              span: 24,
            }}
            sm={{
              span: 24,
              order: 1,
            }}
          >
            <div className="auth-col-two">
              <Component {...props} />
            </div>
          </Col>
        </Row>
      </div>
    );
  };
};

export default AuthWrapper;
