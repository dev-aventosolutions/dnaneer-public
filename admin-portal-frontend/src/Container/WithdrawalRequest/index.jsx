import React from "react";
import { Tabs } from "antd";
import Layout from "../../sharedModules/defaultLayout";
import WithdrawalRequestListingAll from "./WithdrawalRequestListing/WithdrawalRequestListingAll";
import WithdrawalRequestListingPending from "./WithdrawalRequestListing/WithdrawalRequestListingPending";
import WithdrawalRequestListingApproved from "./WithdrawalRequestListing/WithdrawalRequestListingApproved";
import WithdrawalRequestListingRejected from "./WithdrawalRequestListing/WithdrawalRequestListingRejected";

const WithdrawalRequest = () => {
  const items = [
    {
      key: "1",
      label: `All`,
      children: <WithdrawalRequestListingAll request={"all"} />,
    },
    {
      key: "2",
      label: `Pending`,
      children: <WithdrawalRequestListingPending request={"pending"} />,
    },
    {
      key: "3",
      label: `Approved`,
      children: <WithdrawalRequestListingApproved request={"approved"} />,
    },
    {
      key: "4",
      label: `Rejected`,
      children: <WithdrawalRequestListingRejected request={"rejected"} />,
    },
  ];

  return (
    <Layout sideKey="10">
      <Tabs defaultActiveKey="1" items={items} />
    </Layout>
  );
};

export default WithdrawalRequest;
