import { useEffect, useState } from "react";
import { Form, Divider, Select, Row, Col, message, Spin } from "antd";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import Upload from "borrower/Components/BorrowerUpload/BorrowerUpload";
import FloatSelect from "components/Select/Select";
import { IBANInputHandler } from "utils/Helper";
import { useRecoilState } from "recoil";
import { userProfileAtom } from "store/user";
import { borrowerKycStep } from "services/BorrowerApis";
import { useNavigate } from "react-router-dom";
import { getBankList } from "services/Login";
const { Option } = Select;

type BackProps = {
  onBack: () => void;
};

type Props = BackProps & {
  data: any;
  onSuccess: (data: any) => void;
  handleSkip: (step: string) => void;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
};

function Step2Form({ data, onSuccess, onBack, handleSkip, setCurrent }: Props) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [loading, setLoading] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [form] = Form.useForm();
  let navigate = useNavigate();

  const onFinish = async (values) => {
    if (
      allFiles.length < 12 &&
      data?.borrower_documents_for_single_request?.length < 12
    ) {
      return message.error("Please Upload all Files");
    }
    const body = {
      user_id: userProfile?.user_id,
      step: 2,
      iban: values?.IBAN,
      bank_id: values?.bank,
      files: allFiles,
    };
    const formData = new FormData();
    formData.append("user_id", String(body.user_id));
    formData.append("step", String(body.step));
    formData.append("iban", body.iban);
    formData.append("bank_id", body.bank_id);
    for (let index = 0; index < body.files.length; index++) {
      const { docName, file } = body.files[index];
      const actualFile = file.originFileObj;
      formData.append(
        docName.replace(/ /g, "_"),
        actualFile,
        actualFile.name || `file_${index}`
      );
    }

    try {
      setLoading(true);
      const { data } = await borrowerKycStep(formData);
      if (data) {
        navigate(`/borrower-request/2`);
        setCurrent(2);
        message.success(data.message);
      }
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUpload = (uploadedFiles, action) => {
    if (action === "delete") {
      const filtered = allFiles.filter((file) => {
        return file.docName !== uploadedFiles[0].docName;
      });
      setAllFiles(filtered);
    } else {
      console.log("uploadedFiles", uploadedFiles);
      const existingFileIndex = allFiles?.findIndex((file) => {
        return file?.docName === uploadedFiles[0]?.docName;
      });
      // console.log("existingFileIndex", existingFileIndex);
      if (existingFileIndex !== -1) {
        // If a file with the same docName already exists, replace it
        const updatedFiles = [...allFiles];
        updatedFiles[existingFileIndex] = uploadedFiles[0];
        setAllFiles(updatedFiles);
      } else {
        // If the file doesn't exist, push it to the array
        setAllFiles([...allFiles, ...uploadedFiles]);
      }
    }
    // }
  };
  useEffect(() => {
    fetchBankList();
  }, []);
  const fetchBankList = async () => {
    try {
      const { data } = await getBankList();
      if (data) setBankOptions(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="stepForm-container">
        <h1>Company documents</h1>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{ IBAN: data?.iban ? data?.iban : "SA" }}
        >
          <Row gutter={[32, 32]}>
            <Col lg={12}>
              <Upload
                handleUpload={handleUpload}
                docName="Commercial Registration"
                line={
                  <span>
                    السجل التجاري
                    <br />
                    Commercial Registration
                  </span>
                }
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() === "commercial registration"
                )}
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() === "vat registration certificate"
                )}
                docName="VAT registration certificate"
                line={
                  <span>
                    شهادة ضريبة القيمة المضافة <br />
                    VAT registration certificate
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) => file.type?.toLowerCase() === "gosi certificate"
                )}
                docName="GOSI certificate"
                line={
                  <span>
                    شهادة التامينات الاجتماعية <br />
                    GOSI certificate
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) => file.type.toLowerCase() === "additional documents"
                )}
                docName="Additional documents"
                line={
                  <span>
                    مستندات اضافية <br />
                    Additional documents
                  </span>
                }
              />
            </Col>

            <Col lg={12}>
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) => file.type.toLowerCase() === "article of association"
                )}
                docName="Article of Association"
                line={
                  <span>
                    عقد التأسيس <br />
                    Article of Association
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() === "saudization certificate"
                )}
                docName="Saudization certificate"
                line={
                  <span>
                    شهادة السعودة <br />
                    Saudization certificate
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() ===
                    "chamber of commerce certificate"
                )}
                docName="Chamber of Commerce certificate"
                line={
                  <span>
                    شهادة الغرفة التجارية <br />
                    Chamber of Commerce certificate
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) => file.type.toLowerCase() === "partner agreement"
                )}
                docName="Company authorized person"
                line={
                  <span>
                    المفوض بالتوقيع <br />
                    Company authorized person{" "}
                  </span>
                }
              />
            </Col>
          </Row>
          <h2>Financial Documents</h2>
          <Divider style={{ margin: "0 0 20px 0" }} />

          <Row gutter={[32, 32]}>
            <Col lg={12}>
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() ===
                    "bank statement for the last 12 months"
                )}
                docName="Bank statement for the last 12 months"
                line={
                  <span>
                    كشف حساب بنكي للأشهر الـ 12 الماضية <br />
                    Bank statement for the last 12 months
                  </span>
                }
              />
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() === "bank additional documents"
                )}
                docName="Bank Additional documents"
                line={
                  <span>
                    مستندات اضافية <br />
                    Bank Additional documents{" "}
                  </span>
                }
              />
            </Col>
            <Col lg={12}>
              <Upload
                handleUpload={handleUpload}
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() ===
                    "financial statements for the last fiscal year"
                )}
                docName="Financial statements for the last fiscal year"
                line={
                  <span>
                    البيانات المالية لأخر سنة مالية <br />
                    Financial statements for the last fiscal year
                  </span>
                }
              />
            </Col>

            {/* <div className={classes["uploaed-file-wrapper"]}>
              <div className={classes["uploaded-file-container"]}>
                <div className={classes["uploaded-file-name"]}>
                  <Doc />
                  <span>Article of association.pdf</span>
                </div>
                <div className={classes["delete-file"]}>
                  <Cross />
                </div>
              </div>
            </div> */}
          </Row>

          <h2>Bank Information</h2>
          <Divider style={{ margin: 0 }} />
          <Row style={{ marginTop: "1rem" }}>
            <Col lg={12}>
              <Form.Item
                name="IBAN"
                rules={[
                  {
                    required: true,
                    message: "Please enter your IBAN",
                  },
                  {
                    pattern: /^SA\d{22}$/,
                    message: "Invalid IBAN number",
                  },
                ]}
                getValueFromEvent={IBANInputHandler}
              >
                <Input
                  label="IBAN"
                  className="drawer-input-three"
                  placeholder="IBAN "
                  // className={`drawer-input-two ${classes["bank-input"]}`}
                  maxLength={24}
                />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="bank"
                rules={[
                  {
                    required: true,
                    message: "Please select bank",
                  },
                ]}
              >
                <FloatSelect
                  // style={{ borderRadius: "24px" }}
                  defaultValue={data?.bank_id}
                  label="Select Bank"
                  placeholder="Select Bank"
                  className="drawer-select"
                >
                  {bankOptions?.map((bank, i) => {
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
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Upload
                handleUpload={handleUpload}
                docName="Bank account identification certificate"
                line={
                  <span>
                    شهادة تعريف الحساب البنكي <br />
                    Bank account identification certificate
                  </span>
                }
                initialValues={data?.borrower_documents_for_single_request?.filter(
                  (file) =>
                    file.type.toLowerCase() ===
                    "bank account identification certificate"
                )}
              />
            </Col>
          </Row>

          <Divider style={{ margin: "35px 0 19px 0" }} />
          <div className="drawer-final-container">
            <div className="skip"></div>
            <div className="previous" onClick={() => onBack()}>
              Previous step
            </div>

            <Button
              className="complete-btn"
              htmlType="submit"
              // onClick={() => setCurrent(2)}
              onClick={() => onFinish}
              // onClick={() => message.success("Processing complete!")}
            >
              Complete
            </Button>
          </div>
          {/* <Divider />
        <p className="submit-description" style={{ paddingBottom: "160px" }}>
          <Aggrement />
          By submitting, you agree to theeeeeeeee
          <span> Investment POA agreement</span>
        </p> */}
        </Form>
      </div>
    </Spin>
  );
}

export default Step2Form;
