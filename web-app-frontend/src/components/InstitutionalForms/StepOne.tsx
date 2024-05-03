import { useEffect, useState } from "react";
import { Form, Divider, Spin, message } from "antd";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import Upload from "components/Upload/Upload";
import { getCRInfo, getProfile, institutionalStepOne } from "services/Login";
import "../RadioGroup/radioGroup.scss";
import dayjs from "dayjs";
type Props = {
  data: any;
  onSuccess: (data: any) => void;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
};

const PHONE_REGEX = /^((?:[+?0?0?966]+)(?:\s?\d{2})(?:\s?\d{7}))$/;

function Step1Form({ data, onSuccess, setCurrent }: Props) {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [nafathInfo, setNafathInfo] = useState<any>();
  const [stepOneBody, setStepOneBody] = useState<any>();
  const [certificateDocs, setCertificateDocs] = useState(null);
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);

  const crInfoHandler = async () => {
    const fieldValue = form.getFieldValue("commercialNumber");
    if (fieldValue) {
      const body = {
        cr_number: fieldValue,
      };
      try {
        setLoader(true);
        const { data } = await getCRInfo(body);
        if (data) {
          form.setFieldsValue({
            companyName: `${data.data.company_name}`,
          });
          form.setFieldsValue({
            address: `${data.data.address}`,
          });
          form.setFieldsValue({
            legal_structure: `${data.data.legal_structure}`,
          });
          form.setFieldsValue({
            establishment_date: `${data.data.establishment_date}`,
          });
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    } else {
      message.error("Please enter registration Number");
    }
  };

  const saveStepOne = async () => {
    if (stepOneBody) {
      try {
        setLoader(true);
        const formData = new FormData();
        console.log(" userProfile.nafath?.national_id", stepOneBody);
        formData.append("user_id", `${stepOneBody?.user_id}`);
        formData.append("kyc_step", `${stepOneBody?.kyc_step}`);
        formData.append("registration_number", stepOneBody.registration_number);
        formData.append("company_name", stepOneBody.company_name);
        formData.append("establishment_date", stepOneBody.establishment_date);
        formData.append("address", stepOneBody.address);
        formData.append("legal_structure", stepOneBody.legal_structure);
        formData.append("investor_name", stepOneBody.investor_name);
        formData.append("position", stepOneBody.position);
        formData.append(
          "id_number",
          stepOneBody.national_id ? stepOneBody.national_id : ""
        );
        certificateDocs?.map((doc, index) => {
          formData.append(
            "certificate_documents[]",
            doc.originFileObj,
            doc.name || `file_${index}`
          );
        });
        const { data } = await institutionalStepOne(stepOneBody);
        if (data) {
          setCurrent(1);
          getNewData();
          message.success(data.message);
        }
      } catch (error) {
        console.log("err", error.response.data.message);
        message.error(error.response.data.message);
      } finally {
        setLoader(false);
      }
    }
  };

  const onFinish = async (values) => {
    setStepOneBody({
      user_id: userProfile?.id,
      kyc_step: 1,
      registration_number: values.commercialNumber,
      company_name: values.companyName,
      establishment_date: values.establishment_date,
      address: values.address,
      legal_structure: values.legal_structure,
      investor_name: values.Name,
      position: values.position,
      id_number: userProfile.national_id,
    });
    try {
      setLoader(true);
      await saveStepOne();
    } catch (error) {
      const err = error.response.data.errors;
      Object.keys(err).forEach(function (key, index) {
        message.error(err[key][0]);
      });
    } finally {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const getNewData = async () => {
    try {
      const { data } = await getProfile();
      if (data) {
        const userData = {
          ...data.data.user,
          nafath: await JSON.parse(data.data.user?.nafath),
        };
        setUserProfile(userData);
        form.setFieldsValue({
          date_of_birth: data?.data?.user?.institutional?.date_of_birth,
        });
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      // message.error(error.response.data.message);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      date_of_birth: dayjs(
        userProfile?.institutional?.date_of_birth,
        "YYYY-MM-DD"
      ),
    });
  }, [userProfile]);
  return (
    <div className="stepForm-container">
      <h1>Investor Information</h1>
      <Spin spinning={loader}>
        <Form
          form={form}
          name="basic"
          initialValues={{
            user_id: userProfile?.id,
            commercialNumber:
              userProfile?.institutional?.registration_number ?? "",
            companyName: userProfile?.institutional?.company_name ?? "-",
            establishment_date:
              userProfile?.institutional?.establishment_date ?? "-",
            address: userProfile?.institutional?.address ?? "-",
            legal_structure: userProfile?.institutional?.legal_structure ?? "-",
            Name:
              userProfile?.nafath?.englishFirstName +
              " " +
              userProfile?.nafath?.englishLastName,
            position: userProfile?.institutional?.position
              ? userProfile?.institutional?.position
              : "",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="register-input-container">
            <Form.Item
              name="commercialNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter your Registration Number",
                },
              ]}
            >
              <Input
                label="Enter the commercial registration number"
                placeholder="Enter the commercial registration number"
                className="drawer-input-register"
              />
            </Form.Item>
            <Button className="checkBtn" onClick={crInfoHandler}>
              Check
            </Button>
          </div>
          <div className="form-row">
            <Form.Item
              name="companyName"
              rules={[
                {
                  required: true,
                  message: "Please enter your Company Name",
                },
              ]}
            >
              <Input
                label="Company name"
                placeholder="Company name"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="establishment_date"
              rules={[
                {
                  required: true,
                  message: "Please enter your Establishment date",
                },
              ]}
            >
              <Input
                label="Establishment date"
                placeholder="Establishment date"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please enter your Address",
                },
              ]}
            >
              <Input
                label="Address"
                placeholder="Address"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="legal_structure"
              rules={[
                {
                  required: true,
                  message: "Please enter your legal_structure",
                },
              ]}
            >
              <Input
                maxLength={10}
                label="Company Legal Structure"
                placeholder="Company Legal Structure"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>
          </div>

          <h2>Investor's Manager (Contact Person)</h2>
          <Divider />
          <div style={{ marginTop: "27px" }} className="form-row">
            <Form.Item
              name="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your Name",
                },
              ]}
              shouldUpdate
            >
              <Input
                label="Name"
                placeholder="Name"
                className="drawer-input-two"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="position"
              rules={[
                {
                  required: true,
                  message: "Please enter your position",
                },
              ]}
            >
              <Input
                label="Role"
                placeholder="Position/Role"
                className="drawer-input-two"
              />
            </Form.Item>
          </div>
          <Upload
            setFile={setCertificateDocs}
            title="Upload the Certified Letter of Authorization from the Chamber of Commerce as PDF"
          />
          <Divider style={{ marginTop: "6rem" }} />
          <Form.Item>
            <div
              style={{ marginTop: "27px" }}
              className="drawer-next-container"
            >
              <Button className="drawer-next-btn" htmlType="submit">
                Next
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default Step1Form;
