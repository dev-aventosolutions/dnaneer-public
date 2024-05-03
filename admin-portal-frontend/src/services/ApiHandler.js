import axios from "axios";
import axiosInstance from "./instance";

export const loginUser = (data) => {
  return axiosInstance.post("api/admin/login", data);
};

export const opportunityDropDown = () => {
  return axiosInstance.get("api/admin/opportunity_dropdown_data");
};

export const getOpportunityList = () => {
  return axiosInstance.get("api/admin/oppurtunity_list");
};

export const createOpportunity = (data) => {
  return axiosInstance.post("api/admin/create_opportunity", data);
};

export const updateOpportunity = (data, id) => {
  return axiosInstance.post(`api/admin/update_opportunity/${id}`, data);
};

export const getCRInfo = (data) => {
  return axiosInstance.post("api/search-registration-number", data);
};

export const getInvestorsList = (page, userType, mode) => {
  if (userType && mode) {
    return axiosInstance.get(
      `/api/admin/get_investors?page=${page}&userType=${userType}&mode=${mode}`
    );
  } else {
    return axiosInstance.get(`/api/admin/get_investors?page=${page}`);
  }
};

export const getRequestedList = () => {
  return axiosInstance.get("/api/admin/vip_requests");
};

export const getKYCRequestedList = () => {
  return axiosInstance.get("/api/admin/kyc_users");
};

export const getInvestor = (id) => {
  return axiosInstance.get(`api/admin/get_single_investor/${id}`);
};

export const getTransactionsList = (id) => {
  return axiosInstance.get(`api/admin/get_transactions/${id}`);
};

export const getWithdrawalRequestListing = (request) => {
  return axiosInstance.get(`/api/admin/get_transfer_request?status=${request}`);
};

export const getAdvisorsList = () => {
  return axiosInstance.get("/api/admin/get_advisor_list");
};

export const deleteAdvisor = (id) => {
  return axiosInstance.delete(`api/admin/delete_advisor/${id}`);
};

export const getAdvisor = (id) => {
  return axiosInstance.get(`api/admin/get_single_advisor/${id}`);
};

export const getSingleOpportunity = (id) => {
  return axiosInstance.get(`api/admin/get_single_opportunity/${id}`);
};

export const getInstallmentStatus = () => {
  return axiosInstance.get(`api/admin/installmentStatus`);
};

export const getBankList = (id) => {
  return axiosInstance.get("/api/bank_list");
};

export const updateInstitutionalInvestor = (data) => {
  return axiosInstance.post("/api/admin/update_institutional_investor", data);
};

export const updateIndividualInvestor = (data) => {
  return axiosInstance.post("/api/admin/update_individual_investor", data);
};
export const updateBorrower = (data) => {
  return axiosInstance.post("/api/admin/update-profile-data", data);
};
export const installment = (data) => {
  return axiosInstance.post("/api/admin/create-loan", data);
};

export const createVipRequest = (data) => {
  return axiosInstance.post("/api/admin/accept_vip", data);
};

export const createAdminUser = (data) => {
  return axiosInstance.post("/api/admin/create_sub_admin", data);
};
export const getBalance = (number) => {
  return axios.get(
    `http://8.213.25.134/api/get-anb-balance?accountNumber=${number}`
  );
};
export const getStatement = (number, start, end) => {
  return axios.get(
    `http://8.213.25.134/api/get-anb-statement?accountNumber=${number}&fromDate=${start}&toDate=${end}&max=5&offset=Offset&type=JSON`
  );
  // &fromDate=2010-05-28&toDate=2022-02-13&max=5&offset=Offset&type=JSON
};
export const getEODStatement = (date) => {
  return axios.get(
    `http://8.213.25.134/api/get-anb-statement?order=DESC&date=${date}&take=5&page=1`
  );
  // &fromDate=2010-05-28&toDate=2022-02-13&max=5&offset=Offset&type=JSON
};
export const rejectOpportunity = (data) => {
  return axiosInstance.post("/api/admin/opportunity_approve", data);
};

export const getAdminUser = () => {
  return axiosInstance.get("/api/admin/getadmins");
};

export const createKYCRequest = (data) => {
  return axiosInstance.post("/api/admin/accept_invester_kyc", data);
};
export const accpetFundRequest = (data) => {
  return axiosInstance.post("/api/admin/update_transfer_request", data);
};
export const getSignleKYCDetail = (id) => {
  return axiosInstance.get(`/api/admin/get_single_investor/${id}`);
};
// export const createAdvisor = (data) => {
//     return axiosInstance.post("api/create_advisor", data);
// };
export const getBorrowerList = (page) => {
  return axiosInstance.get(`/api/admin/get_borrowers?page=${page}`);
};
export const getSingleBorrower = (id) => {
  return axiosInstance.get(`/api/admin/get_single_borrower/${id}`);
};
export const getRequestedBorrowerList = (page) => {
  return axiosInstance.get(`/api/admin/borrower_requests?page=${page}`);
};
export const getLoanList = (page, filter) => {
  return axiosInstance.get(
    `/api/admin/get-loans?per_page=15&page_no=${page}&status=${filter}`
  );
};
export const getSingleRequestedBorrower = (id) => {
  return axiosInstance.get(`/api/admin/borrower_requests_by_id/${id}`);
};
export const acceptRequestedBorrower = (body) => {
  return axiosInstance.post("/api/admin/update_request", body);
};
export const getTranferRequestDetail = (id) => {
  return axiosInstance.get(`/api/admin/transfer_request_by_id/${id}`);
};
export const getPartialNotifications = () => {
  return axiosInstance.get(`/api/admin/get_latest_notification_admin`);
};
export const exportInvestorsList = (body) => {
  return axiosInstance.post(`/api/admin/export-investors-csv`, body);
};
export const exportAdvisorsList = (body) => {
  return axiosInstance.post(`/api/admin/export-advisors-csv`, body);
};
export const exportBorrowersRequestList = (body) => {
  return axiosInstance.post(`/api/admin/export-borrower-requests-csv`, body);
};
export const exportBorrowersList = (body) => {
  return axiosInstance.post(`/api/admin/export-borrowers-csv`, body);
};
