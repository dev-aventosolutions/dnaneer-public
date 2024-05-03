import { Radio, RadioChangeEvent } from "antd";
const options: { label: string; value: string | number }[] = [
  {
    label: "Individual",
    value: "individual",
  },
  {
    label: "Institutional",
    value: "institutional",
  },
];
const SwitchUser = ({ userType, setUserType }) => {
  const onChangeIndividual = (e: RadioChangeEvent) => {
    // console.log("radio checkeddd", e.target.value);
    setUserType(e.target.value);
    localStorage.setItem("investor-type", e.target.value);
  };

  return (
    <Radio.Group
      value={userType}
      onChange={onChangeIndividual}
      className="appRadioGroup"
    >
      {options.map((option, i) => (
        <Radio.Button key={i} value={option.value} className={"appRadioBtn"}>
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default SwitchUser;
