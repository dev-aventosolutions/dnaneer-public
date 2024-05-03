import { useEffect, useState } from "react";
import { Button, Steps } from "antd";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as DaalLogo } from "assets/svgs/DananeerkycBackground.svg";
import "./borrowerKyc.scss";
import { getBorrowerKyc } from "services/BorrowerApis";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";

function BorrowerKyc() {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);

  const navigate = useNavigate();
  const { step } = useParams();
  const location = useLocation();
  const [current, setCurrent] = useState(0 + +step);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBorrowerKyc();
        if (data) {
          setUserProfile(data.data?.data);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
      }
    })();
  }, [location]);

  const handleSubmit = (step) => {
    if (step == "2") {
      return nextHandler();
    }
    if (step == "3") {
      return navigate("/dashboard");
    }
  };

  const nextHandler = () => {
    setCurrent(current + 1);
  };

  const handlePrevStep = () => {
    navigate(`/borrower-request/${current - 1}`);
    setCurrent(current - 1);
  };

  const handleSkip = (step) => {
    // if (step == "2") {
    //   setCurrent(current + 1);
    // }
    // if (step == "3") {
    // setOpen(false);
    // navigate("/dashboard");
    // }
  };

  const steps = [
    {
      title: "Company Information",
      content: (
        <StepOne
          data={userProfile}
          onSuccess={handleSubmit}
          setCurrent={setCurrent}
        />
      ),
    },
    {
      title: "Financial information",
      content: (
        <StepTwo
          data={userProfile}
          onSuccess={handleSubmit}
          setCurrent={setCurrent}
          handleSkip={handleSkip}
          onBack={handlePrevStep}
        />
      ),
    },
    {
      title: "Investment POA agreement",
      content: (
        <StepThree
          data={userProfile}
          handleSkip={handleSkip}
          onSuccess={handleSubmit}
          onBack={handlePrevStep}
          //   setOpen={setOpen}
        />
      ),
    },
  ];

  return (
    <div className="borrower-content-container">
      <DaalLogo className="backgroundLogo" />
      <div className="content">
        {/* <Button
          icon={<CloseDrawer />}
          className="closeDrawer-btn"
          //   onClick={() => setOpen(false)}
        >
          Close
        </Button> */}
        <div style={{position:"absolute",right:"60px"}}>
          <img src="/assets/images/dnaneer-symbol.svg" />
        </div>
        <h1>Complete your profile now</h1>
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
                    <span style={{ color: "#2B48F4" }}>Company</span>
                    <span style={{ color: "#2B48F4" }}>Information</span>
                  </div>
                ),
              },
              {
                title: (
                  <div className="step-title">
                    <span
                      style={{
                        color: current == 2 ? "#2B48F4" : "#4E4760",
                        opacity: current == 2 ? 1 : 0.4,
                      }}
                    >
                      Contact person
                    </span>
                    <span
                      style={{
                        color: current == 2 ? "#2B48F4" : "#4E4760",
                        opacity: current == 2 ? 1 : 0.4,
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
                        color: current == 2 ? "#2B48F4" : "#4E4760",
                        opacity: current == 2 ? 1 : 0.4,
                      }}
                    >
                      Financial
                    </span>
                    <span
                      style={{
                        color: current == 2 ? "#2B48F4" : "#4E4760",
                        opacity: current == 2 ? 1 : 0.4,
                      }}
                    >
                      Information
                    </span>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <>{steps[current]?.content}</>
      </div>
    </div>
  );
}

export default BorrowerKyc;
