import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spin, message } from "antd";
import Header from "components/Header/Header";
import OpportunityBanner from "./Banner/Banner";
import Invest from "./Invest/Invest";
import Detail from "./Detail/Detail";
import "./opportunity.scss";
import { getOpportunityDetail } from "services/Login";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";

const Opportunity = () => {
  const [loading, setLoading] = useState(false);
  const [detailOpportunity, setDetailOpportunity] = useState(null);
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);

  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getOpportunityDetail({
          id: params.id,
        });
        if (data) {
          setDetailOpportunity(data?.data[0]);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <Header />
      <Spin spinning={loading}>
        {detailOpportunity ? (
          <>
            <div className="opportunity-container">
              <OpportunityBanner />
              <br />
              {userProfile.kyc_step == 0 ||
              userProfile.kyc_step == 1 ||
              userProfile.kyc_step == 2 ? (
                <div className="statusCheck">
                  Please complete your KYC Steps.
                </div>
              ) : userProfile.kyc_step == 3 ? (
                <div className="statusCheck2">
                  You can't invest until your KYC request is approved by Dnaneer
                  admin team!
                </div>
              ) : null}

              <Row gutter={[24, 8]}>
                <Col flex="auto">
                  <Detail detailOpportunity={detailOpportunity} />
                </Col>
                <Col >
                  <Invest detailOpportunity={detailOpportunity} />
                </Col>
              </Row>
            </div>
          </>
        ) : null}
      </Spin>
    </>
  );
};

export default Opportunity;
