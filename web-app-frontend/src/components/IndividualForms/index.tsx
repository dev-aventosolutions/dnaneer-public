import React, { useState, useEffect } from "react";
import { Button, Steps } from "antd";
import StepOne from "./StepOne";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import StepTwo from "./StepTwo";
import { ReactComponent as CloseDrawer } from "assets/svgs/CloseDrawer.svg";
import StepFour from "components/InstitutionalForms/StepThree";
import { useNavigate } from "react-router-dom";
// import { ReactComponent as Aggrement } from "assets/svgs/Aggrement.svg";

export default function App({ setOpen }) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(userProfile?.kyc_step);
  }, [userProfile]);

  const handleSubmit = () => {
    console.log("Submit");
  };

  const nextHandler = () => {
    setCurrent(current + 1);
  };

  const handlePrevStep = () => {
    setCurrent(current - 1);
  };
  const handleSkip = (step) => {
    setOpen(false);
    // if (step == "2") {
    //   setCurrent(current + 1);
    // }
    // if (step == "3") {
    // navigate("/dashboard");
    // }
  };

  const onComplete = (step) => {
    if (step == "2" || step == "1") {
      return nextHandler();
    }
 handleSkip("4");
  };
  const steps = [
    {
      title: "Personal Information",
      content: (
        <StepOne
          handleSkip={handleSkip}
          data={data}
          onSuccess={handleSubmit}
          setCurrent={setCurrent}
        />
      ),
    },
    // {
    //   title: "General Information",
    //   content: (
    //     <StepTwo
    //       handleSkip={handleSkip}
    //       onBack={handlePrevStep}
    //       onComplete={onComplete}
    //     />
    //   ),
    // },
    {
      title: "Financial & Bank Information",
      content: (
        <StepTwo
          // data={data}
          // onSuccess={handleSubmit}
          handleSkip={handleSkip}
          onBack={handlePrevStep}
          onComplete={onComplete}
        />
      ),
    },
    {
      title: "Investment POA agreement",
      content: (
        <StepFour
          data={data}
          handleSkip={handleSkip}
          onSuccess={handleSubmit}
          onBack={handlePrevStep}
          setOpen={setOpen}
        />
      ),
    },
  ];

  return (
    <div className="individual-drawer-content-container">
      {userProfile && (
        <div className="content">
          <Button
            icon={<CloseDrawer />}
            className="closeDrawer-btn"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <h1>Please fill in the KYC form so you can proceed</h1>
          <p>Fill the below information</p>

          <div className="form-steps-container">
            <Steps
              labelPlacement="vertical"
              current={current}
              percent={0}
              items={[
                {
                  title: (
                    <div className="step-title">
                      <span style={{ color: "#5B2CD3" }}>Personal</span>
                      <span style={{ color: "#5B2CD3" }}>Information</span>
                    </div>
                  ),
                },
                // {
                //   title: (
                //     <div className="step-title">
                //       <span
                //         style={{
                //           color: current === 1 ? "#5B2CD3" : "#4E4760",
                //           opacity: current === 1 ? 1 : 0.4,
                //         }}
                //       >
                //         General
                //       </span>
                //       <span
                //         style={{
                //           color: current === 1 ? "#5B2CD3" : "#4E4760",
                //           opacity: current === 1 ? 1 : 0.4,
                //         }}
                //       >
                //         Information
                //       </span>
                //     </div>
                //   ),
                // },
                {
                  title: (
                    <div className="step-title">
                      <span
                        style={{
                          color: current === 1 ? "#5B2CD3" : "#4E4760",
                          opacity: current === 1 ? 1 : 0.4,
                        }}
                      >
                        Financial & Bank
                      </span>
                      <span
                        style={{
                          color: current === 1 ? "#5B2CD3" : "#4E4760",
                          opacity: current === 1 ? 1 : 0.4,
                        }}
                      >
                        Information
                      </span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div className="step-title">
                      <span
                        style={{
                          color: current === 2 ? "#5B2CD3" : "#4E4760",
                          opacity: current === 2 ? 1 : 0.4,
                        }}
                      >
                        Investment POA
                      </span>
                      <span
                        style={{
                          color: current === 2 ? "#5B2CD3" : "#4E4760",
                          opacity: current === 2 ? 1 : 0.4,
                        }}
                      >
                        Agreement
                      </span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <>{steps[current].content}</>
        </div>
      )}
    </div>
  );
}
