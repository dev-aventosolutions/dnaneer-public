import { useLayoutEffect, useState } from "react";
// import AuthContainer from "components/AuthContainer/AuthContainer";
import OtpComponent from "./Otp/Otp";
import Phone from "../SingupComponents/PhoneNumber/Phone";
import Password from "../SingupComponents/Password/Password";
import Absher from "../SingupComponents/Absher/Absher";
import Naftah from "./Naftah/Naftah";
import InstitutionalStepTwo from "./InstitutionalStepTwo/InstitutionalStepTwo";

const SingUpComponent = ({ individual, setIndividual }) => {
  const [showPhone, setShowPhone] = useState(true);
  const [showInstitutionalStepTwo, setShowInstitutionalStepTwo] =
    useState(false);
  const [institutionalStepTwoData, setInstitutionalStepTwoData] = useState(
    {}
  );
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [absherCode, setAbsherCode] = useState(false);
  const [showNaftah, setShowNaftah] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nafathInfo, setNafathInfo] = useState(null);
  const [passwordIno, setPasswordInfo] = useState(null);
  const [number, setNumber] = useState("");

  useLayoutEffect(() => {
    if (individual === "individual") {
      setShowPhone(true);
      setShowOtp(false);
    } else {
      setShowPhone(false);
      setShowOtp(true);
    }
  }, []);
  return (
    <>
      {showPhone && (
        <Phone
          setShowOtp={setShowOtp}
          setShowPhone={setShowPhone}
          setIndividual={setIndividual}
          setShowPassword={setShowPassword}
          individual={individual}
          setUserId={setUserId}
          setNumber={setNumber}
          setShowInstitutionalStepTwo={setShowInstitutionalStepTwo}
        />
      )}
      {showOtp && (
        <OtpComponent
          individual={individual}
          setShowPassword={setShowPassword}
          setShowPhone={setShowPhone}
          setShowOtp={setShowOtp}
          userId={userId}
          number={number}
          setShowInstitutionalStepTwo={setShowInstitutionalStepTwo}
        />
      )}
      {showInstitutionalStepTwo && (
        <InstitutionalStepTwo
          individual={individual}
          userId={userId}
          setUserId={setUserId}
          setShowInstitutionalStepTwo={setShowInstitutionalStepTwo}
          setNafathInfo={setNafathInfo}
          setShowNafath={setShowNaftah}
          setShowPhone={setShowPhone}
          institutionalStepTwoData={institutionalStepTwoData}
          setInstitutionalStepTwoData={setInstitutionalStepTwoData}
        />
      )}
      {showPassword && (
        <Password
          setShowNaftah={setShowNaftah}
          setShowPassword={setShowPassword}
          setShowOtp={setShowOtp}
          setAbsherCode={setAbsherCode}
          individual={individual}
          userId={userId}
          setNafathInfo={setNafathInfo}
          setPasswordInfo={setPasswordInfo}
        />
      )}
      {individual === "individual" && absherCode && (
        <Absher
          setShowPassword={setShowPassword}
          setAbsherCode={setAbsherCode}
        />
      )}

      {showNaftah && (
        <Naftah
          setShowPassword={setShowPassword}
          setShowNaftah={setShowNaftah}
          nafathInfo={nafathInfo}
          userId={userId}
          passwordIno={passwordIno}
          setNafathInfo={setNafathInfo}
          individual={individual}
          setShowInstitutionalStepTwo={setShowInstitutionalStepTwo}
          institutionalData={institutionalStepTwoData}
        />
      )}
    </>
  );
};

export default SingUpComponent;
