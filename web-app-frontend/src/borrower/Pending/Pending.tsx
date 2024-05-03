import React from "react";
import logo from "assets/svgs/Pendinglogo.png";
import "./pending.scss";
import { useParams } from "react-router-dom";
import { ReactComponent as DaalLogo } from "assets/svgs/DananeerkycBackground.svg";

const BorrowerPending = () => {
  const { status } = useParams();
  return (
    <div className="card-container borrower-content-container">
      <DaalLogo className="backgroundLogo" />
      <div className="card-form">
        <div className="modal-content">
          <div className="questionIcon">
            <img src={logo}></img>
          </div>
          <h1 className="form-text">
            {" "}
            {status == "pending"
              ? "Thank you for your request. It's under review, and we will contact you soon."
              : "Your borrower request is rejected. Please contact administrator."}
          </h1>
          <p className="form-bottom">Have a great day!</p>
        </div>
      </div>
    </div>
  );
};

export default BorrowerPending;
