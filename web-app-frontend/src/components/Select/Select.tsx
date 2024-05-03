import { useState } from "react";
import { Select } from "antd";

import { ReactComponent as Selecticon } from "assets/svgs/Selecticon.svg";
import "./Select.scss";

interface SelectProps {
  options?: {
    label: string;
    value: string | number;
  }[];
  children?: JSX.Element | JSX.Element[];
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean | undefined;
  placeholder?: string;
  label: string;
  values?: number;
  defaultValue?: any;
}

const FloatSelect = ({
  placeholder,
  children,
  className,
  disabled,
  values,
  options,
  label,
  defaultValue,
  onChange,
}: SelectProps) => {
  const [focus, setFocus] = useState(false);

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (defaultValue && defaultValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  // const requiredMark = required ? <span className="text-danger">*</span> : null;
  return (
    <div
      className="float-label"
      onBlur={() => !isOccupied && setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {values ? (
        <Select
          // filterOption={filterOption}
          //  autoFocus={true}
          // showSearch={showSearch}
          defaultValue={defaultValue ? defaultValue : ""}
          options={options}
          value={values ? values + "" : null}
          className={className}
          placeholder={placeholder}
          optionFilterProp="children"
          onChange={onChange}
          suffixIcon={<Selecticon />}
          size="large"
        >
          {children}
        </Select>
      ) : (
        <Select
          // filterOption={filterOption}
          //  autoFocus={true}
          // showSearch={showSearch}
          options={options}
          className={className}
          placeholder={placeholder}
          optionFilterProp="children"
          onChange={onChange}
          suffixIcon={<Selecticon />}
          defaultValue={defaultValue ? defaultValue : ""}
        >
          {children}
        </Select>
      )}
      <label className={labelClass}>{isOccupied ? label : placeholder}</label>
    </div>
  );
};

export default FloatSelect;
