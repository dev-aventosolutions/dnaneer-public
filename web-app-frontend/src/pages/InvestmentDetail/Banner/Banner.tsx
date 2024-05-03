import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { ReactComponent as Chevron } from "assets/svgs/Chevron.svg";

const OpportunityBanner = () => {
  return (
    <div className="breadcrumb-container">
      <Breadcrumb
        separator={<Chevron />}
        items={[
          {
            title: (
              <Link to="/dashboard">
                <span className="go-back-option">Investment List</span>
              </Link>
            ),
          },
          {
            title: <span className="current-page">Investment Details</span>,
          },
        ]}
      />
    </div>
  );
};

export default OpportunityBanner;
