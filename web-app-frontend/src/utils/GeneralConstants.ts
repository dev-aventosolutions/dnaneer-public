// Enum representing the status
export enum Status {
  Inactive = "inactive",
  Active = "active",
  Rejected = "rejected",
  Commingsoon = "commingsoon",
  Closed = "closed",
}

// Function to map status to colors
export const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.Active:
      return "success";
    case Status.Inactive:
      return "default";
    case Status.Rejected:
      return "red";
    case Status.Commingsoon:
      return "gold";
    case Status.Closed:
      return "purple";
    default:
      return "orange";
  }
};
export const documentHeadings = {
  companyDocs: [
    "Commercial Registration",
    "Article Of Association",
    "VAT Registration Certificate",
    "Saudization Certificate",
    "GOSI Certificate",
    "Chamber Of Commerce Certificate",
    "Additional Documents",
    "Partners Agreement To Hire Authorized Person To Request Funding",
  ],
  financialDocs: [
    "Bank Statement For The Last 12 Months",
    "Financial Statements For The Last Fiscal Year",
    "Bank Additional Documents",
  ],
  bankDocs: ["Bank Account Identification Certificate"],
};
