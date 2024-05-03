import { useEffect, useState } from "react";
import { Form, Divider, Spin, message } from "antd";
import { SetStateAction, Dispatch } from "react";
import Input from "components/Input/Input";
import { userProfileAtom } from "store/user";
import Button from "components/Button/Button";
import RadioGroup from "components/RadioGroup/RadioGroup";
import Upload from "components/Upload/Upload";
import { useRecoilState } from "recoil";

import { getProfile, individualStepOne } from "services/Login";

const educationOptions: { label: string; value: string | number }[] = [
  {
    label: "Postgraduate",
    value: "Postgraduate",
  },
  {
    label: "Undergraduate",
    value: "Undergraduate",
  },
  {
    label: "High school",
    value: "High school",
  },
];

const employOptions: { label: string; value: string | number }[] = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];

const infoOptions: { label: string; value: string | number }[] = [
  {
    label: "Less than 1 year",
    value: "Less than 1 year",
  },
  {
    label: "1-5 years",
    value: "1-5 years",
  },
  {
    label: "More than 5 years",
    value: "More than 5 years",
  },
];

type Props = {
  data: any;
  onSuccess: (data: any) => void;
  setCurrent: Dispatch<SetStateAction<number>>;
  handleSkip: (step?: string) => void;
};

export default function Step2Form({
  data,
  onSuccess,
  setCurrent,
  handleSkip,
}: Props) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [loading, setLoading] = useState(false);
  const [currentlyEmployed, setCurrentlyEmployed] = useState(
    userProfile?.individual?.employee == "Yes" ? "1" : "0"
  );


  const onFinish = async (values) => {
    const body = {
      user_id: userProfile.id,
      kyc_step: 1,
      education: values.education,
      employee: values.employee === "1" ? "Yes" : "No",
      current_company: values.company,
      current_position: values.position,
      current_experience: values.experience,
      high_level_mission: values.high_level_mission,
      senior_position: values.senior_position,
      marriage_relationship: values.marriage_relationship,
    };
    try {
      setLoading(true);
      const { data } = await individualStepOne(body);
      if (data) {
        getNewData();
        setCurrent(1);
        message.success(data.message);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getNewData = async () => {
    try {
      setLoading(true);
      const { data } = await getProfile();
      if (data) {
        setUserProfile(data.data.user);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      // message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    setCurrentlyEmployed(
      userProfile?.individual?.employee === "Yes" ? "1" : "0"
    );
  }, [userProfile]);
  return (
    <div className="stepForm-container">
      <h1>Personal Information</h1>
      <Spin spinning={loading}>
        <Form
          name="basic"
          initialValues={{
            education: userProfile?.individual?.education,
            employee: currentlyEmployed,
            company: userProfile?.individual?.current_company ?? "",
            position: userProfile?.individual?.current_position ?? "",
            experience: userProfile?.individual?.current_experience ?? "",
            source_of_income: userProfile?.individual?.source_of_income,
            average_income: userProfile?.individual?.average_income,
            net_worth: userProfile?.individual?.net_worth,
            name: userProfile?.individual?.name,
            personal_iban_number: userProfile?.accounts?.personal_iban_number ?? "SA",
            investment_objectives:
              userProfile?.individual?.investment_objectives,
            investment_knowledge: userProfile?.individual?.investment_knowledge,
            wallet_id: userProfile?.accounts?.dnaneer_account_no,
            bank_id: userProfile?.accounts?.bank_id,
            high_level_mission:
              userProfile?.individual?.high_level_mission == 1 ? "1" : "0",
            senior_position:
              userProfile?.individual?.senior_position == 1 ? "1" : "0",
            marriage_relationship:
              userProfile?.individual?.marriage_relationship == 1 ? "1" : "0",
            // dob: userProfile?.dob,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="education"
            label="Education"
            rules={[
              {
                required: true,
                message: "Please enter your Education",
              },
            ]}
          >
            <RadioGroup
              options={educationOptions}
              defaultValue={userProfile?.individual?.education}
            />
          </Form.Item>
          <Form.Item
            name="employee"
            label="Are you currently an employee?"
            rules={[
              {
                required: true,
                message: "Please enter your Employment Status",
              },
            ]}
          >
            <RadioGroup
              options={employOptions}
              defaultValue={currentlyEmployed}
              onChange={(e: any) => setCurrentlyEmployed(e.target.value)}
            />
          </Form.Item>
          {currentlyEmployed === "1" && (
            <>
              <h2>Employment information</h2>
              <div className="form-row">
                <Form.Item
                  name="company"
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
                    className="drawer-input-one"
                    // value={userProfile?.individual?.current_company}
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
                    label="Current position"
                    placeholder="Current position"
                    className="drawer-input-one"
                    // value={userProfile?.individual?.current_position}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="experience"
                label="Years of experience"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current Experience",
                  },
                ]}
              >
                <RadioGroup
                  options={infoOptions}
                  defaultValue={userProfile?.individual?.current_experience}
                />
              </Form.Item>
            </>
          )}

          <h1>General Information</h1>
          <Form.Item
            name="high_level_mission"
            label="Are you assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country?"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <RadioGroup
              options={employOptions}
              defaultValue={
                userProfile?.individual?.high_level_mission == 1 ? "1" : "0"
              }
              // onChange={(e: any) => setCurrentlyEmployed(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="senior_position"
            label="Are you in a senior management position or a job in an international organization?"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <RadioGroup
              defaultValue={
                userProfile?.individual?.senior_position == 1 ? "1" : "0"
              }
              options={employOptions}
            />
          </Form.Item>
          <Form.Item
            name="marriage_relationship"
            label="Do you have a blood or marriage relationship, up to the second degree, with someone who is assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country, or in senior management positions or a job in an international organization?"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <RadioGroup
              defaultValue={
                userProfile?.individual?.marriage_relationship == 1 ? "1" : "0"
              }
              options={employOptions}
            />
          </Form.Item>
          <Divider />

          <Form.Item>
            <div className="drawer-next-container-two">
              <div className="skip" onClick={() => handleSkip()}>
                Skip for now
              </div>
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
