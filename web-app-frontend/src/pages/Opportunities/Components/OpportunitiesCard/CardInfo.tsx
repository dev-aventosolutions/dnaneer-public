import { Progress } from "antd";
import Tag from "components/Tags/Tags";
import { commaSeparator } from "utils/Helper";

const tags = [
  "12 months",
  "Opportunity date: 25 Feb, 2023",
  "Annual ROI 17.5%",
];

const CardInfo = ({ id, opportunity }) => {
  return (
    <div className="card-info">
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontWeight: "700" }}>#{opportunity.opportunity_number}</h3>
        <h5 style={{ marginLeft: "10px" }}>{opportunity.industry_name}</h5>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* {tags.map((tagName) => (
          <Tag key={tagName} tag={tagName} />
        ))} */}
        <Tag tag={opportunity.duration + " months"}></Tag>
        <Tag
          tag={"Opportunity date: " + opportunity?.custom_created_at?.split("T")[0]}
        ></Tag>
        <Tag tag={"Annual ROI " + opportunity.annual_roi + "%"}></Tag>
        <Tag tag={"Due date " + opportunity.due_date}></Tag>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "31px 0 12px 0",
        }}
      >
        <div>
          <div style={{ color: "#5B2CD3" }}>
            <span
              style={{ fontSize: "18px", color: "#5B2CD3", fontWeight: "700" }}
            >
              {commaSeparator(opportunity.fund_collected)}
            </span>
            <span
              style={{ fontSize: "12px", marginLeft: "5px", fontWeight: "500" }}
            >
              SAR
            </span>
          </div>
          <div
            style={{ fontSize: "12px", color: "#8A8595", fontWeight: "500" }}
          >
            {(
              (opportunity.fund_collected / opportunity.fund_needed) *
              100
            ).toFixed(2)}
            % Collected
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div>
            <span
              style={{ fontSize: "15px", marginLeft: "5px", fontWeight: "800" }}
            >
              {commaSeparator(opportunity.fund_needed)}
            </span>
            <span
              style={{ fontSize: "12px", marginLeft: "5px", fontWeight: "500" }}
            >
              SAR
            </span>
          </div>
          <div
            style={{ fontSize: "12px", color: "#8A8595", fontWeight: "500" }}
          >
            Fund Needed
          </div>
        </div>
      </div>
      <Progress
        strokeColor="#5B2CD3"
        //   type=""
        percent={parseFloat(
          (
            (opportunity.fund_collected / opportunity.fund_needed) *
            100
          ).toFixed(2)
        )}
        //   size={[600,15]}
      />
    </div>
  );
};

export default CardInfo;
