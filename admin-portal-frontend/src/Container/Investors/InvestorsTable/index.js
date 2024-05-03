import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table/Table";
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Spin,
  message,
  Switch,
  Pagination,
  Radio,
  Select,
} from "antd";
import {
  SearchOutlined,
  CloudDownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { exportInvestorsList } from "../../../services/ApiHandler";

const { Link } = Typography;

const InvestorsTable = ({
  fetchInvestorsList,
  investorsData,
  setInvestorsData,
  loading,
  setLoading,
  currentPage,
  total,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Individual Vip",
      value: "IndividualVip",
    },
    {
      label: "Individual Regular",
      value: "IndividualRegular",
    },
    {
      label: "Institutional",
      value: "Institutional",
    },
  ];
  const exportList = async () => {
    try {
      setExportLoading(true);
      const response = await exportInvestorsList({
        page_no: currentPage,
        per_page: 15,
      });
      const link = document.createElement("a");
      link.href = response?.data?.data;
      link.target = "_blank";
      link.download = "exported-file.pdf"; // Set a default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      console.log("exportListError", error);
      message.error("something went wrong");
    }
  };
  const onFilterChange = (value) => {
    console.log("onChange4", value);
    if (value === "all") {
      fetchInvestorsList();
    } else if (value === "IndividualVip") {
      fetchInvestorsList(1, 1, "vip");
    } else if (value === "IndividualRegular") {
      fetchInvestorsList(1, 1, "regular");
    } else if (value === "Institutional") {
      fetchInvestorsList(1, 2, "vip");
    }
    setFilter(value);
  };
  useEffect(() => {
    fetchInvestorsList();
  }, []);
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "name",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
      render: (name) => (
        <b>
          <Link href={`/investors/${name[0]}`} style={{ color: "black" }}>
            {name[1]}
          </Link>
        </b>
      ),
    },
    {
      title: "IBAN Account #",
      dataIndex: "iban",
      key: "iban",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Dnaneer Account #",
      dataIndex: "dnaneer_account_no",
      key: "dnaneer_account_no",
      align: "center",
      render: (dnaneer_account_no) => dnaneer_account_no,
    },
    {
      title: "Dnaneer IBAN #",
      dataIndex: "dnaneer_iban_no",
      key: "dnaneer_iban_no",
      align: "center",
      render: (dnaneer_iban_no) => dnaneer_iban_no,
    },
    {
      title: "Creation Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => (
        <div>
          <div className={`${type}-table-tag`}>
            {" "}
            <div className={`${type}-dot-tag dot`} />
            {type}
          </div>
        </div>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      align: "center",
      render: (mode) => (
        <div>
          <div className={`${mode}-table-tag`}>
            <div className={`${mode}-dot-tag dot`} />
            {mode}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <div>
          <div
            className={`${
              status === "No KYC Step Filled"
                ? "No-KYC-Step-Filled"
                : status === `KYC Step 2 Filled` ||
                  status === `KYC Step 1 Filled`
                ? "KYC-Filled"
                : status
            } status-table-tag`}
          >
            {" "}
            <div className={`dot`} />
            {status}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (type) => (
        <div>
          <MoreOutlined />
        </div>
      ),
    },
  ];
  const filteredData = investorsData?.filter((investor) => {
    const investorData = Object.values(investor).join("").toLowerCase();
    return investorData.includes(searchInput.toLowerCase());
  });
  return (
    <div className="investors-table">
      <Spin spinning={loading}>
        <Row>
          <Col lg={12}>
            <h1>Filters</h1>
          </Col>
          <Col lg={11} style={{ display: "flex", justifyContent: "center" }}>
            <div className="investor-col-two" style={{ gap: 20 }}>
              <div>
                <Select
                  defaultValue={filter}
                  style={{
                    width: 180,
                  }}
                  onChange={onFilterChange}
                  options={filters}
                  popupMatchSelectWidth={false}
                />
              </div>

              <Input
                className="investor-search-input"
                size="large"
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                onClick={exportList}
                icon={<CloudDownloadOutlined />}
                className="export-btn"
                loading={exportLoading}
              >
                Export
              </Button>
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredData}
          // pagination={{
          //   position: ["bottomCenter"],
          //   size: "medium",
          //   current: currentPage,
          //   onChange: (page) => fetchInvestorsList(page),
          //   defaultPageSize: 15,
          //   total: total,
          // }}
          bordered={true}
          onRow={(record) => ({
            onClick: (e) => {
              /* Call some endPoint to log this click event */
              console.log(`user clicked on row ${record.t1}!`);
            },
          })}
          pagination={false}
        />
        <Pagination
          current={currentPage}
          total={total}
          onChange={(page) => {
            if (filter === "all") {
              fetchInvestorsList(page);
            } else if (filter === "IndividualVip") {
              fetchInvestorsList(page, 1, "vip");
            } else if (filter === "IndividualRegular") {
              fetchInvestorsList(page, 1, "regular");
            } else if (filter === "Institutional") {
              fetchInvestorsList(page, 2, "vip");
            }
          }}
          style={{ alignSelf: "flex-end" }}
          defaultPageSize={15}
        />
      </Spin>
    </div>
  );
};

export default InvestorsTable;
