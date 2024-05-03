import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
// import "./radioGroup.scss";

interface RadioProps {
  options: {
    label: string;
    value: string | number;
  }[];
  onChange?: (e: RadioChangeEvent) => void;
  className?: string;
  defaultValue?: string | number;
  height?: string;
  padding?: string;
}

const AppInput = ({
  onChange,
  className,
  defaultValue,
  options,
  height,
  padding,
}: RadioProps) => {
  return (
    <>
      <Radio.Group
        onChange={onChange}
        defaultValue={defaultValue}
        className="appRadioGroup"
      >
        {options.map((option, i) => (
          <Radio.Button
            key={i}
            checked={defaultValue == "1" ? true : false}
            value={option.value}
            style={{
              height,
              padding,
            }}
            className={className ? className : "appRadioBtn"}
          >
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </>
  );
};

export default AppInput;
