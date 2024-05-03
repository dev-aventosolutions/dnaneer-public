import { Row, Col } from "antd";

// import { ReactComponent as Profits } from "assets/svgs/Profits.svg";

import { ReactComponent as Charts } from "assets/svgs/Charts.svg";
// import { ReactComponent as Networks } from "assets/svgs/Networks.svg";

const AuthWrapper = (Component): Function => {
  return function Auth({ ...props }): JSX.Element {
    const { individual } = props;
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
            <div
              className="auth-col-one"
              // style={{
              //   backgroundImage:
              //     individual === individual
              //       ? "url(/assets/images/individual.png)"
              //       : "url(/assets/images/institutional.png)",
              //       backgroundSize:"cover"
              // }}
            >
              <img
                src={
                  individual === "individual"
                    ? "/assets/images/individual.png"
                    : "/assets/images/institutional.png"
                }
                alt="login"
                className="login-img"
              />
              <div className="profits">
                <Charts />
              </div>
              <div className="networks">
                {/* <Networks /> */}
                <img
                  src={
                    individual === "individual"
                      ? "/assets/images/Group 1000002367.png"
                      : "/assets/images/Networks.png"
                  }
                  alt="networks"
                />
              </div>
              <div className="description">
                <h1
                  style={{
                    color: individual === "individual" ? "#fff" : "#140A2B",
                  }}
                >
                  Discover new investment opportunities
                </h1>
                <p
                  style={{
                    color: individual === "individual" ? "#fff" : "#140A2B",
                  }}
                >
                  Maximize your investments!
                </p>
              </div>
              <p
                className="copyright-two"
                style={{
                  color: individual === "individual" ? "#fff" : "#140A2B",
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
