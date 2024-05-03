import { Collapse } from "antd";
import { ReactComponent as Expand } from "assets/svgs/Expand.svg";

const AppAccordion = ({ header, children }) => {
  return (
    <Collapse
      expandIconPosition="end"
      style={{ backgroundColor: "#fff" }}
      expandIcon={({ isActive }) => (
        <div
          style={{
            transform: isActive ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <Expand />
        </div>
      )}
    >
      <Collapse.Panel key="1" collapsible="header" header={header}>
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
export default AppAccordion;
