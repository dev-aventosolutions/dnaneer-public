import { ReactNode } from "react";
import { Button } from "antd";
import "./button.scss";

interface MessageProps {
  children: ReactNode | ReactNode[] | string;
  htmlType?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode | ReactNode[];
  loading?: boolean;
  disabled?: boolean | undefined;
  block?: boolean;
  style?: React.CSSProperties;
}


const AppButton = ({
  children,
  htmlType,
  onClick,
  className,
  icon,
  loading,
  disabled,
  block,
  style
}: MessageProps): JSX.Element => {
  return (
    <Button
      block={block}
      disabled={disabled}
      icon={icon}
      className={
        className ? `createApp-Button ${className}` : "createApp-Button"
      }
      onClick={onClick}
      loading={loading}
      htmlType={htmlType || "button"}
      style={style}
    >
      {children}
    </Button>
  );
};

export default AppButton;
