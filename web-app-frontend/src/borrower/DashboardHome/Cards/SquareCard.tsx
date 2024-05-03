import AppCard from "components/Card/Card";
import "./cards.scss";

const cardColors = {
  blue: "#2B48F4",
  lightBlue: "#73DCFA",
  green: "#2BDAAE",
};

const SquareCard = ({ title, value, backgroundColor }) => {
  return (
    <AppCard className={"card-wrapper"}>
      <div className="sqaure-card-content">
        <div
          style={{ backgroundColor: cardColors[backgroundColor] }}
          className="title"
        >
          {title}
        </div>
        <div className="value">{value}</div>
      </div>
    </AppCard>
  );
};

export default SquareCard;
