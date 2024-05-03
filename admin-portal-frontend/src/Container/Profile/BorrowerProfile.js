import React, { useEffect, useLayoutEffect, useState } from "react";
import Layout from "../../sharedModules/defaultLayout";
import {
  Row,
  Col,
  Tabs,
  Button,
  Spin,
  message,
  Select,
  Tag,
  Modal,
} from "antd";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import Transactions from "./ProfileComponents/Transactions/Transactions";
import PersonalInformation from "./ProfileComponents/PersonalInformation/PersonalInformation";
import { ReactComponent as EditIcon } from "../../assets/svgs/EditIcon.svg";
import { getSingleBorrower } from "../../services/ApiHandler";

import "./Profile.scss";
import { useParams } from "react-router-dom";
import _ from "lodash";
import BorrowerPersonalInformation from "./ProfileComponents/PersonalInformation/borrowerPersonalInformation";
import UpdateBorrower from "./ProfileComponents/UpdateProfile/Borrower";

const { TabPane } = Tabs;

const BorrowerProfile = () => {
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
      const { data } = await getSingleBorrower(id);
      console.log({data});
      if (data) {
        setUserProfile({
          ...data.data[0],
          wathq: JSON.parse(data?.data[0]?.wathq),
        });
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
    <Layout
      sideKey={
        currentUrl == "admin-users"
          ? "5"
          : currentUrl == "borrowers"
          ? "3"
          : currentUrl === "investors" && "2"
      }
    >
      {/* This logic is written for fast work it will change by time */}
      <Spin spinning={loading}>
        {userProfile && (
          <>
            <Modal
              width={900}
              centered
              className="logout-modal"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={false}
            >
              <UpdateBorrower
                setIsModalOpen={setIsModalOpen}
                userProfile={userProfile}
                apiCall={apiCall}
              />
            </Modal>
            <div className="profile-container">
              <Row>
                <Col lg={24}>
                  <div className="user-profile">
                    <div>
                      <ImageUpload
                        src={userProfile?.profile_image_url}
                        userProfile={userProfile}
                      />
                    </div>
                    <div className="profile-col-two">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        <div className={`Individual-user-role`}>
                          <span>Company</span>
                        </div>
                      </div>

                      <h1>
                        {userProfile?.name ? userProfile?.name : "Borrower"}
                        {/* <span>
                          Dnaneer Acc # {userProfile?.accounts?.wallet_id}
                        </span> */}
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
                            {userProfile?.saudi_id_number
                              ? userProfile?.saudi_id_number
                              : "-"}
                          </h2>
                        </div>
                        <div className="line" />
                        <div className="info">
                          <p>Personal IBAN Number</p>
                          <h2>{userProfile?.personal_iban_number ?? "-"}</h2>
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
                          onClick={showModal}
                        >
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Tabs onChange={onChange}>
                    <TabPane tab="Company Information" key="1">
                      <BorrowerPersonalInformation
                        editInfo={editInfo}
                        userProfile={userProfile}
                      />
                    </TabPane>
                    {/* <TabPane tab="Transactions" key="3">
                      <Transactions editInfo={editInfo} />
                    </TabPane> */}
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

export default BorrowerProfile;
