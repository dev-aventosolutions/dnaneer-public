import { useState, useEffect } from "react";
import { message, Upload } from "antd";
import { ReactComponent as UploadIcon } from "../../assets/svgs/UploadIcon.svg";
import { ReactComponent as File } from "../../assets/svgs/File.svg";
import { ReactComponent as FileDelete } from "../../assets/svgs/FileDelete.svg";
import "./upload.scss";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];
  const isAllowedType = allowedTypes.includes(file.type);

  if (!isAllowedType) {
    message.error("You can only upload PDF, XLSX, or CSV files");
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isLt5M) {
    message.error("File must be smaller than 5MB!");
    return false;
  }

  return isAllowedType && isLt5M;
};;

const UploadComponent = ({ setFiles ,files=[] }) => {

  const onDrop = (e) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  const onChange = (info) => {
    setFiles([info?.file]);
  };

  const onDeleteFile = (uid) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.uid !== uid)
    );
  };

  return (
    <div>
      <div className="upload-container">
        <Dragger
          className="document-upload"
          onChange={(e) => onChange(e)}
          onDrop={onDrop}
          beforeUpload={beforeUpload}
          showUploadList={false}
          fileList={files}
        >
          <p className="import">Upload the Supporting Document as PDF</p>
          <p className="browse">
            <UploadIcon /> Upload
          </p>
        </Dragger>

        {files?.map((file) => (
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
