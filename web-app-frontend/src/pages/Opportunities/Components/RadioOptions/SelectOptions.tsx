import { Select } from "antd";

const durationOptions = [
  { label: "All", value: 0 },
  { label: "3 months", value: 3 },
  { label: "6 months", value: 6 },
  { label: "12 months", value: 12 },
  { label: "18 months", value: 18 },
  { label: "24 months", value: 24 },
  { label: "30 months", value: 30 },
  { label: "36 months", value: 36 },
  { label: "42 months", value: 42 },
  { label: "48 months", value: 48 },
  { label: "54 months", value: 54 },
  { label: "60 months", value: 60 },
];

const SelectOptions = ({ monthsFilter, setMonthsFilter }) => {
  return (
    <div style={{ padding: "0 29px" }}>
      <Select
        value={monthsFilter}
        onChange={(value) => setMonthsFilter(value)}
        size="middle"
        options={durationOptions}
        style={{ minWidth: 120 }}
      />
    </div>
  );
};

export default SelectOptions;
