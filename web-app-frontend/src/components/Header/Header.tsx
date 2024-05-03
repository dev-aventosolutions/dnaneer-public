import { SetStateAction, Dispatch, useEffect, useState } from "react";
import {
  Input,
  Badge,
  Avatar,
  Row,
  Col,
  Popover,
  message,
  Spin,
  notification,
} from "antd";
import { Link } from "react-router-dom";
import { ReactComponent as Start } from "assets/svgs/Start.svg";
import { ReactComponent as NavSearch } from "assets/svgs/NavSearch.svg";
import { ReactComponent as Web } from "assets/svgs/Web.svg";
import { ReactComponent as Bell } from "assets/svgs/Bell.svg";
import { ReactComponent as Hamburger } from "assets/svgs/Hamburger.svg";
import "./header.scss";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";
import { getPartialNotifications, getProfile } from "services/Login";
import moment from "moment";

type Props = {
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

function Header({ setCollapsed, collapsed, className }: Props) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getUserProfile = async () => {
    try {
      const { data } = await getProfile();
      if (data) {
        const userData = {
          ...data.data.user,
          nafath: await JSON.parse(data.data.user?.nafath),
        };
        setUserProfile(userData);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
    } finally {
    }
  };
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getPartialNotifications();
      setNotifications(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message ?? "Something went wrong");
    }
  };

  const content = (
    <Spin spinning={loading}>
      <div className="header-notifications-content">
        {notifications.length ? (
          notifications?.map((notification) => (
            <>
              <div className="notification">
                <h1>{notification?.title ?? "Title"}</h1>
                <p>{notification?.text}</p>
                <span>{moment(notification?.created_at)?.fromNow()}</span>
              </div>
              <div className="header-footer-line" />
            </>
          ))
        ) : (
          <div className="notification">
            <p>No notifications found</p>
          </div>
        )}
      </div>
    </Spin>
  );

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div
      className={
        className
          ? `header-container ${className}`
          : userProfile?.user_type === 2
          ? "header-container headerO"
          : "header-container"
      }
    >
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
            <Link to="/dashboard">
              <div className="start-icon" style={{ cursor: "pointer" }}>
                <Start />
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
            <Input
              placeholder="Search by opportunity reference number"
              prefix={<NavSearch />}
            />
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
                <Bell onClick={fetchNotifications} />
              </Popover>
            </div>

            <Link to={"/dashboard/profile"}>
              <Avatar
                src={
                  userProfile?.profile_image_url
                    ? "https://backend.dnaneer.com/" +
                      userProfile?.profile_image_url
                    : "/assets/images/Vector.png"
                }
                style={
                  userProfile?.mode === "vip" && userProfile?.user_type === 1
                    ? {
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(to right,#f4422b ,#ffda34) border-box",
                      }
                    : userProfile?.user_type === 2
                    ? {
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(to right,#f42b2b, #6fc1f4) border-box",
                      }
                    : {}
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
