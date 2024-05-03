import React from "react";
import { Space, Avatar, Badge, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { ReactComponent as Dnaneer } from "../../assets/svgs/Dnaneer.svg";
import userIcon from "../../images/avatar.png";
import Cookies from "js-cookie";

const Index = () => {
  const user = JSON.parse(Cookies?.get("user"));
  return (
    <header>
      <div className="container-xl">
        <div className="menu-navbar">
          <div className="menu-seprator">
            <div className="navbar-brand">
              <Link to="/">
                <Dnaneer />
              </Link>
            </div>
          </div>

          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <Link to="/my-account">Settings</Link>
                </Menu.Item>
              </Menu>
            }
          >
            <Space>
              <Badge dot>
                <a href="/profile">
                  <Avatar src={userIcon} size={50} />
                </a>
              </Badge>
              <p className="m-0">
                <strong>
                  {user?.name ? user.name : user.email ?? "Admin"}
                </strong>
                Super Admin
              </p>
            </Space>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Index;
