import React, { useState, useEffect } from "react";
import { Row, Col, Button, Spin, message, Table, Pagination } from "antd";
import { getLoanList } from "../../services/ApiHandler";
const SettledLoans = () => {
  const [loading, setLoading] = useState(false);
  const [loanList, setLoanList] = useState([]);
  const [id, setId] = useState("");
  const [pagination, setPagination] = useState({ page: 1 });
  useEffect(() => {
    fetchLoanList();
  }, [pagination.page]);

  const columns = [
    {
      title: "To Pay",
      dataIndex: "borrower_to_pay",
      align: "center",
    },
    {
      title: "To Receive",
      dataIndex: "borrower_to_receive",
      align: "center",
    },
    {
      title: "Origination Fee",
      dataIndex: "origination_fee",
      key: "origination_fee",
      align: "center",
    },
    {
      title: "Tenor",
      dataIndex: "tenor",
      key: "tenor",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (data) => (
        <div
          className="loan-request-status"
          style={{
            backgroundColor:
              data == "active"
                ? "#73f085"
                : data == "defaulted"
                ? "#f01c1c"
                : "#ffe58f",
          }}
        >
          <div style={{ color: "white", textAlign: "center" }} shape="round">
            {data?.toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (data) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ cursor: "pointer" }}
            className="fund-transfer-button"
            shape="round"
            onClick={() => {
              setId(data);
            }}
          >
            View
          </Button>
          {/* <button onClick={rejectCase(key)}>Reject</button> */}
        </div>
      ),
    },
  ];
  const fetchLoanList = async () => {
    try {
      setLoading(true);
      const { data } = await getLoanList(pagination.page,"settled");
      if (data) {
        setLoanList(data.data.data);
        console.log("Loan>>>>", data?.data?.data);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const refreshHandler = async () => {
    fetchLoanList();
  };

  const handlePageChange = (page) => {
    console.log("page changed", page);
  };
  return (
    <>
      <Spin spinning={loading}>
        <div className="rounded-body">
          <div className="round-div">
            <div className="rounded-header">
              <Row justify="space-between" align="middle">
                <Col>
                  <h1>Settled Loans</h1>
                </Col>
                <Col>
                  <Button
                    type="gray"
                    shape="round"
                    style={{ marginRight: "15px" }}
                    onClick={refreshHandler}
                  >
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="g-info">
              <div className="rounded-body">
                <div>
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={loanList}
                      pagination={false}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "20px",
                      }}
                    >
                      {/* <Pagination
                                      current={pagination.page}
                                      total={pagination?.total}
                                      onChange={handlePageChange}
                                      style={{ alignSelf: "flex-end" }}
                                      defaultPageSize={15}
                                    /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default SettledLoans;
