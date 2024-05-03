import { Button } from "antd";
import { getTimeDifference } from "utils/Helper";
const ThirdColumn = ({ onViewDetail, opportunity }) => {
  return (
    <div className="card-third-col">
      <Button
        shape="round"
        style={{ width: "98px", fontSize: "12px", height: "38px" }}
        type="primary"
        onClick={onViewDetail}
      >
        Details
      </Button>
      <div>
        <p className="card-text">
          {"Published " +
            getTimeDifference(new Date(opportunity?.custom_created_at))}
        </p>
      </div>
    </div>
  );
};

export default ThirdColumn;
