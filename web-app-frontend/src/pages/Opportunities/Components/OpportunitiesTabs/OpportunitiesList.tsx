import { useState, useEffect } from "react";
import OpportunitiesCard from "../OpportunitiesCard/OpportunitiesCard";
import { getOpportunityList } from "services/Login";
import { Spin, message } from "antd";
import Empty from "components/Empty/Empty";

const OpportunistsList = ({ monthsFilter, statusFilter, searchFilter }) => {
  const [opportunityList, setOpportunityList] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getOpportunityList();
        if (data) {
          console.log("getOpportunityList", data);
          setOpportunities(data?.data);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (opportunities) {
      // Tab/Status filter
      let filterData = opportunities.filter((opportunity) => {
        if (opportunity?.opportunity_status === statusFilter)
          return opportunity;
      });
      // Month filter
      if (monthsFilter === 0) {
        setOpportunityList(filterData);
      } else {
        filterData = filterData.filter((opportunity) => {
          if (opportunity?.duration === monthsFilter) return opportunity;
        });
        setOpportunityList(filterData);
      }
      // Input search filter
      if (searchFilter !== "") {
        const searchFilterLower = searchFilter.toLowerCase();
        filterData = filterData.filter((opportunity) => {
          return (
            opportunity?.industry_name
              .toLowerCase()
              .includes(searchFilterLower) ||
            opportunity?.opportunity_number
              .toString()
              .includes(searchFilterLower)
          );
        });
        setOpportunityList(filterData);
      }
    }
  }, [monthsFilter, searchFilter, opportunities]);

  return (
    <>
      <Spin spinning={loading}>
        <div style={{ padding: "0 29px" }}>
          {opportunityList.length >= 1 ? (
            opportunityList.map((opportunity, index) => {
              // if (index === opportunityList.length - 1) {
              //   return (
              //     <div key={index}>
              //       <OpportunitiesCard id={index} opp />;
              //     </div>
              //   );
              // }
              return (
                <div key={index}>
                  <OpportunitiesCard
                    id={opportunity.id}
                    opportunity={opportunity}
                  />
                  <br />
                </div>
              );
            })
          ) : (
            <Empty data={"Opportunies"} />
          )}
        </div>
      </Spin>
    </>
  );
};

export default OpportunistsList;
