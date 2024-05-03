import { useState } from "react";
import { Row, Col, Modal } from "antd";
import { ReactComponent as PDF } from "assets/svgs/PDF.svg";
import { ReactComponent as View } from "assets/svgs/View.svg";
import { ReactComponent as Download } from "assets/svgs/Download.svg";
import Constants from "utils/AppConstants";
import "./supportedDocuments.scss";

const DocumentsSupport = ({ document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Row gutter={[16, 2]}>
        <Col md={8}>
          {typeof document === "object" ? (
            <DocumentViewer
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              link={document?.link}
              fileName={
                document?.original_name
                  ? document?.original_name?.length > 10
                    ? `${document?.original_name.substring(0, 10)}...`
                    : document?.original_name
                  : document?.type?.length > 10
                  ? `${document?.type.substring(0, 20)}...`
                  : document?.type
              }
            />
          ) : (
            <DocumentViewer
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              link={document}
              fileName={"Supporting-Document.pdf"}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default DocumentsSupport;

const DocumentViewer = ({
  handleOk,
  handleCancel,
  isModalOpen,
  link,
  fileName,
}) => {
  return (
    <>
      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={"900px"}
      >
        <h1>File Preview</h1>
        <iframe
          src={`${Constants.URL.BASE_URL}${link}`}
          title="PDF Viewer"
          style={{ width: "100%", height: "800px" }}
        />
        <h4>{fileName}</h4>
      </Modal>
      <div className="document-view-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <PDF width="16px" height="16px" />
          <span style={{ marginLeft: "10px" }}>{fileName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div onClick={() => handleOk()}>
            <View />
          </div>
          <a
            href={`${Constants.URL.BASE_URL}${link}`}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download style={{ marginLeft: "10px" }} />
          </a>
        </div>
      </div>
    </>
  );
};
