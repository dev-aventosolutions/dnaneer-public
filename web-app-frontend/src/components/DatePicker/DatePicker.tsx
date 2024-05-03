import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";

import "./datePicker.scss";
import moment from "moment";
interface MessageProps {
  onChange?: (e) => void;
  className?: string;
  icon?: JSX.Element | JSX.Element[];
  disabled?: boolean | undefined;
  block?: boolean;
  value?: any;
  prefix?: JSX.Element | JSX.Element[];
  placeholder?: string;
  label: string;
  type?: string;
  defaultValue?: any;
  disabledDate?: any;
}

const AppDatePicker = ({
  onChange,
  className,
  icon,
  disabled,
  block,
  value,
  prefix,
  placeholder,
  label,
  type,
  defaultValue,
  disabledDate = (current) => false,
}: MessageProps) => {
  const [focus, setFocus] = useState(false);
  if (!placeholder) placeholder = label;

  const isOccupied =
    focus ||
    (value && value.length !== 0) ||
    (defaultValue && defaultValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  //   const requiredMark = required ? <span className="text-danger">*</span> : null;
  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <DatePicker
        // value={value}
        // block={block}
        className={className ? className : "appInput"}
        onChange={onChange}
        // suffixIcon={<img src={DateIcon} alt="" />}
        format="YYYY-MM-DD"
        placeholder=""
        showToday={false}
        allowClear={false}
        defaultValue={defaultValue}
        disabledDate={disabledDate}
      />
      <label className={labelClass}>{isOccupied ? label : placeholder}</label>
    </div>
  );
};

export default AppDatePicker;
