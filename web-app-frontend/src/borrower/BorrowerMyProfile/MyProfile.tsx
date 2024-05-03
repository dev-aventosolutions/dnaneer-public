import BorrowerLayout from "borrower/BorrowerLayout/BorrowerLayout";
import { useEffect, useState } from "react";
import Button from "components/Button/Button";
import ImageUpload from "components/ImageUpload/ImageUpload";
import { Row, Col, Tabs } from "antd";
// import AccountContent from "./ProfileComponents/Account/Account";
import BorrowerInformation from "borrower/Components/BorrowerInformation/BorrowerInformation";
import { getBorrowerDetails } from "services/BorrowerApis";

const MyProfile = () => {
  const [profileDetail, setProfileDetail] = useState<any>({});



  const getProfileDetails = async () => {
    try {
      const { data } = await getBorrowerDetails();
      if (data) {
        setProfileDetail(data.data.user);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
    }
  };
  const items = [
    {
      key: "1",
      label: "Information",
      children: (
        <BorrowerInformation
          // editInfo={editInfo}
          profileDetail={profileDetail}
          getProfileDetails={getProfileDetails}
        />
      ),
    },
  ];
  useEffect(() => {
    getProfileDetails();
  }, []);
  return (
    <BorrowerLayout sideKey="2">
      <div className="profile-container">
        <Row>
          <Col lg={24}>
            <div className="user-profile">
              <div>
                <ImageUpload
                  userProfile={profileDetail}
                  src={profileDetail?.profile_image_url}
                />
              </div>
              <div className="profile-col-two">
                <div className="user-role">
                  <span>Company</span>
                </div>
                <h1>
                  {profileDetail?.name}
                  <span>
                    IBAN #{" "}
                    {profileDetail?.accounts?.personal_iban_number ?? "-"}
                  </span>
                </h1>
                <p>{profileDetail?.borrower?.position ?? "-"}</p>
                <div className="additional-information">
                  <div className="info">
                    <p>Email</p>
                    <h2>{profileDetail?.email ?? "-"}</h2>
                  </div>
                  <div className="line" />
                  <div className="info">
                    <p>National ID Number</p>
                    <h2>{profileDetail?.borrower?.saudi_id_number ?? "-"}</h2>
                  </div>
                  <div className="line" />
                  <div className="info">
                    <p>IBAN</p>
                    <h2>
                      {profileDetail?.accounts?.personal_iban_number ?? "-"}
                    </h2>
                  </div>
                  {/* <div className="line" />
                  <div className="info">
                    <p>Capital</p>
                    <h2>{profileDetail?.borrower?.capital ?? "-"} SAR</h2>
                  </div>
                  <div className="line" />
                  <div className="info">
                    <p>CR Expiry Date</p>
                    <h2>{profileDetail?.borrower?.cr_expiry_date ?? "-"}</h2>
                  </div>
                  <div className="line" />
                  <div className="info">
                    <p>National Address</p>
                    <h2>{profileDetail?.borrower?.address ?? "-"}</h2>
                  </div> */}
                </div>
              </div>
              {/* <div className="edit-info">
                {editInfo ? (
                  <div className="profile-btns">
                    <p onClick={() => setEditInfo(false)}>Discard</p>
                    <Button
                      className="profile-save-btn"
                      onClick={() => setEditInfo(false)}
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

            <Tabs items={items} />
          </Col>
        </Row>
      </div>
    </BorrowerLayout>
  );
};

export default MyProfile;
