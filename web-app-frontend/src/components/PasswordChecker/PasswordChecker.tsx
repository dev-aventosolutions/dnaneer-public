import { ReactComponent as Tick } from "assets/svgs/Tick.svg";
import { ReactComponent as Cross } from "assets/svgs/Cross.svg";

const greenCheckColor = "#17B890";
const greyCheckColor = "#C4C1CA";

const TestCategory = ({ type, text }) => {
  return (
    <div
      style={{
        color: type ? greenCheckColor : greyCheckColor,
        display: "flex",
        flexDirection: "row",
        // alignItems: "center",
      }}
    >
      <div style={{ marginTop: "0.5px" }}> {type ? <Tick /> : <Cross />}</div>
      <p style={{ marginLeft: "8px", fontSize: "12px" }}>{text}</p>
    </div>
  );
};

const PasswordChecker = ({ testPassword }) => {
  const { lengthVal, oneNumVal, oneUpCaseVal, oneLowCaseVal, specialVal } =
    testPassword;
  return (
    <div
      style={{ margin: "1rem 0 1rem 1rem" }}
      className="password-validations"
    >
      <TestCategory type={lengthVal} text="At least 8 characters" />
      <TestCategory type={oneNumVal} text="At least one Number (0-9)" />
      <TestCategory type={oneUpCaseVal} text="At least 1 Uppercase" />
      <TestCategory type={oneLowCaseVal} text="At least 1 Lowercase" />
      <TestCategory
        type={specialVal}
        text="Inclusion of at least one special character, e.g., ! @ # ? ]"
      />
    </div>
  );
};

export default PasswordChecker;
