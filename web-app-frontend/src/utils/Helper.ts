import { message } from "antd";
import CryptoJS from "crypto-js";

export const timeConverter = (t: number): string => {
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds} seconds`;
};

export const commaSeparator = (value) => {
  if (value) {
    return value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const passwordTester = (testObj, value) => {
  const numRegex = new RegExp("(?=.*[0-9])");
  const numTest = numRegex.test(value);

  const upCaseRegex = new RegExp("(?=.*[A-Z])");
  const upCaseTest = upCaseRegex.test(value);

  const lowCaseRegex = new RegExp("(?=.*[a-z])");
  const lowCaseTest = lowCaseRegex.test(value);

  const symbolRegex = new RegExp("(?=.*[!@#$%^&*])");
  const symbolTest = symbolRegex.test(value);

  return {
    ...testObj,
    lengthVal: value.length >= 8,
    oneNumVal: numTest,
    oneUpCaseVal: upCaseTest,
    oneLowCaseVal: lowCaseTest,
    specialVal: symbolTest,
  };
};

export const IBANInputHandler = (event) => {
  const { value } = event.target;
  if (value[2] === undefined) {
    return "SA";
  }
  if (!value.startsWith("SA") || !/^[0-9]+$/.test(value[2])) {
    message.error("IBAN Number must start with SA followed by 22 digits");
    return "SA";
  }
  return value;
};
export const getTimeDifference = (futureTime: any) => {
  var currentTime = new Date();
  var timeDiff = futureTime.getTime() - currentTime.getTime();

  var diffMilliseconds = Math.abs(timeDiff);
  var diffSeconds = Math.floor(diffMilliseconds / 1000);
  var diffMinutes = Math.floor(diffSeconds / 60);
  var diffHours = Math.floor(diffMinutes / 60);
  var diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    if (diffDays === 1) return diffDays + " day ago";
    else return diffDays + " days ago";
  } else if (diffHours > 0) {
    if (diffHours === 1) return diffHours + " hour ago";
    else return diffHours + " hours ago";
  } else if (diffMinutes > 0) {
    if (diffMinutes === 1) return diffMinutes + " minute ago";
    else return diffMinutes + " minutes ago";
  } else {
    return "just now";
  }
};
export const PhoneNoInputHandler = (event) => {
  const { value } = event.target;
  message.destroy();
  if (value[4] === undefined) {
    return "+966";
  }
  if (value[4] !== "5") {
    message.error("Phone Number must start with +9665");
    return "+966";
  }
  return value;
};
export const encryptUser = (user) => {
  try {
    const userJson = JSON.stringify(user);
    const encryptedUser = CryptoJS.AES.encrypt(
      userJson,
      "secret_key"
    ).toString();
    return encryptedUser;
  } catch (error) {
    console.log(error);
    message.error("error while encrypting user");
    return;
  }
};
export const getDecryptedUser = () => {
  try {
    const encryptedUser = localStorage.getItem("user");
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, "secret_key");
      const decryptedUserJson = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedUser = JSON.parse(decryptedUserJson);
      return decryptedUser;
    }
  } catch (error) {
    console.error("Error decrypting user:", error);
    message.error("Error decoding user");
    return;
  }
};
