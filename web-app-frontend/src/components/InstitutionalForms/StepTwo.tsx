import { useEffect, useState } from "react";
import { Form, Divider, Select, message, Spin, Col, Row } from "antd";
import classes from "./steps.module.scss";

import { ReactComponent as Doc } from "assets/svgs/Doc.svg";
import { ReactComponent as Cross } from "assets/svgs/Cross.svg";

import Input from "components/Input/Input";

import Button from "components/Button/Button";
import RadioGroup from "components/RadioGroup/RadioGroup";
import Upload from "components/Upload/Upload";

import { userProfileAtom } from "store/user";
import { useRecoilState } from "recoil";
import { getBankList, getProfile, institutionalStepOne } from "services/Login";
// import { ReactComponent as Aggrement } from "assets/svgs/Aggrement.svg";
import FloatSelect from "components/Select/Select";
import { IBANInputHandler } from "utils/Helper";
const { Option } = Select;

const incomeOptions: { label: string; value: string | number }[] = [
  {
    label: "Investments",
    value: "investments",
  },
  {
    label: "Business Income",
    value: "business_income",
  },
  {
    label: "Rental Income",
    value: "Rental Income",
  },
  {
    label: "others",
    value: "others",
  },
];

const anualOptions: { label: string; value: string | number }[] = [
  {
    label: "0 - 20M",
    value: "0-20",
  },
  {
    label: "20M - 50M",
    value: "20-50",
  },
  {
    label: "50M - 200M",
    value: "50-200",
  },
  {
    label: "200M+",
    value: "200+",
  },
];

export const approxyOptions: { label: string; value: string | number }[] = [
  {
    label: "0-500k",
    value: "0-500k",
  },
  {
    label: "500k-6.5m",
    value: "500k-6.5m",
  },
  {
    label: "6.5m-35m",
    value: "6.5m-35m",
  },
  {
    label: "35m+",
    value: "35m+",
  },
];

type BackProps = {
  onBack: () => void;
};

type Props = BackProps & {
  data: any;
  onSuccess: (data: any) => void;
  handleSkip: (step: string) => void;
};

