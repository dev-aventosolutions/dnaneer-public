import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import OpportunitiesContainer from "./Components/Container";
import './opportunities.scss';

const Opportunities = () => {
//   console.log("hello");
  return (
    <DashboardLayout sideKey="2">
      <OpportunitiesContainer />
    </DashboardLayout>
  );
};

export default Opportunities;
