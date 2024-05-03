import axiosInstance from "./Instance";
// type DataProps = {
//   email?: string;
//   user_type: 1 | 2;
//   password?: string;
//   phone_number?: string;
// };

export const registerId = (data) => {
  return axiosInstance.post("api/send-nafath-notification", data);
};

export const nafathStatus = (data) => {
  return axiosInstance.post("api/nafath-notification-status", data);
};
export const nafathInstitutionalStatus = (data) => {
  return axiosInstance.post("api/verify-contact-person-nafath-code", data);
};
export const register = (data) => {
  return axiosInstance.post("api/signup", data);
};

export const getOpportunityList = () => {
  return axiosInstance.get("api/investor-opportunities");
};

export const login = (data) => {
  return axiosInstance.post("api/login", data);
};

// type VerifyOTPProps = {
//   user_id: number;
//   otp: string;
//   module_type: string;
// };

export const verifyOTP = (data) => {
  return axiosInstance.post("api/verify-otp", data);
};
export const verifyUnifonicOTP = (data) => {
  return axiosInstance.post("api/verify-unifonic-otp", data);
};

export const verifyAbsherOTP = (data) => {
  return axiosInstance.post("api/verify-absher-otp", data);
};

export const signUpInstitutional = (data) => {
  return axiosInstance.post("api/signup-institutional", data);
};

export const verifyLoginOTP = (data) => {
  return axiosInstance.post("api/verify-login-otp", data);
};

export const investOpportunity = (data) => {
  return axiosInstance.post("api/invest-now", data);
};

export const getOpportunityDetail = (data) => {
  return axiosInstance.get(`api/get_single_opportunity/${data.id}`);
};

export const updateProfilePicture = (data) => {
  return axiosInstance.post("api/update-userprofileimage", data);
};

export const getProfile = () => {
  return axiosInstance.get("api/get-user");
};

export const getInvestments = () => {
  return axiosInstance.get("api/my_investments");
};

export const generateOTP = (data) => {
  return axiosInstance.post("api/generate-otp", data);
};

export const generateUnifonicOTP = (data) => {
  return axiosInstance.post("api/send-unifonic-otp", data);
};

export const generateAbsherOTP = () => {
  return axiosInstance.get("api/send-absher-otp");
};
//KYC
export const individualStepOne = (data) => {
  return axiosInstance.post("api/individual-kyc-details", data);
};

export const institutionalStepOne = (data) => {
  return axiosInstance.post("api/institutional-kyc-details", data);
};

export const getTransactions = () => {
  return axiosInstance.get("api/get-transactions");
};

export const getCRInfo = (data) => {
  return axiosInstance.post("api/search-registration-number", data);
};

export const updateProfileIns = (data) => {
  return axiosInstance.post("api/update_institutional_investor", data);
};
export const updatePasswordIns = (data) => {
  return axiosInstance.post("api/change_password", data);
};

export const updateProfileInd = (data) => {
  return axiosInstance.post("api/update_individual_investor", data);
};
export const updatePasswordInd = (data) => {
  return axiosInstance.post("api/change_password", data);
};
export const getBankList = () => {
  return axiosInstance.get("api/bank_list");
};
export const upgradeAccount = (value: any) => {
  return axiosInstance.post("api/upgrade-account", value);
};

//For deactivate
export const deactivateAccount = () => {
  return axiosInstance.get("api/deactivate");
};

export const transferRequest = (value: any) => {
  return axiosInstance.post("api/fund_transfer", value);
};
export const getInvestmentDetail = (id: string) => {
  return axiosInstance.get(`api/admin/get_investment_by_id/${id}`);
};

export const getPartialNotifications = () => {
  return axiosInstance.get(`api/notifications`);
};

export const getInstitutionalNaftah = (data) => {
  return axiosInstance.post(`api/verify-institute-contact-person`, data);
};