function Step2Form({ data, onSuccess, onBack, handleSkip }: Props) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [loading, setLoading] = useState(false);
  const [bankOptions, setBankOptions] = useState([]);
  const [bankDocs, setBankDoocs] = useState(null);
  const [legalDocs, setLegalDocs] = useState(null);
  const [otherSupportingDocs, setOtherSupportingDocs] = useState(null);

  const onFinish = async (values) => {
    const body = {
      user_id: userProfile.id,
      kyc_step: 2,
      source_of_income: values.income,
      annual_revenue: values.annual_revenue,
      bank_id: values.bank_id,
      iban: values.IBAN,
      // annual_investment_amount: values.annual_investment_amount,
    };
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", `${body.user_id}`);
      formData.append("kyc_step", `${body.kyc_step}`);
      formData.append("source_of_income", body.source_of_income);
      formData.append("annual_revenue", body.annual_revenue);
      formData.append("bank_id", body.bank_id);
      formData.append("iban", body.iban);
      // formData.append(
      //   "annual_investment_amount",
      //   body.annual_investment_amount
      // );

      bankDocs?.map((bankDoc, index) => {
        formData.append(
          "bank_documents[]",
          bankDoc.originFileObj,
          bankDoc.name || `file_${index}`
        );
      });
      legalDocs?.map((legalDoc, index) => {
        formData.append(
          "legal_documents[]",
          legalDoc.originFileObj,
          legalDoc.name || `file_${index}`
        );
      });
      otherSupportingDocs?.map((otherSupportingDocs, index) => {
        formData.append(
          "other_documents[]",
          otherSupportingDocs.originFileObj,
          otherSupportingDocs.name || `file_${index}`
        );
      });
      const { data } = await institutionalStepOne(formData);
      if (data) {
        onSuccess("2");
        getNewData();
        message.success(data.message);
      }
    } catch (error) {
      console.log("err", error);
      // message.error(error?.response?.data?.message ?? "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const getNewData = async () => {
    try {
      const { data } = await getProfile();
      if (data) {
        setUserProfile(data.data.user);
      }
    } catch (error) {
      console.log("err", error?.response?.data?.message);
      // message.error(error.response.data.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const fetchBankList = async () => {
    try {
      const { data } = await getBankList();
      if (data) setBankOptions(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, [userProfile]);
  return (
    <div className="stepForm-container">
      <h1>Financial Information</h1>
      <Spin spinning={loading}>
        <Form
          name="basic"
          initialValues={{
            user_id: userProfile?.id,
            commercialNumber: userProfile?.institutional?.cr_number ?? "-",
            companyName: userProfile?.institutional?.company_name ?? "-",
            establishment_date:
              userProfile?.institutional?.establishment_date ?? "-",
            address: userProfile?.institutional?.address ?? "-",
            legal_structure: userProfile?.institutional?.legal_structure ?? "-",

            bank: userProfile?.institutional?.bank,
            IBAN: userProfile?.accounts?.personal_iban_number ?? "SA",
            bank_id: userProfile?.accounts?.bank_id,

            income: userProfile?.institutional?.source_of_income,
            annual_revenue: userProfile?.institutional?.annual_revenue,
            annual_investment_amount:
              userProfile?.institutional?.annual_investment_amount,

            Name: userProfile?.institutional?.investor_name,
            position: userProfile?.institutional?.position,
            sId: userProfile?.institutional?.id_number,
            phone: userProfile?.institutional?.phone_number,
            // dob: userProfile?.dob,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="income"
            label="Source of income"
            rules={[
              {
                required: true,
                message: "Please enter your income options",
              },
            ]}
          >
            <RadioGroup
              options={incomeOptions}
              defaultValue={userProfile?.institutional?.source_of_income}
            />
          </Form.Item>
          <Form.Item
            name="annual_revenue"
            label="Approximate of company annual revenue (SAR)"
            rules={[
              {
                required: true,
                message: "Please enter your company annual revenue",
              },
            ]}
          >
            <RadioGroup
              options={anualOptions}
              defaultValue={userProfile?.institutional?.annual_revenue}
            />
          </Form.Item>

          <h2>Bank Information</h2>
          <Divider />
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "50px" }}>
            <Form.Item
              name="bank_id"
              rules={[
                {
                  required: true,
                  message: "Please select bank",
                },
              ]}
              style={{ width: "318px" }}
            >
              <FloatSelect
                // style={{ borderRadius: "24px" }}
                label="Select Bank"
                placeholder="Select Bank"
                className="drawer-select"
                defaultValue={
                  userProfile?.accounts?.bank_id
                    ? userProfile?.accounts?.bank_id
                    : false
                }
              >
                {bankOptions.map((bank, i) => {
                  return (
                    <Option key={i} value={bank.value}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <img
                          src={bank.logo}
                          alt={`Logo for ${bank.label}`}
                          style={{
                            width: "40px",
                            height: "15px",
                            paddingRight: "7px",
                          }}
                        />
                        {bank.label}
                      </div>
                    </Option>
                  );
                })}
              </FloatSelect>
            </Form.Item>
            <Form.Item
              name="IBAN"
              rules={[
                {
                  required: true,
                  message: "Please enter your IBAN number",
                },
                {
                  pattern: /^SA\d{22}$/,
                  message: "Invalid IBAN number",
                },
              ]}
              getValueFromEvent={IBANInputHandler}
            >
              <Input
                maxLength={24}
                label="IBAN number"
                placeholder="IBAN number"
                className="drawer-input-three"
                style={{ height: "55px", width: "318px" }}
              />
            </Form.Item>
          </div>
          <Upload
            setFile={setBankDoocs}
            title="Bank account identification certificate"
          />

          <h2>Legal Documents</h2>
          <Divider style={{ margin: "10px 0 19px 0" }} />
          <Upload
            setFile={setLegalDocs}
            title=" Upload the Article of Association as PDF"
          />

          <h2>Other Supporting Documents</h2>
          <Divider style={{ margin: "10px 0 19px 0" }} />
          <Upload
            setFile={setOtherSupportingDocs}
            title="Upload other supporting documents"
          />

          <Divider style={{ margin: "35px 0 19px 0" }} />

          <div className="drawer-final-container">
            <div className="skip" onClick={() => handleSkip("2")}>
              Skip for now
            </div>
            <div className="previous" onClick={() => onBack()}>
              Previous step
            </div>

            <Button className="complete-btn" htmlType="submit">
              Complete
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
}

export default Step2Form;
