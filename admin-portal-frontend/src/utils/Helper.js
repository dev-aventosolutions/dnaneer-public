import { message } from "antd";

export const commaSeparator = (value) => {
  return value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
export const PhoneNoInputHandler = (event) => {
  const { value } = event.target;
  console.log("value", value[4]);
  if (value[4] === undefined) {
    return "+966";
  }
  if (value[4] !== "5") {
    message.error("Phone Number must start with +9665");
    return "+966";
  }
  return value;
};
export function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + "k";
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else {
    return (number / 1000000000).toFixed(1) + "B";
  }
}