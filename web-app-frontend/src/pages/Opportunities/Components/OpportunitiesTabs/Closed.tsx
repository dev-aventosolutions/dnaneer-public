import { Divider, Input } from "antd";
import SelectOptions from "../RadioOptions/SelectOptions";
import OpportuniesList from "./OpportunitiesList";
import LoadMore from "../LoadMore/LoadMore";
import { ReactComponent as NavSearch } from "assets/svgs/NavSearch.svg";
import { useState } from "react";
import "./opportunityTabs.scss";

const ClosedTab = () => {
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
        searchFilter={searchFilter}
        monthsFilter={monthsFilter}
        statusFilter={"defaulted"}
      />
      <LoadMore />
    </div>
  );
};

export default ClosedTab;
