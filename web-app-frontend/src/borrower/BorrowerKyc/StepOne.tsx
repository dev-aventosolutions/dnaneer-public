import { useEffect, useState } from "react";
import { Form, Divider, Radio, Checkbox, message, Spin } from "antd";
import RadioGroup from "components/RadioGroup/RadioGroup";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import {
  borrowerKycStep,
  getBorrowerKyc,
  verifyCRNumber,
} from "services/BorrowerApis";
import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AppInput from "components/Input/Input";
import { PhoneNoInputHandler } from "utils/Helper";
import dayjs from "dayjs";
import AppDatePicker from "components/DatePicker/DatePicker";

type Props = {
  data: any;
  onSuccess: (data: any) => void;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
};

function Step1Form({ data, onSuccess, setCurrent }: Props) {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [crValue, setCRValue] = useState<any>();
  const [iAgree, setIAgree] = useState(false);
  // const employOptions: { label: string; value: string | number }[] = [
  //   {
  //     label: "Yes",
  //     value: "1",
  //   },
  //   {
  //     label: "No",
  //     value: "0",
  //   },
  // ];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getBorrowerKyc();
        if (data) {
          data.data.data.user = {
            ...data?.data?.data?.user,
            wathq: JSON.parse(data?.data?.data?.user.wathq),
          };
          console.log("data?.data?.data", data?.data?.data);
          setCRValue(data?.data?.data);
          form.setFieldsValue({
            commercialNumber: data.data?.data?.cr_number
              ? data.data?.data?.cr_number
              : "",
            business_name: data.data?.data?.business_name
              ? data.data?.data?.business_name
              : "",
            business_activity: data.data?.data?.business_activity
              ? data.data?.data?.business_activity
              : "",
            cr_expiry_date: data?.data?.data?.user?.wathq?.expiryDate
              ? data?.data?.data?.user?.wathq?.expiryDate
              : "",
            announced_amount: data?.data?.data?.user?.wathq?.capital
              ?.announcedAmount
              ? data?.data?.data?.user?.wathq?.capital?.announcedAmount
              : "",
            capital: data.data?.data?.capital ? data.data?.data?.capital : "",
            address: data.data?.data?.address ? data.data?.data?.address : "",
            legal_structure: data.data?.data?.legal_type
              ? data.data?.data?.legal_type
              : "",
            name: data.data?.data.name ? data.data?.data.name : "",
            saudi_id_number: data.data?.data.saudi_id_number
              ? data.data?.data.saudi_id_number
              : "",
            position: data.data?.data.position ? data.data?.data.position : "",
            phone_number: data.data?.data.phone_number
              ? data.data?.data.phone_number
              : "+966",
            dob: dayjs(data?.data?.data?.dob, "YYYY-MM-DD"),
            company_endorsement: data.data?.data?.company_endorsement,
            // high_level_mission:
            //   data.data?.data?.high_level_mission == 1 ? "1" : "0",
            // senior_position: data.data?.data?.senior_position == 1 ? "1" : "0",
            // marriage_relationship:
            //   data.data?.data?.marriage_relationship == 1 ? "1" : "0",
          });
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        // message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // const crInfoHandler = async () => {
  //   console.log("crInfoHandler");
  //   const fieldValue = form.getFieldValue("commercialNumber");
  //   console.log("fieldValue", fieldValue);
  //   if (fieldValue) {
  //     const body = {
  //       cr_number: fieldValue,
  //     };
  //     try {
  //       setLoading(true);
  //       const { data } = await verifyCRNumber(body);
  //       if (data) {
  //         form.setFieldsValue({
  //           business_name: `${data.data.company_name}`,
  //         });
  //         form.setFieldsValue({
  //           address: `${data.data.address}`,
  //         });
  //         form.setFieldsValue({
  //           legal_structure: `${data.data.legal_structure}`,
  //         });
  //         form.setFieldsValue({
  //           cr_expiry_date: `${data?.data?.cr_expiry_date}`,
  //         });
  //       }
  //     } catch (error) {
  //       console.log("err", error.response.data.message);
  //       message.error(error.response.data.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     message.error("Please enter registration Number");
  //   }
  // };

  // const onChangePhone = (e) => {
  //   //  console.log(e.target.value.length)
  //   const { value } = e.target;
  //   // console.log("value", value, value[4])
  //   if (value[4] === undefined) {
  //     return setPhoneNum("+966");
  //   }
  //   if (value[4] !== "5") {
  //     return message.error("Number must start with 5");
  //   }

  //   if (value.length > 3 && /^\+\d*$/.test(value)) {
  //     return setPhoneNum(value);
  //   }
  // };

  const onFinish = async (values) => {
    const body = {
      user_id: data?.user_id,
      step: 1,
      name: values.name,
      saudi_id_number: values.saudi_id_number,
      position: values.position,
      phone_number: values.phone_number,
      dob: dayjs(values?.dob, "YYYY-MM-DD").format("YYYY-MM-DD"),
      company_endorsement: values?.company_endorsement ? "1" : "0",
      // high_level_mission: values?.high_level_mission,
      high_level_mission: 0,
      // senior_position: values?.senior_position,
      senior_position: 0,
      // marriage_relationship: values?.marriage_relationship,
      marriage_relationship: 0,
    };
    try {
      setLoading(true);
      const { data } = await borrowerKycStep(body);
      if (data) {
        setCurrent(1);
        navigate(`/borrower-request/1`);
        message.success(data.message);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading}>
      <div className="stepForm-container">
        <h1>Company Information</h1>
        <Form
          form={form}
          name="basic"
          initialValues={{
            commercialNumber: crValue?.cr_number ? crValue?.cr_number : "",
            business_name: crValue?.business_name ? crValue?.business_name : "",
            cr_expiry_date: crValue?.cr_expiry_date
              ? crValue?.cr_expiry_date
              : "",
            address: crValue?.address ? crValue?.address : "",
            legal_structure: crValue?.legal_type ? crValue?.legal_type : "",
            name: crValue?.name ? crValue?.name : "",
            saudi_id_number: crValue?.saudi_id_number
              ? crValue?.saudi_id_number
              : "",
            position: crValue?.position ? crValue?.position : "",
            phone_number: crValue?.phone_number ? crValue?.phone_number : "",
            company_endorsement: crValue?.company_endorsement
              ? crValue?.company_endorsement
              : 0,
            // senior_position: crValue?.senior_position?.toString(),
            // high_level_mission: crValue?.high_level_mission?.toString(),
            // marriage_relationship: crValue?.marriage_relationship?.toString(),
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="register-input-container">
            <Form.Item
              name="commercialNumber"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Registration Number",
              //   },
              // ]}
            >
              <Input
                label="Commercial Registration"
                placeholder="Commercial Registration"
                className="drawer-input"
                disabled
              />
            </Form.Item>
            {/* <Button className="checkBtn" onClick={crInfoHandler}>
              Check
            </Button> */}
          </div>
          <div className="form-row">
            <Form.Item
              name="business_name"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Business Name",
              //   },
              // ]}
            >
              <Input
                label="Business name"
                placeholder="Business name"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="business_activity"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Business Activity",
              //   },
              // ]}
            >
              <Input
                label="Business Activity"
                placeholder="Business Activity"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="legal_structure"
              rules={
                [
                  // {
                  //   required: true,
                  //   message: "Please enter your Legal Type",
                  // },
                ]
              }
            >
              <Input
                maxLength={10}
                label="Legal Type"
                placeholder="Legal Type"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="capital"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Capital",
              //   },
              // ]}
            >
              <Input
                label="Capital"
                placeholder="Capital"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="cr_expiry_date"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Expiry Date",
              //   },
              // ]}
            >
              <Input
                label="CR Expiry Date"
                placeholder="CR Expiry Date"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="address"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Address",
              //   },
              // ]}
            >
              <Input
                label="National Address"
                placeholder="National Address"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="announced_amount"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Expiry Date",
              //   },
              // ]}
            >
              <Input
                label="Announced Amount"
                placeholder="Announced Amount"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>
          <h2>Contact person information</h2>
          <Divider />
          <div style={{ marginTop: "27px" }} className="form-row">
            <Form.Item
              name="name"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter your Name",
              //   },
              // ]}
            >
              <Input
                label="Name"
                placeholder="Name"
                className="drawer-input-three"
              />
            </Form.Item>
            <Form.Item
              name="saudi_id_number"
              rules={[
                {
                  required: true,
                  message: "Please enter your Enter National ID / Iqama Number",
                  pattern: /^\d+$/,
                },
                {
                  pattern: /^[1-2]\d*$/,
                  message: "ID must begin with 1 or 2",
                },
              ]}
            >
              <Input
                label="National ID / Iqama Number"
                placeholder="National ID / Iqama Number"
                className="drawer-input-three"
                maxLength={10}
              />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="position"
              rules={[
                {
                  required: true,
                  message: "Please enter your Name",
                },
              ]}
            >
              <Input
                label="Position/Role"
                placeholder="Position/Role"
                className="drawer-input-three"
              />
            </Form.Item>
            <Form.Item
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please enter your Enter Saudi number",
                },
                {
                  pattern: /^\+9665\d{8}$/,
                  message:
                    "Phone number must start with '+9665' and be followed by 8 digits.",
                },
              ]}
              getValueFromEvent={PhoneNoInputHandler}
            >
              <AppInput
                // max={9}
                label="Phone number"
                placeholder="+96651234567"
                className="drawer-input-three"
                maxLength={13}
              />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Please enter your Date of Birth!",
                },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    const dob: any = new Date(value.toDate());
                    const today: any = new Date();
                    let age: any = today.getFullYear() - dob.getFullYear();
                    const monthDiff: any = today.getMonth() - dob.getMonth();

                    if (
                      monthDiff < 0 ||
                      (monthDiff === 0 && today.getDate() < dob.getDate())
                    ) {
                      age--;
                    }

                    if (age >= 18) {
                      return Promise.resolve();
                    }

                    return Promise.reject("You must be at least 18 years old.");
                  },
                },
              ]}
            >
              {(crValue?.dob === null || crValue?.dob) && (
                <AppDatePicker
                  block={true}
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  className="drawer-input-three drawer-input-one-date"
                  defaultValue={
                    crValue?.dob ? dayjs(crValue?.dob, "YYYY-MM-DD") : null
                  }
                  onChange={(e) => {
                    form.setFieldsValue({ dob: e });
                  }}
                  disabledDate={(current) => {
                    // Get the current date
                    const today = moment();

                    // Disable dates that are after today
                    return current && current > today;
                  }}
                />
              )}
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="company_endorsement"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (iAgree) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Please accept terms & conditions");
                  },
                }),
              ]}
            >
              <Checkbox
                value={iAgree}
                onClick={(e: any) => {
                  setIAgree(e.target.checked);
                }}
              >
                I agree on the{" "}
                <a
                  href="https://backend.dnaneer.com/storage/dnaneer/Dnaneer%20Consent.pdf"
                  target="_blank"
                >
                  Company Consent
                </a>
              </Checkbox>
            </Form.Item>
          </div>

          {/* <h1>General Information</h1>
          <div>
            <h2
              style={{
                fontWeight: "500",
                fontSize: "16px",
                color: "#140a2b",
              }}
            >
              <span style={{ color: "#ff4d4f" }}>* </span>Are you assigned to
              high-level missions in the Kingdom of Saudi Arabia or in a foreign
              country?
            </h2>
            <Form.Item
              name="high_level_mission"
              // label="Are you assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country?"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Radio.Group className="appRadioGroup">
                {employOptions?.map((option) => (
                  <Radio.Button value={option.value} className={"appRadioBtn"}>
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <div>
            <h2
              style={{
                fontWeight: "500",
                fontSize: "16px",
                color: "#140a2b",
              }}
            >
              <span style={{ color: "#ff4d4f" }}>* </span>Are you in a senior
              management position or a job in an international organization?
            </h2>
            <Form.Item
              name="senior_position"
              // label="Are you in a senior management position or a job in an international organization?"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Radio.Group className="appRadioGroup">
                {employOptions?.map((option) => (
                  <Radio.Button value={option.value} className={"appRadioBtn"}>
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
          <div>
            <h2
              style={{
                fontWeight: "500",
                fontSize: "16px",
                color: "#140a2b",
              }}
            >
              <span style={{ color: "#ff4d4f" }}>* </span>Do you have a blood or
              marriage relationship, up to the second degree, with someone who
              is assigned to high-level missions in the Kingdom of Saudi Arabia
              or in a foreign country, or in senior management positions or a
              job in an international organization?
            </h2>
            <Form.Item
              name="marriage_relationship"
              // label="Do you have a blood or marriage relationship, up to the second degree, with someone who is assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country, or in senior management positions or a job in an international organization?"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Radio.Group className="appRadioGroup">
                {employOptions?.map((option) => (
                  <Radio.Button value={option.value} className={"appRadioBtn"}>
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div> */}
          <Divider />
          <div style={{ marginTop: "27px" }} className="drawer-next-container">
            <Button className="drawer-next-btn" htmlType="submit">
              Next
            </Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
}

export default Step1Form;
