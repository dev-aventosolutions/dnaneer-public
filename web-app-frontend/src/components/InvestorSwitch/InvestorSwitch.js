import React, { useLayoutEffect, useState } from "react";

function InvestorSwitch({ InstituteComponent, IndividualComponent }) {
  const [userType, setUserType] = useState("");
  useLayoutEffect(() => {
    const type = localStorage.getItem("investor-type");
    setUserType(type);
  }, []);
  return userType == "individual"
    ? IndividualComponent
    : userType == "institutional" && InstituteComponent;
}

export default InvestorSwitch;
