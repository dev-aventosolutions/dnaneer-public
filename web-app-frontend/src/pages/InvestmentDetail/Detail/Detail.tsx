import { Divider, Tag } from "antd";
import MainDetail from "./MainDetail";
import FinancingDetail from "./FinancingDetail";
import FundStatus from "./FundStatus";
import SupportedDocuments from "./SuppportedDocuments";
import { getTimeDifference } from "utils/Helper";
import { getStatusColor } from "utils/GeneralConstants";
const Detail = ({ detailInvestment }) => {
  //detail
  return (
    <div className="detail box-shadow">
      <div className="detail-header">
        <div className="detail-heading">
          <h1>
            Details
            <Tag
              color={getStatusColor(detailInvestment.opportunity_status)}
              style={{ marginLeft: "1rem" }}
            >
              {detailInvestment?.opportunity_status.charAt(0).toUpperCase() +
                detailInvestment?.opportunity_status.slice(1)}
            </Tag>
          </h1>

          <div className="detail-time">
            {"Published " +
              getTimeDifference(new Date(detailInvestment?.created_at))}
          </div>
        </div>

        <div>
          {detailInvestment.already_invested ? (
            <h1>Already Invested</h1>
          ) : null}
        </div>
      </div>
      <Divider />
      <MainDetail detailInvestment={detailInvestment} />
      <Divider />
      <FinancingDetail detailInvestment={detailInvestment} />
      <Divider />
      <FundStatus detailInvestment={detailInvestment} />
      <Divider />
      <SupportedDocuments documents={detailInvestment?.documents} />
    </div>
  );
};

export default Detail;
