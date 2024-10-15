import { Button, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";

import { colors } from "../constants/colors";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useState } from "react";
import ToggleSupplier from "../modals";
import { SupplierModel } from "../models/SupplierModel";

const SupplierScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const { Title } = Typography;
  const columns: ColumnProps<SupplierModel>[] = [];
  return (
    <div>
      <Table
        dataSource={[]}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title style={{ fontSize: "20px", color: `${colors.mainColor}` }}>
                Suppliers
              </Title>
            </div>
            <div className="col text-end">
              <Space>
                <Button
                  icon={<MdOutlineAddToPhotos size={20} />}
                  type="primary"
                  // Show Modal Supplier when to onclick
                  onClick={() => setIsVisibleAddNew(true)}
                >
                  Add Supplier
                </Button>
                <Button icon={<LuFilter size={20} />}>Filters</Button>
                <Button icon={<PiExportLight size={20} />}>Export</Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToggleSupplier
        visible={isVisibleAddNew}
        onClose={() => setIsVisibleAddNew(false)}
        // Add Supplier
        onAddNew={(val) => {
          console.log(val);
        }}
      />
    </div>
  );
};

export default SupplierScreen;
