import React, { ReactNode } from "react";
import { Modal } from "antd";

import { ReactComponent as Close } from "assets/svgs/Close.svg";
import "./Modal.scss";

interface ModalProps {
  children: ReactNode | ReactNode[] | string;
  onOk?: () => void;
  onCancel?: () => void;
  isModalVisible?: boolean;
  centered?: boolean;
  footer?: boolean | null;
  className?: string;
  okText?: string;
  cancelText?: string;
  modalTitle?: ReactNode | string | boolean;
  width?: number;
  style?: React.CSSProperties;
}

const AppModal = ({
  children,
  className,
  modalTitle,
  isModalVisible,
  onOk,
  cancelText,
  okText,
  footer,
  width,
  centered,
  onCancel,
}: ModalProps): JSX.Element => {
  return (
    <>
      <Modal
        className={className ? `pdf-modal ${className}` : "pdf-modal"}
        title={modalTitle ? modalTitle : false}
        visible={isModalVisible}
        // open={isModalVisible}
        onOk={onOk}
        cancelText={cancelText}
        okText={okText}
        onCancel={onCancel}
        footer={footer}
        width={width}
        centered={centered}
        closeIcon={<Close />}
      >
        {children}
      </Modal>
    </>
  );
};

export default AppModal;
