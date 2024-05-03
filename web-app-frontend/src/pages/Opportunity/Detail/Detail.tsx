import { Divider, Tag } from "antd";
import MainDetail from "./MainDetail";
import FinancingDetail from "./FinancingDetail";
import FundStatus from "./FundStatus";
import { getTimeDifference } from "utils/Helper";
import { getStatusColor } from "utils/GeneralConstants";
import SupportedDocuments from "pages/InvestmentDetail/Detail/SuppportedDocuments";
import { CheckCircleOutlined } from "@ant-design/icons";

const Detail = ({ detailOpportunity }) => {
  //detail
  return (
    <div className="detail box-shadow">
      <div className="detail-header">
        <div className="detail-heading">
          <h1>
            Details
            <Tag
              color={getStatusColor(detailOpportunity.opportunity_status)}
              style={{
                marginLeft: "1rem",
                fontFamily: '"Typo", sans-serif',
              }}
            >
              {`${
                detailOpportunity?.opportunity_status.charAt(0).toUpperCase() +
                detailOpportunity?.opportunity_status.slice(1)
              }`}
            </Tag>
          </h1>

          <div className="detail-time">
            {"Published " +
              getTimeDifference(new Date(detailOpportunity?.custom_created_at))}
          </div>
        </div>

        <div>
          {detailOpportunity.already_invested ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Already Invested
            </Tag>
          ) : null}
        </div>
      </div>
      <Divider />
      <MainDetail detailOpportunity={detailOpportunity} />
      <Divider />
      <FinancingDetail detailOpportunity={detailOpportunity} />
      <Divider />
      <FundStatus detailOpportunity={detailOpportunity} />
      <Divider />
      <SupportedDocuments documents={detailOpportunity?.documents} />
    </div>
  );
};

export default Detail;
