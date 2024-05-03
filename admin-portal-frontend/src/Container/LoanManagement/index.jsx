import React, { useState, useEffect } from "react";
import { Row, Col, Button, message, Spin } from "antd";
import Layout from "../../sharedModules/defaultLayout";
import RequestedBorrowers from "./RequestedBorrowers/RequestedBorrowers";
import { exportBorrowersRequestList } from "../../services/ApiHandler";

const LoanManagement = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  const exportList = async () => {
    try {
      setExportLoading(true);
      const response = await exportBorrowersRequestList({
        page_no: page,
        per_page: 15,
      });
      const link = document.createElement("a");
      link.href = response?.data?.data;
      link.target = "_blank";
      link.download = "exported-file.pdf"; // Set a default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("exportListError", response);
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      console.log("exportListError", error);
      message.error("something went wrong");
    }
  };
  return (
    <Layout sideKey="9">
      <div className="round-div">
        <div className="rounded-header">
          <Row justify="space-between" align="middle">
            <Col>
              <h2>Loan Requests</h2>
            </Col>
            <Col>
              <Button
                loading={exportLoading}
                onClick={exportList}
                type="gray"
                shape="round"
              >
                Export
              </Button>
            </Col>
          </Row>
        </div>
        <Spin spinning={loading}>
          <div className="rounded-body">
            <RequestedBorrowers
              page={page}
              setPage={setPage}
              pagination={pagination}
              setPagination={setPagination}
              setLoading={setLoading}
            />
          </div>
        </Spin>
      </div>
    </Layout>
  );
};

export default LoanManagement;
