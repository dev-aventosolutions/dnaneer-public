import { SetStateAction, Dispatch } from "react";
import OtpInput from "react-otp-input";
import "./otp.scss";

interface OtpProps {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  width?: string;
  height?: string;
  containerClass?: string;
}

export default function Otp({
  otp,
  setOtp,
  width,
  height,
  containerClass,
}: OtpProps): JSX.Element {
  return (
    <OtpInput
      containerStyle={containerClass ? containerClass : "otp-container"}
      shouldAutoFocus
      inputStyle={{
        width: width ? width : "55px",
        height: height ? height : "",
      }}
      value={otp}
      onChange={setOtp}
      numInputs={4}
      renderSeparator={""}
      renderInput={(props) => <input {...props} />}
    />
  );
}
