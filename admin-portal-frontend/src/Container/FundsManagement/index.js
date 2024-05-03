import React, { useState, useEffect } from "react";
import {
  Space,
  Avatar,
  Row,
  Col,
  Button,
  message,
  Tag,
  Table,
  Form,
  Spin,
  Popover,
  Input,
  Breadcrumb,
  Tabs,
} from "antd";
import Modal from "../../sharedModules/Modal/Modal";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import {
  getAdvisorsList,
  deleteAdvisor,
  getAdvisor,
  getStatement,
  getEODStatement,
} from "../../services/ApiHandler";
import Layout from "../../sharedModules/defaultLayout";
import { getBalance } from "../../../src/services/ApiHandler"
import { SearchOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import Statement from "./Statement";
import EODstatement from "./EODstatement";
// import AdvisorForm from "./AdvisorForm";
// import EditAdvisor from "./AdvisorForm/EditAdvisor"

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [edit, setEdit] = useState(false)
  const [account, setAccount] = useState(0);
  const [balance, setBalance] = useState(null);
  // const [generateAccount, setGenerateAccount] = useState(0);
  // const [generateReport, setGenerateReport] = useState([]);
  // const [date, setDate] = useState("");
  // const [start, setStart] = useState("");
  // const [end, setEnd] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getAdvisorsList();
        const baseUrl = process.env.REACT_APP_baseURL;
        if (data) {
          console.log("getAdvisorsList", data.data[0]);
          const finalData = data.data[0].map((advisor) => {
            return {
              key: advisor.id,
              date: advisor.created_at.split("T")[0],
              email: advisor.email,
              image: `${baseUrl}${advisor.image}`,
              name: advisor.name,
              phone: advisor.phone_no,
              whatsApp: advisor.whatsapp_no,
              action: advisor.id,
            };
          });

          setTableData(finalData);

          // setInvestorsData()
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  // const deleteUserHandler = async (id) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await deleteAdvisor(id);
  //     if (data) {
  //       console.log("deleteAdvisor", data);
  //       window.location.reload();
  //       message.success(data.message);
  //       // setInvestorsData()
  //     }
  //   } catch (error) {
  //     console.log("err", error.response.data.message);
  //     message.error(error.response.data.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGenerateSearch = async () => {
  //   try {
  //     const response = await getStatement(generateAccount, start, end);
  //     console.log('response', response)
  //     setGenerateReport(response?.data)
  //     // message.success(response?.data?.message);
  //   } catch (error) {
  //     console.log("err", error.response.data.message);
  //     message.error(error.response.data.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const handleEODSearch = async () => {
  //   try {
  //     const response = await getEODStatement(date);
  //     console.log('response', response)
  //     setGenerateReport(response?.data)
  //     // message.success(response?.data?.message);
  //   } catch (error) {
  //     console.log("err", error.response.data.message);
  //     message.error(error.response.data.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleSearch = async () => {
    try {
      const response = await getBalance(account);
      console.log('response', response)
      setBalance(response)
      if (response.data.code == 401) {
        message.error(response.data.message)
      }
      // message.success(response?.response?.data?.message);
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
      getBalance()
    } finally {
      setLoading(false);
    }
  }

  // const editAdvisorHandler = async (id) => {
  //   setEdit(true)
  //   try {
  //     setLoading(true);
  //     const { data } = await getAdvisor(id);
  //     if (data) {
  //       console.log("getAdvisor", data.data[0]);
  //       const advisor = data.data[0];
  //       setInitialValues({
  //         email: advisor.email,
  //         id: advisor.id,
  //         name: advisor.name,
  //         phone: advisor.phone_no,
  //         whatsapp: advisor.whatsapp_no,
  //       });
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.log("err", error.response.data.message);
  //     message.error(error.response.data.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const items = [
    {
      key: "1",
      label: `Statement`,
      children: <Statement />,
    },
    {
      key: "2",
      label: `EOD Statement`,
      children: <EODstatement />,
    },
  ];
  return (
    <Layout sideKey="8">
      <Spin spinning={loading}>
        <div className="round-div" >
          <div className="rounded-header">
            <Row justify="center" align="middle">
              <Col>
                <h1>Balance Check</h1>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col style={{ display: "flex" }}>
                <div className="investor-col-two">
                  <Input
                    className="investor-search-input"
                    size="large"
                    placeholder="Enter Account Number"
                    onChange={(e) => { setAccount(e.target.value) }}
                  />
                  <Button onClick={() => { handleSearch(); setLoading(true) }} icon={<SearchOutlined />} className="fund-search-button" shape="round" >
                    Check
                  </Button>
                </div>
              </Col>
              {/* <Col style={{ display: "flex" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button className="fund-check-button" shape="round">
                    Check
                  </Button>
                </div>
              </Col> */}
            </Row>
          </div>

          {balance ? <div className="rounded-body" style={{ marginTop: "30px", marginLeft: "25px", marginRight: "25px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ paddingLeft: "12px" }}>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><h3>Account Number</h3></Col>
                </Row>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><p>{balance?.accountNumber ? balance?.accountNumber : "-"}</p></Col>
                </Row>
              </div>
              <div style={{ paddingLeft: "12px" }}>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><h3>Cleared Balance</h3></Col>
                </Row>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><p>{balance?.clearedBalance ? balance?.clearedBalance?.toLocaleString() : "0"}</p></Col>
                </Row>
              </div>
              <div style={{ paddingLeft: "12px" }}>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><h3>Currency</h3></Col>
                </Row>
                <Row justify="flex-start" align="middle">
                  <Col style={{ paddingLeft: "10px" }} ><p>{balance?.currency ? balance?.currency : "-"}</p></Col>
                </Row>
              </div>
            </div>
          </div> :
            <div className="rounded-body" style={{ marginTop: "50px", marginLeft: "25px", marginRight: "25px" }}></div>
          }

        </div>

        <Tabs
          defaultActiveKey="1"
          items={items}

        />
      </Spin>
    </Layout>
  );
};

export default Home;
