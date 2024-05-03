
import { ReactComponent as BankWhite } from "assets/svgs/BankWhite.svg";
import { ReactComponent as TransferForward } from "assets/svgs/TransferForward.svg";
import { ReactComponent as CardWhite } from "assets/svgs/CardWhite.svg";

const Transfer = ({ handleNext }) => {
  return (
    <div>
      <h1>Transfer balance</h1>
      <div className="transfer-selection" onClick={handleNext}>
        <div style={{ display: "flex" }}>
          <BankWhite />
          <h2>Transfer by Bank</h2>
        </div>
        <div>
          <TransferForward />
        </div>
      </div>
      <div className="transfer-selection">
        <div style={{ display: "flex", alignItems: "center" }}>
          <CardWhite />
          <h2>Transfer by Card</h2>
        </div>
        <p className="soon">soon</p>
      </div>
    </div>
  );
};

export default Transfer