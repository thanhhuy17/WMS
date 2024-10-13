import { Button, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";

import { colors } from "../constants/colors";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { MdOutlineAddToPhotos } from "react-icons/md";

const SupplierScreen = () => {
  const { Title } = Typography;
  const columns: ColumnProps<any>[] = [];
  return (
    <div>
      <Table
        dataSource={[]}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title  style={{fontSize: '20px', color:`${colors.mainColor}`}}>Suppliers</Title>
            </div>
            <div className="col text-end">
              <Space>
                <Button icon={<MdOutlineAddToPhotos size={20}/>} type="primary">Add Supplier</Button>
                <Button icon = {<LuFilter size={20}/>}>Filters</Button>
                <Button icon={<PiExportLight size={20}/>}>Export</Button>
              </Space>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SupplierScreen;
