import { ReactComponent as Close } from "assets/svgs/Close.svg";
import { ReactComponent as Start } from "assets/svgs/Start.svg";
import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
  containerClass?: string;
}

const AuthContainer = ({ children, containerClass }: AuthContainerProps) => {
  return (
    <div className={"signUp-container"}>
      <div className="close-icon">
        <a href="http://dnaneer.com/">
          <Close />
        </a>
      </div>
      <div
        // className={containerClass ? containerClass : "signUp-form-container"}
        className={`signUp-form-container`}
      >
        <div className="start-icon">
          <Start />
        </div>
        {children}
      </div>
      <div className="copy-right">
        Dnaneer © Copyright 2023, All Rights Reserved
      </div>
    </div>
  );
};

export default AuthContainer;
