import React from "react";
import { Tabs } from "antd";
import Layout from "../../sharedModules/defaultLayout";
import ActiveLoans from "./activeLoans";
import DefaultedLoans from "./defaultedLoans";
import SettledLoans from "./settledLoans";
const Loan = () => {
  const items = [
    {
      key: "1",
      label: `Active Loans`,
      children: <ActiveLoans />,
    },
    {
      key: "3",
      label: `Defaulted Loans`,
      children: <DefaultedLoans />,
    },
    {
      key: "4",
      label: `Settled Loans`,
      children: <SettledLoans />,
    },
  ];
  return (
    <Layout sideKey="11">
      <Tabs defaultActiveKey="1" items={items} />
    </Layout>
  );
};

export default Loan;
