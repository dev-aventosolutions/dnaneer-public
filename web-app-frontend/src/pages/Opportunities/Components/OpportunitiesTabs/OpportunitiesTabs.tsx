import { Tabs } from "antd";
import ActiveTab from "./ActiveTab";
import ComingSoon from "./ComingSoon";
import Closed from "./Closed";
const OpportuniesTabs = () => {
  const items = [
    {
      key: "1",
      label: "Active",
      children: <ActiveTab />,
    },
    {
      key: "2",
      label: "Coming Soon",
      children: <ComingSoon />,
    },
    {
      key: "3",
      label: "Defaulted",
      children: <Closed />,
    },
  ];

  return <Tabs items={items} />;
};

export default OpportuniesTabs;
