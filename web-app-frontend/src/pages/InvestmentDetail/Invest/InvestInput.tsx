import { Input } from "antd";

const InvestInput = ({
  investInpuVal,
  setInvestInput,
  handlePercentage,
  handleMode,
  hasBalance,
}) => {
  return (
    <div className="invest-input">
      {handleMode() === "regular" && handlePercentage() > 25 ? (
        <span className="errorMessage">
          You can't invest more than 25% of the total required amount or more
          than your total balance
        </span>
      ) : !hasBalance() ? (
        <span className="errorMessage">
          You can't invest more than the total required amount or more than your
          total balance
        </span>
      ) : (
        handleMode() === "vip" &&
        handlePercentage() > 100 && (
          <span className="errorMessage">
            You can't invest more than the total required amount
          </span>
        )
      )}

      <Input
        // shape="round"
        value={investInpuVal}
        onChange={(e) => {
          const { value } = e.target;
          const onlyNumbersRegex = /^\d*$/;
          // Remove non-numeric characters
          const numericValue = value.replace(/\D/g, "");
          // Format with commas
          const formattedValue = numericValue.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );
          // Perform regex test
          const isValid = onlyNumbersRegex.test(numericValue);
          if (isValid) {
            setInvestInput(formattedValue);
          }
        }}
        style={{ background: "#fff", fontWeight: "700" }}
        suffix="SAR"
        placeholder="Enter the amount"
      />
    </div>
  );
};

export default InvestInput;
