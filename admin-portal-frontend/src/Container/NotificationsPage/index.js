import React, { useState, useEffect } from "react";
import { Button, Tabs, Spin, message, Table } from "antd";
import Layout from "../../sharedModules/defaultLayout";
import { getPartialNotifications } from "../../services/ApiHandler";
import moment from "moment";

const NotificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getPartialNotifications();
      console.log(response.data);
      setNotifications(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message ?? "Something went wrong");
    }
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "text",
      key: "text",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "created_at",
      align: "center",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
  ];
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <div>
      <Layout sideKey="4">
        <Spin spinning={loading}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <h1>Notifications Page</h1>
          </div>
          <Table columns={columns} dataSource={notifications} />
        </Spin>
      </Layout>
    </div>
  );
};

export default NotificationPage;
