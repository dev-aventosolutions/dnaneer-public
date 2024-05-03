import React, { ReactNode } from "react";
import { Modal } from "antd";

import { ReactComponent as ModalClose } from "../../assets/svgs/ModalClose.svg";
import "./Modal.scss";

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
}) => {
  return (
    <>
      <Modal
        className={
          className ? `createApp-Modal ${className}` : "createApp-Modal"
        }
        title={modalTitle ? modalTitle : false}
        visible={isModalVisible}
        open={isModalVisible}
        onOk={onOk}
        cancelText={cancelText}
        okText={okText}
        onCancel={onCancel}
        footer={footer}
        width={width}
        centered={centered}
        closeIcon={<ModalClose />}
      >
        {children}
      </Modal>
    </>
  );
};

export default AppModal;
