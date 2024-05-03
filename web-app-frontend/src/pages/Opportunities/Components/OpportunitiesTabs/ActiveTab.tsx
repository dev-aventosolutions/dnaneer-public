import { Divider, Input } from "antd";
import SelectOptions from "../RadioOptions/SelectOptions";
import OpportuniesList from "./OpportunitiesList";
import LoadMore from "../LoadMore/LoadMore";
import { ReactComponent as NavSearch } from "assets/svgs/NavSearch.svg";
import { useState } from "react";
import "./opportunityTabs.scss";

const ActiveTab = () => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [monthsFilter, setMonthsFilter] = useState(0);
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
        statusFilter={"active"}
      />
      <LoadMore />
    </div>
  );
};

export default ActiveTab;
