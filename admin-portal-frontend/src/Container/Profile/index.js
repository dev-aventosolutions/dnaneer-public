import React, { useEffect, useLayoutEffect, useState } from "react";
import Layout from "../../sharedModules/defaultLayout";
import { Row, Col, Tabs, Button, Spin, message, Select, Tag } from "antd";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import Transfer from "./ProfileComponents/Transfer/Transfer";
import Transactions from "./ProfileComponents/Transactions/Transactions";
import PersonalInformation from "./ProfileComponents/PersonalInformation/PersonalInformation";
import Modal from "../../sharedModules/Modal/Modal";
import Institutional from "./ProfileComponents/UpdateProfile/Institutional";
import Individual from "./ProfileComponents/UpdateProfile/Individual";
import { ReactComponent as EditIcon } from "../../assets/svgs/EditIcon.svg";
import { getInvestor } from "../../services/ApiHandler";

import "./Profile.scss";
import { useParams } from "react-router-dom";
import VipRequest from "./ProfileComponents/VipRequest/VipRequest";
const { Option } = Select;

const { TabPane } = Tabs;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [tabKey, setTabKey] = useState("1");
  const params = useParams();
  const apiCall = async () => {
    const id = params.id;
    try {
      setLoading(true);
      const { data } = await getInvestor(id);
      if (data) {
        console.log("getInvestor", data.data[0]);

        setUserProfile(data.data[0]);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  //For fetching URL for sidebar Highligth
  useLayoutEffect(() => {
    let url = window.location.href;
    let last = url.split("/");
    setCurrentUrl(last[last?.length - 2]);
  }, []);

  const onChange = (key) => {
    if (key === "1") {
      setEditAccount(false);
    }
    setTabKey(key);
    setEditInfo(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log("handleOk", handleOk);
    localStorage.removeItem("institutional");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout sideKey={currentUrl == "admin-users" ? "5" : "2"}>
      {/* This logic is written for fast work it will change by time */}
      <Spin spinning={loading}>
        {userProfile && (
          <>
            <Modal
              width={900}
              centered
              className="logout-modal"
              isModalVisible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={false}
            >
              {userProfile.institutional ? (
                <Institutional
                  setIsModalOpen={setIsModalOpen}
                  userProfile={userProfile}
                  apiCall={apiCall}
                />
              ) : (
                <Individual
                  setIsModalOpen={setIsModalOpen}
                  userProfile={userProfile}
                  apiCall={apiCall}
                />
              )}
            </Modal>
            <div className="profile-container">
              <Row>
                <Col lg={24}>
                  <div className="user-profile">
                    <div>
                      <ImageUpload
                        src={userProfile.profile_image_url}
                        userProfile={userProfile}
                      />
                    </div>
                    <div className="profile-col-two">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          className={`${
                            userProfile.user_type === 2
                              ? "Institutional"
                              : "Individual"
                          }-user-role`}
                        >
                          <span>
                            {userProfile.user_type === 2
                              ? "Institutional"
                              : "Individual"}{" "}
                            investor
                          </span>{" "}
                        </div>
                        {userProfile?.mode === "vip" &&
                          userProfile.user_type === 1 && (
                            <Tag
                              color="gold"
                              style={{
                                marginLeft: ".5rem",
                                fontFamily: '"Typo", sans-serif',
                                color: "#d48806",
                                background: "#fffbe6",
                                borderColor: "#ffe58f",
                                border: "1px solid #ffe58f",
                                borderRadius: "8px",
                                fontSize: "11px",
                                boxSizing: "border-box",
                                lineHeight: "20px",
                                padding: 0,
                                fontWeight: "500",
                                minWidth: "45px",
                                height: "auto",
                              }}
                            >
                              VIP💥
                            </Tag>
                          )}
                      </div>

                      <h1>
                        {userProfile?.name ? userProfile?.name : "Investor"}{" "}
                        <span>
                          Dnaneer Acc #{" "}
                          {userProfile?.accounts?.dnaneer_account_no}
                        </span>
                      </h1>
                      <p>{userProfile?.institutional?.position}</p>
                      <div className="additional-information">
                        <div className="info">
                          <p>Email</p>
                          <h2>{userProfile.email}</h2>
                        </div>
                        <div className="line" />
                        <div className="info">
                          <p>National ID Number</p>
                          <h2>
                            {userProfile?.national_id
                              ? userProfile?.national_id
                              : "-"}
                          </h2>
                        </div>
                        <div className="line" />
                        <div className="info">
                          <p>Personal IBAN Number</p>
                          <h2>{userProfile?.accounts?.personal_iban_number}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="edit-info">
                      <div style={{ display: "flex" }}>
                        <Button
                          className="profile-edit-btn"
                          icon={<EditIcon />}
                          onClick={() => setEditInfo(true)}
                        >
                          Export
                        </Button>

                        <Button
                          style={{ margin: "0 15px", width: "200px" }}
                          className="profile-edit-btn"
                          icon={<EditIcon />}
                          onClick={() => setIsModalOpen(true)}
                        >
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Tabs onChange={onChange}>
                    <TabPane tab="Investor Information" key="1">
                      <PersonalInformation
                        editInfo={editInfo}
                        userProfile={userProfile}
                      />
                    </TabPane>
                    {/* <TabPane tab="Investment Requests" key="2">
                      <Transfer
                        tabKey={tabKey}
                        editAccount={editAccount}
                        setEditAccount={setEditAccount}
                      />
                    </TabPane> */}
                    <TabPane tab="Transactions" key="3">
                      <Transactions editInfo={editInfo} />
                    </TabPane>
                    {/* <TabPane tab="VIP Request" key="4">
                      <VipRequest userProfile={userProfile} />
                    </TabPane> */}
                    {/* <TabPane tab="KYC Request" key="5">
                      <VipRequest userProfile={userProfile} />
                    </TabPane> */}
                    {/* {userProfile.institutional ? (
                      <TabPane tab="Wathq Information" key="6">
                        <VipRequest userProfile={userProfile} />
                      </TabPane>
                    ) : (
                      userProfile.individual && (
                        <TabPane tab="Nafath Information" key="6">
                          <VipRequest userProfile={userProfile} />
                        </TabPane>
                      )
                    )} */}
                  </Tabs>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Spin>
    </Layout>
  );
};

export default Profile;
