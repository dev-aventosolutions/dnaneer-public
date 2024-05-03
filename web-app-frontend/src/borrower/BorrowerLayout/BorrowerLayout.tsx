import { useState, useMemo } from "react";
import { Layout } from "antd";

import AppHeader from "borrower/Components/BorrowerHeader/BorrowerHeader";
import BorrowerSiderbar from "borrower/Components/BorrowerDashBoardSidebar/Sidebar";
import "./BorrowerLayout.scss";

const { Sider, Content } = Layout;

const DashboardLayout = ({ children, sideKey }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ paddingTop: "0" }} className="layout-container">
      <AppHeader
        className="borrower-header"
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <BorrowerSiderbar setCollapsed={setCollapsed} sideKey={sideKey} />
        </Sider>
        <Layout style={{ paddingTop: "0" }}>
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
