import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createVipRequest } from "../../../../services/ApiHandler";

const VipRequest = ({ userProfile }) => {
  const { id } = useParams();
  const approvedCase = () => {
    createVipRequest({ status: true, requestId: id })
      .then((res) => {})
      .catch((error) => {});
  };
  const rejectCase = () => {
    createVipRequest({ status: false, requestId: id })
      .then((res) => {})
      .catch((error) => {});
  };
  return (
    <div>
      <div>
        <h2
          style={{
            display: "inline-flex",
            background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            // textFillColor: "transparent",
          }}
        >
          Criteria
        </h2>
        <h2
          style={{
            display: "inline-flex",
            background: "linear-gradient(270deg, #2b48f4, #34a5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            // textFillColor: "transparent",
          }}
        >
          Document
        </h2>
        <br />
        <iframe
          src="/assets/pdf/Dnaneer Contract .pdf"
          title="PDF Viewer"
          style={{ width: "100%", height: "800px" }}
        />
      </div>
      <div className="d-flex">
        <button
          style={{ margin: "0 15px", width: "200px", cursor: "pointer" }}
          className="profile-edit-btn2"
          onClick={approvedCase}
        >
          Approved
        </button>
        <button
          style={{ margin: "0 15px", width: "200px", cursor: "pointer" }}
          className="profile-edit-btn3"
          onClick={rejectCase}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default VipRequest;
