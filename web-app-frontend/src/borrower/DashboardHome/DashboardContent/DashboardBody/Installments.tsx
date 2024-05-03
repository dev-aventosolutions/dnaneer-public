import { Divider, message } from "antd";
import Heading from "borrower/Components/Heading/Heading";
import Installment from "./Installment";
import { useEffect, useState } from "react";
import { getBorrowerInstallments } from "services/BorrowerApis";

const Installments = ({ classes }) => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInstallments = async () => {
    try {
      setLoading(true);
      const res = await getBorrowerInstallments();
      setInstallments(res?.data?.data?.installments);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };
  useEffect(() => {
    getInstallments();
  }, []);
  return (
    <div>
      <div>
        <Heading heading="My Installments" />
      </div>
      <div className="installment-header">
        <span>Installment</span>
        <span>Amount</span>
        <span>Due Date</span>
        <span>Description</span>
        <span>Status</span>
      </div>
      <Divider />
      <div>
        <Installment installments={installments} classes={classes} />
      </div>
    </div>
  );
};

export default Installments;
