import { useState, useEffect } from "react";
import { Button, Steps } from "antd";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useNavigate } from "react-router-dom";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";

import { ReactComponent as CloseDrawer } from "assets/svgs/CloseDrawer.svg";

function InstitutionForms({ setOpen }) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setCurrent(userProfile?.kyc_step);
    setData(userProfile);
  }, [userProfile]);

  const handleSubmit = (step) => {
    if (step === "2") {
      return nextHandler();
    }
    if (step === "3") {
      return navigate("/dashboard");
    }
  };

  const nextHandler = () => {
    setCurrent(current + 1);
  };

  const handlePrevStep = () => {
    setCurrent(current - 1);
  };

  const handleSkip = (step) => {
    // if (step == "2") {
    //   setCurrent(current + 1);
    // }
    // if (step == "3") {
    setOpen(false);
    navigate("/dashboard");
    // }
  };

  const steps = [
    {
      title: "Investor Information",
      content: (
        <StepOne data={data} onSuccess={handleSubmit} setCurrent={setCurrent} />
      ),
    },
    {
      title: "Financial & Bank Information",
      content: (
        <StepTwo
          data={data}
          onSuccess={handleSubmit}
          handleSkip={handleSkip}
          onBack={handlePrevStep}
        />
      ),
    },
    {
      title: "Investment POA agreement",
      content: (
        <StepThree
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
    <div className="institute-drawer-content-container">
      <div className="content">
        <Button
          icon={<CloseDrawer />}
          className="closeDrawer-btn"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
        <h1>Complete your profile now</h1>
        <p>Fill the below information</p>
        <div className="form-steps-container">
          <Steps
            labelPlacement="vertical"
            current={current}
            percent={0}
            // progressDot={(props) => {
            //   console.log(props);
            //   return <p>propgress</p>;
            // }}
            items={[
              {
                title: (
                  <div className="step-title">
                    <span style={{ color: "#5B2CD3" }}>Investor</span>
                    <span style={{ color: "#5B2CD3" }}>Information</span>
                  </div>
                ),
              },
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
    </div>
  );
}

export default InstitutionForms;
