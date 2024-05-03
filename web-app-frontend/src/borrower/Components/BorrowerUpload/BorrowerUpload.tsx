import { useCallback, useEffect, useState, memo } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import Button from "components/Button/Button";
import { ReactComponent as UploadIcon } from "assets/svgs/UploadIcon.svg";
import { ReactComponent as File } from "assets/svgs/File.svg";
import { ReactComponent as FileDelete } from "assets/svgs/FileDelete.svg";
import "./BorrowerUpload.scss";
const { Dragger } = Upload;
import { ReactComponent as View } from "assets/svgs/View.svg";
import PDFModal from "components/Modal/PDFModal";
import AppConstants from "utils/AppConstants";
const beforeUpload = (file) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];
  message.destroy();
  const isAllowedType = allowedTypes.includes(file.type);
  if (!isAllowedType) {
    message.error("You can only upload PDF, XLSX, or CSV files");
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isLt5M) {
    message.error("File must be smaller than 5MB!", 0);
    return false;
  }

  return isAllowedType && isLt5M;
};

const UploadComponent = ({ line,docName="", handleUpload, initialValues = [] }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onDrop = (e) => {
    //  console.log("Dropped files", e.dataTransfer.files);
  };

  // const onChange = useCallback(
  //   (info) => {
  //     const { fileList } = info;

  //     // Update the docName property for new files
  //     const updatedFile = fileList.map((file) => {
  //       return {
  //         files: { ...file },
  //         docName: line,
  //       };
  //     });
  //     setUploadedFiles(updatedFile);
  //   },
  //   [line]
  // );
  const onChange = async (info) => {
    if (info?.event) {
      const { file } = info;
      // beforeUpload(file);
      setUploadedFiles([
        {
          file,
          docName: docName,
        },
      ]);
    }
  };

  useEffect(() => {
    if (uploadedFiles) {
      handleUpload(uploadedFiles);
    }
  }, [uploadedFiles]);

  const onDeleteFile = (id) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.file.uid !== id)
    );
    handleUpload(uploadedFiles, "delete");
  };
  // const onInitialDelete = (id) => {
  //   setUploadedFiles((prevFiles) =>
  //     prevFiles.filter((file) => file.file.uid !== id)
  //   );
  //   handleUpload(uploadedFiles, "delete");
  // };
  useEffect(() => {
    return () => {
      message.destroy();
    };
  }, []);
  return (
    <div>
      <div className="upload-container">
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
            src={`${AppConstants.URL.BASE_URL}${initialValues[0]?.link}`}
            title="PDF Viewer"
            style={{ width: "100%", height: "800px" }}
          />
          <h4>{initialValues[0]?.original_name}</h4>
        </PDFModal>
        <Dragger
          className="document-upload"
          onChange={(e) => onChange(e)}
          onDrop={onDrop}
          beforeUpload={beforeUpload}
          showUploadList={false}
          //  customRequest={dummyRequest}
        >
          <p className="import">
            {line}
            {line !== "Bank Additional documents" &&
              line !== "Additional documents" && (
                <span style={{ color: "#ff4d4f" }}> *</span>
              )}
          </p>
          <p className="browse">
            <UploadIcon /> Upload
          </p>
        </Dragger>

        {uploadedFiles.length
          ? uploadedFiles?.map((file, i) => {
              return (
                <div className="upload-file-container" key={i}>
                  <File />

                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#140a2b",
                      margin: 0,
                      marginLeft: "10px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file?.file.name}
                  </h2>

                  <FileDelete
                    onClick={() => onDeleteFile(file?.file.uid)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              );
            })
          : initialValues.map((file, i) => {
              return (
                <div className="upload-file-container" key={i}>
                  <File />

                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#140a2b",
                      margin: 0,
                      marginLeft: "10px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file?.original_name ?? file?.type}
                  </h2>

                  <div>
                    <View onClick={() => setIsModalOpen(true)} />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default memo(UploadComponent);
