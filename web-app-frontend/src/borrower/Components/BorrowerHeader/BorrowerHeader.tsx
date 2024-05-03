import { SetStateAction, Dispatch } from "react";
import { Input, Badge, Avatar, Row, Col, Popover } from "antd";
import { Link } from "react-router-dom";
import { ReactComponent as BlueStart } from "assets/svgs/BlueStart.svg";
import { ReactComponent as NavSearch } from "assets/svgs/NavSearch.svg";
import { ReactComponent as Web } from "assets/svgs/Web.svg";
import { ReactComponent as Bell } from "assets/svgs/Bell.svg";
import { ReactComponent as Hamburger } from "assets/svgs/Hamburger.svg";

type Props = {
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

const content = (
  <div className="header-notifications-content">
    <div className="notification">
      <h1>Account verified</h1>
      <p>
        It is a long established fact that a reader will be distracted by the
        readable.
      </p>
      <span>Today at 9:42 AM</span>
    </div>
    <div className="notification">
      <h1>Account verified</h1>
      <p>
        It is a long established fact that a reader will be distracted by the
        readable.
      </p>
      <span>Today at 9:42 AM</span>
    </div>
    <div className="notification">
      <h1>Account verified</h1>
      <p>
        It is a long established fact that a reader will be distracted by the
        readable.
      </p>
      <span>Today at 9:42 AM</span>
    </div>
    <div className="header-footer-line" />
  </div>
);

function Header({ setCollapsed, collapsed, className }: Props) {
  const institutional = localStorage.getItem("investor-type");
  return (
    <div className={`header-container ${className}`}>
      <Row align="middle">
        <Col
          lg={{
            span: 4,
            order: 1,
          }}
          xl={4}
          xxl={3}
          md={{
            span: 8,
            order: 1,
          }}
          xs={{
            span: 8,
            order: 1,
          }}
          sm={{
            span: 8,
            order: 1,
          }}
        >
          <div className="header-col-one">
            <Link to="/">
              <div className="start-icon" style={{ cursor: "pointer" }}>
                <BlueStart />
                <h1>Dnaneer</h1>
                <div
                  className="burger"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <Hamburger />
                </div>
              </div>
            </Link>
          </div>
        </Col>
        <Col
          xl={16}
          xxl={17}
          xs={{
            span: 24,
            order: 3,
          }}
          sm={{
            span: 24,
            order: 3,
          }}
          lg={{
            span: 16,
            order: 2,
          }}
          md={{
            span: 24,
            order: 3,
          }}
        >
          <div className="header-search">
            {/* <Input
              placeholder="Search by opportunity reference number"
              prefix={<NavSearch />}
            /> */}
          </div>
        </Col>
        <Col
          md={{
            span: 16,
            order: 2,
          }}
          xs={{
            span: 16,
            order: 2,
          }}
          lg={{
            span: 4,
            order: 3,
          }}
          sm={{
            span: 16,
            order: 2,
          }}
        >
          <div className="header-col-two">
            {/* <div className="language">
              <Web />
            </div> */}
            <div className="badge-icon">
              <Popover
                placement="bottom"
                content={content}
                title={
                  <div className="header-notifications-title">
                    {" "}
                    <Bell />
                    Notifications
                  </div>
                }
                trigger="click"
              >
                  <Bell />
              </Popover>
            </div>

            <Link to={"/borrower/dashboard/my-profile"}>
              <Avatar
                src={
                  <BlueStart
                    style={{
                      marginTop: "9px",
                      marginLeft: "2px",
                      width: "14px",
                    }}
                  />
                }
              />
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
