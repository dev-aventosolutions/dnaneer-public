import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tabs, Spin, message, Input } from "antd";
import Modal from "../../sharedModules/Modal/Modal";
import AddOpportunityForm from "../../sharedModules/AddOpportunityForm/AddOpportunityForm";
import Layout from "../../sharedModules/defaultLayout";
import { getOpportunityList } from "../../services/ApiHandler";
import OpportunitiesCard from "../../sharedModules/OpportunityCards/OpportunitiesCard";
import { SearchOutlined } from "@ant-design/icons";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [opportunityList, setOpportunityList] = useState([]);

  const fetchOpportunityList = async () => {
    try {
      setLoading(true);
      const { data } = await getOpportunityList();
      if (data) {
        console.log("getOpportunityList", data.data[0]);
        setOpportunityList(data.data[0]);
        setFilteredData(data.data[0]);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   fetchOpportunityList()
  }, []);

  const refreshHandler = async () => {
  fetchOpportunityList()
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("institutional");
    setIsModalOpen(false);
    refreshHandler();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Filter the data based on the search value
    const filtered = opportunityList?.filter((item) => {
      // Convert the opportunity number to lowercase for case-insensitive search
      const opportunityNumber = item?.opportunity_number
        ?.toString()
        ?.toLowerCase();
      return opportunityNumber?.includes(value.toLowerCase());
    });

    setFilteredData(filtered);
  };

  return (
    <Layout sideKey="1">
      <Spin spinning={loading}>
        <Modal
          width={900}
          centered
          className="logout-modal"
          isModalVisible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
        >
          <AddOpportunityForm
            setIsModalOpen={setIsModalOpen}
            refreshHandler={refreshHandler}
          />
        </Modal>
        <div className="round-div">
          <div className="rounded-header">
            <Row justify="space-between" align="middle">
              <Col>
                <h1>Opportunities</h1>
              </Col>
              <Col>
                <div style={{ display: "flex" }}>
                  <Button
                    type="gray"
                    shape="round"
                    style={{ marginRight: "15px" }}
                    onClick={() => showModal()}
                  >
                    Add Opportunity
                  </Button>
                  <Button
                    type="gray"
                    shape="round"
                    style={{ marginRight: "15px" }}
                    onClick={refreshHandler}
                  >
                    Refresh
                  </Button>
                  <Button type="gray" shape="round">
                    Export
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="rounded-body">
            <div>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: "All",
                    key: "1",
                    children: (
                      <>
                        <Row>
                          <Col lg={12}>
                            <h1 style={{ marginLeft: "20px" }}>Filters</h1>
                          </Col>
                          <Col lg={11}>
                            <div
                              className="investor-col-two"
                              style={{ marginTop: "18px" }}
                            >
                              <Input
                                className="investor-search-input"
                                size="large"
                                placeholder="Search"
                                prefix={<SearchOutlined />}
                                value={searchValue}
                                onChange={handleSearch}
                              />
                            </div>
                          </Col>
                        </Row>
                        {filteredData.length >= 1 ? (
                          filteredData?.map((opportunity, i) => {
                            return (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            );
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                  {
                    label: "Active",
                    key: "2",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return opportunity?.opportunity_status ==
                              "active" ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                  {
                    label: "Inactive",
                    key: "3",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return opportunity?.opportunity_status ==
                              "inactive" ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },

                  {
                    label: "Coming soon",
                    key: "4",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return opportunity?.opportunity_status ==
                              "comingsoon" ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                  {
                    label: "Investment Completed",
                    key: "5",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return parseInt(opportunity?.fund_collected) >=
                              parseInt(opportunity?.fund_needed) ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                  {
                    label: "Settled",
                    key: "6",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return opportunity?.opportunity_status ==
                              "settled" ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                  {
                    label: "Defaulted",
                    key: "7",
                    children: (
                      <>
                        {opportunityList.length >= 1 ? (
                          opportunityList.map((opportunity, i) => {
                            return opportunity?.opportunity_status ==
                              "defaulted" ? (
                              <div key={i}>
                                <OpportunitiesCard opportunity={opportunity} />
                              </div>
                            ) : null;
                          })
                        ) : (
                          <h1 style={{ paddingLeft: "15px" }}>
                            No Opportunity Found
                          </h1>
                        )}
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Spin>
    </Layout>
  );
};

export default Home;
