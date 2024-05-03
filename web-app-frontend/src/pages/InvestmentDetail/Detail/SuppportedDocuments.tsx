import { useState } from "react";
import { Row, Col } from "antd";
import PDFModal from "components/Modal/PDFModal";
import { ReactComponent as PDF } from "assets/svgs/PDF.svg";
import { ReactComponent as View } from "assets/svgs/View.svg";
import { ReactComponent as Download } from "assets/svgs/Download.svg";
import Constants from "utils/AppConstants";

const SupportedDocuments = ({ documents }) => {
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
        <Col xs={24}>
          <div style={{ marginBottom: "27px" }}>
            <h3 className="large-heading">Supported Documents</h3>
          </div>
        </Col>
        {documents?.map((document) => (
          <Col md={8} key={document?.id}>
            <DocumentViewer
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              link={document?.link}
              fileName={document?.original_name}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SupportedDocuments;

const DocumentViewer = ({
  handleOk,
  handleCancel,
  isModalOpen,
  link,
  fileName,
}) => {
  return (
    <>
      <PDFModal
        centered
        className="logout-modal"
        isModalVisible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <h1>File Preview</h1>
        <iframe
          src={`${Constants.URL.BASE_URL}${link}`}
          title="PDF Viewer"
          style={{ width: "100%", height: "800px" }}
        />
        <h4>{fileName}</h4>
      </PDFModal>
      <div className="document-view-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <PDF width="16px" height="16px" />
          <span style={{ marginLeft: "10px" }}>{fileName}f</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div onClick={() => handleOk()}>
            <View />
          </div>
          <a
            href={`${Constants.URL.BASE_URL}${link}`}
            download={fileName}
            target="_blank"
          >
            <Download style={{ marginLeft: "10px" }} />
          </a>
        </div>
      </div>
    </>
  );
};
