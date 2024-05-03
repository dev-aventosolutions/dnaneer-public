import { useState, useEffect } from "react";
import { message, Upload } from "antd";
import { ReactComponent as UploadIcon } from "assets/svgs/UploadIcon.svg";
import { ReactComponent as File } from "assets/svgs/File.svg";
import { ReactComponent as FileDelete } from "assets/svgs/FileDelete.svg";
import "./upload.scss";
const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isPDF = file.type === "application/pdf";
  const isLt5M = file.size / 1024 / 1024 < 5;
  const isNotEmpty = file.size > 0;
  message.destroy();
  if (!isPDF) {
    message.error("Only PDF files are allowed");
    return false;
  } else if (!isLt5M) {
    message.error("File must be smaller than 5MB", 0);
    return false;
  } else if (!isNotEmpty) {
    message.error("Please select a file to upload");
    return false;
  }

  return true;
};

const UploadComponent = ({
  setFile,
  maxCount = 10,
  multiple = true,
  title = "Upload the commercial registration as PDF",
}) => {
  const [uploadedFiles, setUploadedFiles] = useState(setFile || []);
  useEffect(() => {
    // Update the state with the current value of setFile when the prop changes
    setUploadedFiles(setFile || []);
  }, [setFile]);

  const onDrop = (e) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  const onChange = (info) => {
    const { fileList } = info;

    // Filter out deleted files from the fileList
    const filteredFiles = fileList.filter(
      (file) => file.status !== "removed" && file.type === "application/pdf"
    );

    setUploadedFiles(filteredFiles);
    setFile(filteredFiles); // Update the parent's state here if needed
  };

  const onDeleteFile = (uid) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.uid !== uid)
    );
  };
  return (
    <div>
      <div className="upload-container">
        <Dragger
          className="document-upload"
          onChange={onChange}
          onDrop={onDrop}
          beforeUpload={beforeUpload}
          showUploadList={false}
          fileList={uploadedFiles}
          maxCount={maxCount}
          multiple={multiple}
        >
          <p className="import">{title}</p>
          <p className="browse">
            <UploadIcon /> Upload
          </p>
        </Dragger>

        {uploadedFiles?.map((file) => (
          <div className="upload-file-container" key={file.uid}>
            <div className="file-col-one">
              <File />
              <h2>{file.name}</h2>
            </div>
            <div
              className="file-delete-icon"
              onClick={() => onDeleteFile(file.uid)}
            >
              <FileDelete />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
