import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Col, Collapse, Row, Spin, Table, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  getBorrowerList,
  getSingleBorrower,
} from "../../../services/ApiHandler";
const { Panel } = Collapse;
const BorrowersDetail = ({
  label,
  visible,
  handleCancel,
  handleOk,
  flag,
  id,
}) => {
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        try {
          const { data } = await getSingleBorrower(id);
          if (data) {
            console.log("getInvestorsList---->", data?.data?.[0]);
            setDetail(data?.data?.[0]);
          }
        } catch (error) {
          console.log("err", error.response?.data.message);
          message.error(error.response?.data.message);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [flag]);
  return (
    <Modal
      className="logout-modal"
      open={visible}
      onCancel={handleCancel}
      centered
      width={1200}
      closeIcon={<CloseOutlined />}
      footer={false}
      // footer={[
      //     <div style={{ display: "flex", justifyContent: "flex-end" }}>
      //         <Button
      //             style={{
      //                 margin: "0 15px",
      //                 width: "200px",
      //                 cursor: "pointer",
      //                 backgroundColor: "#3AC318",
      //                 color: "white",
      //                 borderRadius: "30px",
      //             }}
      //             onClick={handleOk}
      //         >
      //             Approve
      //         </Button>
      //         <Button
      //             style={{
      //                 margin: "0 15px",
      //                 width: "200px",
      //                 cursor: "pointer",
      //                 backgroundColor: "#fff",
      //                 color: "#FA3131",
      //                 border: "1px solid rgba(138,133,149,.2)",
      //                 borderRadius: "30px",
      //             }}
      //             onClick={handleCancel}
      //         >
      //             Reject
      //         </Button>
      //     </div>,
      // ]}
    >
      <Spin spinning={loading}>
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            color: "#5b2cd3",
          }}
        >
          {label}
        </h1>
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Panel header="Basic Information" key="1">
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <Col lg={5} sm={12}>
                <h4>Name</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.name ? detail?.name : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Email</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.email ? detail?.email : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Phone</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.phone_number ? detail?.phone_number : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>CR Number</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.cr_number ? detail?.cr_number : "-"}
                </p>
              </Col>
            </Row>
          </Panel>
          <Panel header="Bank Details" key="2">
            <Row
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <Col lg={5} sm={12}>
                <h4>IBAN</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.personal_iban_number ? detail?.personal_iban_number : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Bank Name</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.bank_name ? detail?.bank_name : "-"}
                </p>
              </Col>
              <Col lg={5} sm={12}>
                <h4>Dnaneer Acc#</h4>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {detail?.dnaneer_account_no ? detail?.dnaneer_account_no : "-"}
                </p>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Spin>
    </Modal>
  );
};

export default BorrowersDetail;
