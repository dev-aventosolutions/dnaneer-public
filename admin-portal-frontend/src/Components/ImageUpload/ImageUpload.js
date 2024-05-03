import { useState } from "react";
import { message, Spin } from "antd";
import { ReactComponent as ProfileIcon } from "../../assets/svgs/ProfileIcon.svg";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import "./ImageUpload.scss";

const ImageUpload = ({ src, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState(
    src
      ? `${process.env.REACT_APP_baseURL}` + src
      : "/assets/images/Mask Group.png"
  );

  const onFileChange = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      if (!(file.type === "image/jpeg" || file.type === "image/png")) {
        message.error("You can only upload JPG/PNG file!");
        return;
      }

      const resizedFile = await new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          800, // maximum width
          800, // maximum height
          "JPEG", // compress format
          80, // quality
          0, // rotation
          (resizedImage) => {
            resolve(resizedImage);
          },
          "blob", // output type
          800, // new width (optional)
          800 // new height (optional)
        );
      });

      if (resizedFile.size > maxSizeInBytes) {
        message.error("Image size exceeds the maximum limit of 3MB!");
        return;
      }

      const formData = new FormData();
      formData.append("image", resizedFile);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        `${process.env.REACT_APP_baseURL}api/update-userprofileimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileUrl(
        "https://backend.dnaneer.com/" +
          (response?.file ? response?.file : response?.data?.file)
      );

      setLoading(false);
      message.success("Image uploaded successfully");
    } catch (error) {
      setLoading(false);
      message.error("Error occurred while processing the image");
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <>
          <div className="custom_file_wraper">
            <label htmlFor="file">
              <input
                type="file"
                id="file"
                onChange={onFileChange}
                className="avatar-uploader"
              />
              {/* {profileUrl && ( */}
              <div className="upload-icon">
                <ProfileIcon />
              </div>
            </label>
            <img
              src={profileUrl}
              alt="avatar"
              className="avatar"
              style={
                userProfile?.mode !== "vip" && userProfile?.user_type === 1
                  ? {
                      background:
                        "linear-gradient(white, white) padding-box, linear-gradient(to right, #2b48f4, #34a5ff) border-box",
                    }
                  : userProfile?.mode === "vip" && userProfile?.user_type === 1
                  ? {
                      background:
                        "linear-gradient(white, white) padding-box, linear-gradient(to right,#f4422b ,#ffda34) border-box",
                    }
                  : userProfile?.user_type === 2
                  ? {
                      background:
                        "linear-gradient(white, white) padding-box, linear-gradient(to right, #d87c5d 0%, #dc596b 42.55%, #8a86ab 77.97%, #6eb4da 100%) border-box",
                    }
                  : userProfile?.user_type === 3 && {
                      background:
                        " linear-gradient(white, white) padding-box, linear-gradient(to right, #D87C5D 0%, #ACD4B1 42.55%, #BBBE72 77.97%, #6D14E4 100%) border-box",
                    }
              }
            />
          </div>
        </>
      </Spin>
    </>
  );
};

export default ImageUpload;
