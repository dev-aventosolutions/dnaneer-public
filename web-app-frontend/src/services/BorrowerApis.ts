import axiosInstance from "./InstanceBorrower";

//Auth
export const borrowerLogin = (data) => {
  return axiosInstance.post("api/borrower/login", data);
};

export const borrowerRegister = (data) => {
  return axiosInstance.post("api/borrower/register", data);
};

export const borrowerLogout = (data) => {
  return axiosInstance.post("api/borrower/logout", data);
};

export const verifyCRNumber = (data) => {
  return axiosInstance.post("api/borrower/search-registration-number", data);
};

//Otp
export const generateBorrowerOtp = (data) => {
  return axiosInstance.post("api/borrower/generate-otp", data);
};

//Kyc-Step
export const getBorrowerKyc = () => {
  return axiosInstance.get("api/borrower/cr_data");
};

export const borrowerKycStep = (data) => {
  return axiosInstance.post("api/borrower/updatekyc", data);
};

export const getBorrowerInstallments = () => {
  return axiosInstance.get("api/borrower/get-borrower-installment");
};

export const getBorrowerDetails = () => {
  return axiosInstance.get("api/borrower/get-borrower-details");
};
export const updateBorrower = (data) => {
  return axiosInstance.post("/api/borrower/updateprofile", data);
};
export const verifyBorrowerLoginOTP = (data) => {
  return axiosInstance.post("api/borrower/verifyloginotp", data);
};