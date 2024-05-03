import { useState, useMemo } from "react";
import { Layout } from "antd";

import AppHeader from "components/Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import BorrowerSiderbar from "borrower/Components/BorrowerDashBoardSidebar/Sidebar";
import "./DashboardLayout.scss";

const { Sider, Content } = Layout;

const DashboardLayout = ({ children, sideKey, userType = "" }) => {
  const [collapsed, setCollapsed] = useState(false);

  const DashboardSidebar = useMemo(() => {
    return userType && userType === "borrower" ? BorrowerSiderbar : Sidebar;
  }, [userType]);

  return (
    <Layout style={{ paddingTop: "0px" }} className="layout-container">
      <AppHeader setCollapsed={setCollapsed} collapsed={collapsed} />
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <DashboardSidebar setCollapsed={setCollapsed} sideKey={sideKey} />
        </Sider>
        <Layout style={{ paddingTop: "0px" }}>
          <Content
            style={{
              margin: "0px 23px",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
