import { useEffect, useState } from "react";
import Table from "../../../../Components/Table/Table";
import { Spin, message } from "antd";
import "./transactions.scss";
import { useParams } from "react-router-dom";
import { getTransactionsList } from "../../../../services/ApiHandler";

const Transactions = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState([])

 

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Ref Number",
      dataIndex: "ref_number",
      key: "ref",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "date",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Transaction type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "address",
      render: (text, record) => (
        <div>
          {record.status === "Active" ? (
            <p className="status active-status"> {record.status}</p>
          ) : record.status === "Closed" ? (
            <p className="status closed-status"> {record.status}</p>
          ) : (
            <p className="status coming-status"> {record.status}</p>
          )}
        </div>
      )
    }
  ];


   useEffect(() => {
     (async () => {
       try {
         setLoading(true);
         const { data } = await getTransactionsList(params.id);
         if (data) {
           console.log("getTransactionsList", data.data[0]);
           const user = data.data[0];
           const userTransactions = user[0].transactions;
           console.log("userTransactions", userTransactions);
           setTableData(user[0].transactions);
           message.success("Investor Transactions Fetched");
           // setInvestorsData()
         }
       } catch (error) {
         console.log("err", error.response.data.message);
         message.error(error.response.data.message);
       } finally {
         setLoading(false);
       }
     })();
   }, []);
  return (
    <div className="transactions-container">
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={tableData} />      </Spin>
    </div>
  );
};

export default Transactions;
