import { useState } from "react";
import { Input } from "antd";
import { ReactComponent as EyeOpen } from "assets/svgs/Eye_open.svg";
import { ReactComponent as EyeClosed } from "assets/svgs/EyeClosed.svg";

// import "./input.scss";
// import Eye_open from "../../icons/Eye_open.svg"

interface MessageProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  icon?: JSX.Element | JSX.Element[];
  disabled?: boolean | undefined;
  block?: boolean;
  iconRender?: boolean;
  value?: string;
  prefix?: JSX.Element | JSX.Element[] | string;
  placeholder?: string;
  label: string;
  type?: string;
  maxLength?: number;
  max?: number;
}

const AppInput = ({
  onChange,
  className,
  icon,
  disabled,
  block,
  maxLength,
  value,
  iconRender,
  prefix,
  placeholder,
  label,
  type,
  max,
  style,
}: MessageProps) => {
  const [focus, setFocus] = useState(false);
  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";


  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      style={{ position: "relative" }}
    >
      {iconRender ? (
        <Input.Password
          //   placeholder={placeholder}
          prefix={prefix}
          onChange={onChange}
          value={value}
          style={style}
          className={className ? className : "appInput"}
          iconRender={(visible) => (visible ? <EyeOpen /> : <EyeClosed style={{width:"22px"}} />)}
        />
      ) : (
        <Input
          type={type}
          prefix={prefix}
          maxLength={maxLength}
          max={max}
          style={style}
          //   placeholder={placeholder}
          //  autoFocus={true}
          disabled={disabled}
          onChange={onChange}
          value={value}
          className={className ? className : "appInput"}
        />
      )}
      <label className={labelClass}>{isOccupied ? label : placeholder}</label>
    </div>
  );
};

export default AppInput;
