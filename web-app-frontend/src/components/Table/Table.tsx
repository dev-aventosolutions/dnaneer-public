import React from 'react'
import { Table } from "antd"
import "./Table.scss"

interface TableProps {
  style?: React.CSSProperties;
  columns: any;
  dataSource: any;
  header?: any;
}

const AppTable = ({ dataSource, columns ,header=''}: TableProps): JSX.Element => {
  return (
    <Table
      caption={header}
      columns={columns}
      dataSource={dataSource}
      bordered={false}
      pagination={false}
    />
  );
};

export default AppTable;