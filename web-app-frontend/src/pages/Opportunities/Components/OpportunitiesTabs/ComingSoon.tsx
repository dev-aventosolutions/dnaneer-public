import { Divider, Input } from "antd";
import OpportuniesList from "./OpportunitiesList";
import SelectOptions from "../RadioOptions/SelectOptions";
import { useState } from "react";
import { ReactComponent as NavSearch } from "assets/svgs/NavSearch.svg";
import LoadMore from "../LoadMore/LoadMore";
import "./opportunityTabs.scss";

const ComingTab = () => {
  const [monthsFilter, setMonthsFilter] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div className="oppertunity-tabs">
      <div className="oppertunity-filters">
        <SelectOptions
          monthsFilter={monthsFilter}
          setMonthsFilter={setMonthsFilter}
        />

        <Input
          type="text"
          placeholder="Search"
          value={searchFilter}
          prefix={<NavSearch />}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="oppertunity-search"
        />
      </div>
      <Divider />
      <OpportuniesList
        monthsFilter={monthsFilter}
        statusFilter={"comingsoon"}
        searchFilter={searchFilter}
      />
      <LoadMore />
    </div>
  );
};

export default ComingTab;
