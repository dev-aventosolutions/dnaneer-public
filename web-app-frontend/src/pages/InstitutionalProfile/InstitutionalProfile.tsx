import { useState, useEffect, useLayoutEffect } from "react";
import Button from "components/Button/Button";
import ImageUpload from "components/ImageUpload/ImageUpload";
import Modal from "components/Modal/Modal";
import { Row, Col, Tabs, Spin } from "antd";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import AccountContent from "./ProfileComponents/Account/Account";
import PersonalInformation from "./ProfileComponents/PersonalInformation/PersonalInformation";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import { ReactComponent as EditIcon } from "assets/svgs/EditIcon.svg";
import { ReactComponent as Thanks } from "assets/svgs/Thanks.svg";

import "./Profile.scss";
import { Navigate, useNavigate } from "react-router-dom";
import { getProfile } from "services/Login";

const InstitutionalProfile = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [editInfo, setEditInfo] = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getProfile();
        if (data) {
          const userData = {
            ...data.data.user,
            nafath: await JSON.parse(data.data.user.nafath),
          };

          setUserProfile(userData);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [update]);

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
    navigate("/dashboard");
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    navigate(-1);
    // setIsModalOpen(false);
  };

  useLayoutEffect(() => {
    if (userProfile?.kyc_step < 5) {
      setIsModalOpen(true);
      setLoading(true);
    } else {
      setIsModalOpen(false);
      setLoading(false);
    }
  }, [userProfile]);

  const items = [
    {
      key: "1",
      label: "My Information",
      children: (
        <PersonalInformation
          userProfile={userProfile}
          setUpdate={setUpdate}
          update={update}
        />
      ),
    },
    {
      key: "2",
      label: "Account",
      children: (
        <AccountContent
          tabKey={tabKey}
          editAccount={editAccount}
          setEditAccount={setEditAccount}
          userProfile={userProfile}
          mode={userProfile?.mode}
          setUpdate={setUpdate}
          update={update}
        />
      ),
    },
  ];

  return (
    <DashboardLayout sideKey="4">
      {userProfile.email === "" ? (
        <></>
      ) : (
        <>
          {userProfile.kyc_step < 5 ? (
            <>
              {" "}
              <Modal
                centered
                className="logout-modal"
                isModalVisible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
              >
                <div className="log-icon">
                  <Thanks />
                </div>

                <h1>
                  {userProfile.kyc_step < 3
                    ? "Please Complete your KYC form to view Profile"
                    : userProfile.kyc_step == 3
                    ? "Your KYC request is under review"
                    : "Your KYC request is rejected. Please contact Administrator"}
                </h1>
                <Button
                  onClick={handleOk}
                  block
                  style={{ marginTop: "50px", height: "52px" }}
                >
                  Ok
                </Button>
                <p className="cancel" onClick={() => navigate(-1)}>
                  Back
                </p>
              </Modal>
            </>
          ) : null}
          <Spin spinning={loading}>
            <div className="profile-container">
              <Row>
                <Col lg={24}>
                  <div className="user-profile">
                    <div>
                      <ImageUpload
                        userProfile={userProfile}
                        src={userProfile?.profile_image_url}
                      />
                    </div>
                    <div className="profile-col-two">
                      <div className="user-role">
                        <span>{"Institutional investor"}</span>{" "}
                      </div>
                      <h1>
                        {userProfile?.name
                          ? userProfile?.name
                          : userProfile?.email}{" "}
                        <span>
                          Dnaneer Acc #{" "}
                          {userProfile?.accounts?.dnaneer_account_no
                            ? userProfile?.accounts?.dnaneer_account_no
                            : "******"}
                        </span>
                      </h1>
                      {/* <p>{userProfile?.institutional?.position ? userProfile?.institutional?.position : "-"}</p> */}
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
                          <p>Personal IBAN</p>
                          <h2>
                            {userProfile?.accounts?.personal_iban_number
                              ? userProfile?.accounts?.personal_iban_number
                              : "-"}
                          </h2>
                        </div>
                      </div>
                    </div>
                    {/* <div className="edit-info">
                    {editInfo ? (
                      <div className="profile-btns">
                        <p onClick={() => setEditInfo(false)}>Discard</p>
                        <Button
                          className="profile-save-btn"
                          htmlType="submit"
                          onClick={() => {
                            setEditInfo(false);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : tabKey === "1" ? (
                      <div>
                        <Button
                          className="profile-edit-btn"
                          icon={<EditIcon />}
                          onClick={() => setEditInfo(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    ) : null}
                  </div> */}
                  </div>

                  <Tabs items={items} onChange={onChange} />
                </Col>
              </Row>
            </div>
          </Spin>
        </>
      )}
    </DashboardLayout>
  );
};

export default InstitutionalProfile;
