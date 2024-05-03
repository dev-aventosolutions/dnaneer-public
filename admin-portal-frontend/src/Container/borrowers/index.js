import React, { useEffect, useState } from "react";
import { Row, Col, Button, Spin, Input, message } from "antd";
import Layout from "../../sharedModules/defaultLayout";
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import AllBorrowers from "./AllBorrowers/AllBorrowers";
import { exportBorrowersList, getBorrowerList } from "../../services/ApiHandler";
// import RequestedBorrowers from './RequestedBorrowers/RequestedBorrowers';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [borrowerData, setBorrowerData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [flag, setFlag] = useState(false);
  const [id, setId] = useState("");
  const [visible, setVisible] = useState(false);
 const [exportLoading, setExportLoading] = useState(false);

 const exportList = async () => {
   try {
     setExportLoading(true);
     const response = await exportBorrowersList({
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
  const filteredData = borrowerData?.filter((investor) => {
    const investorData = Object.values(investor).join("").toLowerCase();
    return investorData.includes(searchInput.toLowerCase());
  });
  const handleOk = async () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  const handlePageChange = (page) => {
    setPage(page);
    // You can make an API call to fetch data for the new page here
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getBorrowerList(page);
        if (data) {
          console.log("getInvestorsList---->", data?.data?.[0]?.data);
          const finalData = data?.data?.[0]?.data?.map((borrower) => {
            const wathiqInfo = JSON.parse(borrower?.wathq);
            return {
              key: borrower?.id,
              email: borrower?.email ? borrower?.email : "-",
              name: borrower?.name ? [borrower.id, borrower.name] : "-",
              cr_number: borrower?.cr_number ? borrower?.cr_number : "-",
              data: borrower,
              kyc_step: borrower?.kyc_step,
              cr_name: wathiqInfo?.crName ?? "-",
            };
          });
          console.log("final Data", finalData);
          setBorrowerData(finalData);
          setPagination(data?.data?.[0]);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);
  return (
    <Layout sideKey="3">
      <div>
        <div className="rounded-header">
          <Row style={{ alignItems: "center" }}>
            <Col lg={12}>
              <h1>All Borrowers</h1>
            </Col>
            <Col lg={11}>
              <div className="investor-col-two">
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
                  loading={exportLoading}
                  icon={<CloudDownloadOutlined />}
                  className="export-btn"
                >
                  Export
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Spin spinning={loading}>
          <div className="round-div">
            <AllBorrowers
              setLoading={setLoading}
              handleOk={handleOk}
              handleCancel={handleCancel}
              filteredData={filteredData}
              visible={visible}
              id={id}
              page={page}
              pagination={pagination}
              handlePageChange={handlePageChange}
              flag={flag}
              setFlag={setFlag}
              setId={setId}
              showModal={showModal}
            />
          </div>
        </Spin>
      </div>
    </Layout>
  );
};

export default Home;
