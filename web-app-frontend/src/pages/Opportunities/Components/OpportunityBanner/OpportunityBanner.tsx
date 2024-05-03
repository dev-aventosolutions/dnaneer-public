import { ReactComponent as OpportunityIcon } from "assets/svgs/OpportunityIcon.svg";
import "./banner.scss";
import { useEffect, useState } from "react";

const OpportunityBanner = () => {
  const [isInstitutional,setIsinstitutional]=useState('')
  useEffect(()=>{
       setIsinstitutional(localStorage.getItem("investor-type"));
     },[])
  return (
    <div
      className={
        isInstitutional === "institutional"
          ? "banner-container banner-containerO"
          : "banner-container"
      }
    >
      <div>
        <h1>Explore new investment opportunities</h1>
        <h4>Maximize your investments today!</h4>
      </div>
      <OpportunityIcon />
    </div>
  );
};

export default OpportunityBanner;
