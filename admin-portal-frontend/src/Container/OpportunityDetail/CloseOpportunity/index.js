import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Space,
  Table,
  message,
  Select,
} from "antd";
import moment from "moment";
import { installment } from "../../../../src/services/ApiHandler";
import { useNavigate, useParams } from "react-router-dom";
import { commaSeparator, formatNumber } from "../../../utils/Helper";
import { v4 as uuidv4 } from "uuid";
import "./closeOpportunity.scss";
const { TextArea } = Input;
const CloseOpportunity = ({
  setIsModalOpen,
  setLoading,
  totalAmount,
  opportunityDetail,
}) => {
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [installments, setInstallments] = useState([]);
  const [status, setStatus] = useState("");
  const [loan, setLoan] = useState({});

  const [amountLeft, setAmountLeft] = useState(
    parseInt(opportunityDetail?.fund_collected) +
      (parseInt(opportunityDetail?.fund_collected) * (1 / 100) +
        parseInt(opportunityDetail?.fund_collected) *
          (parseInt(opportunityDetail?.annual_roi) / 100))
  );

  const params = useParams();

  const onFinish = (values) => {
    const obj = {
      id: uuidv4(),
      amount: values.amount,
      description: values.description,
      due: moment(values.due).format("YYYY-MM-DD"),
      fees: values.fees,
      interest: values.interest,
      principal: values.principal,
      status: values.status,
      dnaneer_carrying_fee: values.dnaneer_carrying_fee,
      net_repayment: values.net_repayment,
      return: values.return,
    };
    const data = [...installments];
    data.push(obj);
    setStatus(values.status);
    setInstallments(data);
    setAmountLeft(
      amountLeft -
        (parseInt(values.amount) +
          parseInt(values.interest) +
          parseInt(values.principal))
    );
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoading(false);
  };

  const onClickSave = async () => {
    const body = {
      opportunity_id: params?.id,
      status: "closed",
      ...loan,
      installments: installments.map((installment) => ({
        amount: installment.amount,
        due_date: installment.due,
        principal: installment.principal,
        interest: installment.interest,
        fees: installment.fees,
        description: installment.description,
        status: installment.status,
        dnaneer_carrying_fee: parseFloat(installment.dnaneer_carrying_fee),
        net_repayment: parseFloat(installment.net_repayment),
        return: parseFloat(installment.return),
      })),
    };
    try {
      const { data } = await installment(body);
      if (data) {
        message.success(data?.message ?? "Installments Created");
        setLoading(false);
        navigate("/");
      } // Handle the response data as needed
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Monthly Repayment",
      dataIndex: "amount",
    },
    {
      title: "Due Date",
      dataIndex: "due",
    },
    {
      title: "Principal",
      dataIndex: "principal",
    },
    {
      title: "Interest",
      dataIndex: "interest",
    },
    {
      title: "Origination Fees",
      dataIndex: "fees",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Return",
      dataIndex: "return",
    },
    {
      title: "Dnaneer Carrying Fee",
      dataIndex: "dnaneer_carrying_fee",
    },
    {
      title: "Net Repayment",
      dataIndex: "net_repayment",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              const data = installments.filter(
                (installment) => !(installment.id === record.id)
              );
              setAmountLeft(
                parseInt(amountLeft) +
                  parseInt(record.amount) +
                  parseInt(record.principal) +
                  parseInt(record.interest)
              );
              setInstallments(data);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const statusOptions = [
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
  ];
  const initialValues = {
    amount_principal: opportunityDetail?.fund_collected,
    netRoi: opportunityDetail?.net_roi,
    annualRoi: opportunityDetail?.annual_roi,
    annualInterestAmount:
      opportunityDetail?.fund_collected * (opportunityDetail?.annual_roi / 100),
    totalAmountBeforeFees:
      parseInt(
        opportunityDetail?.fund_collected *
          (opportunityDetail?.annual_roi / 100)
      ) + parseInt(opportunityDetail?.fund_collected),
    originalRate: 1,
    originalFee: opportunityDetail?.fund_collected * (1 / 100),
    borrowerToReceive:
      opportunityDetail?.fund_collected -
      opportunityDetail?.fund_collected * (1 / 100),
    loanAmount:
      parseInt(opportunityDetail?.fund_collected) +
      (parseInt(opportunityDetail?.fund_collected) * (1 / 100) +
        parseInt(opportunityDetail?.fund_collected) *
          (parseInt(opportunityDetail?.annual_roi) / 100)),
  };
  const saveLoan = (values) => {
    setLoan({
      principal_amount: values?.amount_principal,
      net_roi: values?.netRoi,
      annual_interest_rate: values?.annualRoi,
      annual_interest_amount: values?.annualInterestAmount,
      total_amount_before_fees: values?.totalAmountBeforeFees,
      origination_rate: values?.originalRate,
      origination_fee: values?.originalFee,
      borrower_to_receive: values?.borrowerToReceive,
      carrying_fee: values?.carryingFee,
      borrower_to_pay: values?.loanAmount,
      tenor: values?.duration,
    });
  };
  return (
    <div>
      <h1>Create Loan</h1>

      <h2>Loan Structure</h2>

      <Form
        name="basic"
        initialValues={initialValues}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelCol={{
          span: 12,
        }}
        wrapperCol={{
          span: 16,
        }}
        labelAlign="left"
        onFinish={saveLoan}
      >
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue, setFieldsValue }) => {
            return (
              <>
                <div className="loan-structure-form">
                  <Row>
                    <Col lg={24}>
                      <Form.Item
                        label={"Principal"}
                        name="amount_principal"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please enter your amount!",
                        //   },
                        //   () => ({
                        //     validator(_, value) {
                        //       if (value <= amountLeft) {
                        //         return Promise.resolve();
                        //       }
                        //       return Promise.reject(
                        //         "Installments amount should not be greater than total opportunity amount!"
                        //       );
                        //     },
                        //   }),
                        // ]}
                      >
                        <InputNumber
                          min={0.1}
                          step={0.1}
                          placeholder="Amount"
                          disabled={true}
                          addonAfter={formatNumber(
                            opportunityDetail?.fund_collected
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={<p>Net ROI</p>}
                        name="netRoi"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Principal!",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Net ROI"
                          style={{ width: "100%" }}
                          min={0.1}
                          step={0.1}
                          addonAfter={"%"}
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={<p>Annual Interest Rate (IR)</p>}
                        name="annualRoi"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Interest!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Annual Interest Rate"
                          onChange={(interest) => {
                            const totalAmount =
                              getFieldValue("amount_principal");
                            const interestAmount =
                              totalAmount * (interest / 100);
                            setFieldsValue({
                              annualInterestAmount: interestAmount,
                              totalAmountBeforeFees:
                                parseInt(totalAmount) +
                                parseInt(interestAmount),
                            });
                          }}
                          addonAfter={"%"}
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={<p>Annual Interest Amount</p>}
                        name="annualInterestAmount"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter your Annual Interest Amount!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%", color: "black" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Annual Interest Amount"
                          disabled={true}
                          type="number"
                          addonAfter={formatNumber(
                            getFieldValue("annualInterestAmount")
                          )}
                        />
                      </Form.Item>
                    </Col>{" "}
                  </Row>
                </div>

                <div className="loan-structure-form">
                  <Row>
                    <Col lg={24}>
                      <Form.Item
                        label={<p>Total Amount before Fees</p>}
                        name="totalAmountBeforeFees"
                        rules={[
                          {
                            required: true,
                            message: "Please select!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0.1}
                          step={0.1}
                          placeholder="Total Amount before Fees"
                          disabled={true}
                          type="number"
                          addonAfter={formatNumber(
                            getFieldValue("totalAmountBeforeFees")
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 140,
                            }}
                          >
                            <p>Origination Rate</p>
                          </div>
                        }
                        name="originalRate"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Origination Rate!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          step={0.1}
                          placeholder="Origination Rate"
                          onChange={(rate) => {
                            console.log("Rate", rate);
                            const totalAmount =
                              getFieldValue("amount_principal");
                            const amount = totalAmount * (rate / 100);
                            const interest = getFieldValue(
                              "annualInterestAmount"
                            );
                            setFieldsValue({
                              originalFee: amount,
                              borrowerToReceive: totalAmount - amount,
                              loanAmount:
                                parseInt(totalAmount) +
                                parseInt(interest) +
                                parseInt(amount),
                            });
                            setAmountLeft(
                              parseInt(totalAmount) +
                                parseInt(interest) +
                                parseInt(amount)
                            );
                          }}
                          addonAfter={"%"}
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 140,
                            }}
                          >
                            <p>Origination Fee</p>
                          </div>
                        }
                        name="originalFee"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Origination Fee",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%", color: "black" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Origination Fee"
                          disabled={true}
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 140,
                            }}
                          >
                            <p>Borrower to receive</p>
                          </div>
                        }
                        name="borrowerToReceive"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Borrower to receive!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%", color: "black" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Borrower to receive"
                          disabled={true}
                          type="number"
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={24}>
                      <Form.Item
                        label="Loan Amount (Borrower to pay)"
                        name="loanAmount"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter your Loan Amount (Borrower to pay)!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%", color: "black" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Loan Amount (Borrower to pay)"
                          disabled={true}
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label="Carrying Fee"
                        name="carryingFee"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Carrying Fee!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0.1}
                          step={0.1}
                          placeholder="Carrying Fee"
                          type="number"
                          addonAfter={"%"}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={24}>
                      <Form.Item
                        label="Tenor (Duration)"
                        name="duration"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Tenor (Duration)",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={1}
                          placeholder="Tenor (Duration)"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      style={{ height: "36px" }}
                      disabled={amountLeft === 0}
                    >
                      Save Loan
                    </Button>
                  </Form.Item>
                </div>
              </>
            );
          }}
        </Form.Item>
        
      </Form>
      <h2>Add Installments</h2>

      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Row gutter={[32, 32]}>
          <Col lg={6}>
            <Form.Item
              label="Monthly Repayment"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please enter your amount!",
                },
                () => ({
                  validator(_, value) {
                    if (
                      value +
                        parseInt(form.getFieldValue("principal") ?? 0) +
                        parseInt(form.getFieldValue("interest") ?? 0) <=
                      amountLeft
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Installments amount should not be greater than total opportunity amount!"
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="Amount"
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              name="due"
              label="Due Date"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker
                showToday
                style={{ width: "100%" }}
                placeholder="Due Date"
                disabledDate={(current) => {
                  return current < moment().startOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              label="Principal"
              name="principal"
              rules={[
                {
                  required: true,
                  message: "Please enter your Principal!",
                },
                () => ({
                  validator(_, value) {
                    if (
                      value +
                        parseInt(form.getFieldValue("amount") ?? 0) +
                        parseInt(form.getFieldValue("interest") ?? 0) <=
                      amountLeft
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Installments amount should not be greater than total opportunity amount!"
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Principal"
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              label="Interest"
              name="interest"
              rules={[
                {
                  required: true,
                  message: "Please enter your Interest!",
                },
                () => ({
                  validator(_, value) {
                    if (
                      value +
                        parseInt(form.getFieldValue("amount") ?? 0) +
                        parseInt(form.getFieldValue("principal") ?? 0) <=
                      amountLeft
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Installments amount should not be greater than total opportunity amount!"
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="Interest"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 32]}>
          <Col lg={6}>
            <Form.Item
              label="Origination Fee"
              name="fees"
              rules={[
                {
                  required: true,
                  message: "Please enter your Fees!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="Fees"
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={6}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please select!",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                // defaultValue={statusOptions[0].value}
                placeholder="Select status"
                // options={statusOptions}
              >
                {statusOptions &&
                  statusOptions.map((status) => (
                    <Option value={status.value}>{status.label} </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              label="Return"
              name="return"
              rules={[
                {
                  required: true,
                  message: "Please enter return value!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="return"
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={6}>
            <Form.Item
              label="Net Repayment"
              name="net_repayment"
              rules={[
                {
                  required: true,
                  message: "Please enter Net Repayment!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="Net Repayment"
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={6}>
            <Form.Item
              label="Dnaneer Carrying Fee"
              name="dnaneer_carrying_fee"
              rules={[
                {
                  required: true,
                  message: "Please enter Dnaneer Carrying Fees!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.1}
                step={0.1}
                placeholder="Dnaneer Carrying Fees"
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter your Description!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="description" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ height: "36px" }}
            disabled={amountLeft === 0}
          >
            Add
          </Button>
        </Form.Item>
      </Form>

      <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
        All Installments
      </h2>
      <p>{`Opportunity Amount: ${commaSeparator(amountLeft?.toString())}`}</p>
      {/* <p>{`Installments Amount: ${totalAmount - amountLeft}`}</p>
      <p>{`Amount left: ${amountLeft}`}</p> */}

      <Table columns={columns} dataSource={installments} pagination={false} />

      <Button
        onClick={() => {
          onClickSave();
          setInstallments([]);
          setIsModalOpen(false);
        }}
        type="primary"
        block
        style={{ height: "36px" }}
        disabled={!(amountLeft === 0)}
      >
        Save
      </Button>
    </div>
  );
};

export default CloseOpportunity;
