import { ReactComponent as Coins } from "assets/svgs/Coins.svg";
import "./empty.scss";

const Empty = ({ data }) => {
  return (
    <div className="empty-container">
      <Coins />
      <h1>
        {data === "Transactions"
          ? "No Transactions have been made!"
          : data === "Investments"?`No investments have been made!`:`There are no available ${data} now`}
      </h1>
      {data === "Transactions" || data === "Investments" ? "" : <p>check again later</p>}
    </div>
  );
};

export default Empty;
