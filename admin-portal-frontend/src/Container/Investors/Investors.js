import React, { useState } from "react";
import Layout from "../../sharedModules/defaultLayout";
import { Tabs, message } from "antd";
import InvestorsTable from "./InvestorsTable";
import RequestedInvestors from "./RequestedInvestors/RequestedInvestors";
import KYCRequest from "./KYCRequest/KYCRequest";
import { getInvestorsList } from "../../services/ApiHandler";
const Investors = () => {
  const [loading, setLoading] = useState(false);
  const [investorsData, setInvestorsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchInvestorsList = async (page = 1,userType,mode) => {
    try {
      setLoading(true);
      const { data } = await getInvestorsList(page, userType, mode);
      if (data) {
        const finalData = data?.data[0]?.data?.map((investor) => {
          return {
            key: investor.id,
            email: [investor.user_id, investor.email],
            iban: investor.personal_iban_number,
            date: investor?.updated_at
              ? investor?.updated_at?.split("T")[0]
              : "-",
            type: investor.user_type === 1 ? "Individual" : "Institutional",
            mode: investor.mode,
            status:
              investor.kyc_step === 0
                ? "No KYC Step Filled"
                : investor.kyc_step === 1 || investor.kyc_step === 2
                ? `KYC Step ${investor.kyc_step} Filled`
                : investor.kyc_step === 3
                ? "Pending"
                : investor.kyc_step === 4
                ? "Rejected"
                : investor.kyc_step === 5 && "Verified",
            dnaneer_account_no: `${investor.dnaneer_account_no ?? "-"}`,
            dnaneer_iban_no: `${investor.dnaneer_iban?? "-"}`,
            // action: "",
          };
        });
        setCurrentPage(data?.data[0]?.current_page);
        setTotal(data?.data[0]?.total);
        setInvestorsData(finalData);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const items = [
    {
      key: "1",
      label: `All Investors`,
      children: (
        <InvestorsTable
          fetchInvestorsList={fetchInvestorsList}
          investorsData={investorsData}
          setInvestorsData={setInvestorsData}
          loading={loading}
          setLoading={setLoading}
          currentPage={currentPage}
          total={total}
        />
      ),
    },
    {
      key: "3",
      label: `VIP Requests`,
      children: <RequestedInvestors />,
    },
    {
      key: "4",
      label: `KYC Requests`,
      children: <KYCRequest fetchInvestorsList={fetchInvestorsList} />,
    },
  ];
  return (
    <Layout sideKey="2">
      <Tabs defaultActiveKey="1" items={items} />
    </Layout>
  );
};

export default Investors;
