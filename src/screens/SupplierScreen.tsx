import { Avatar, Button, message, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";

import { colors } from "../constants/colors";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useEffect, useState } from "react";
import ToggleSupplier from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import handleAPI from "../apis/handleAPI";

const SupplierScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { Title } = Typography;
  //-------------- ADD TABLE SUPPLIER ------------------
  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "avatar",
      title: "Logo",
      dataIndex: "photoUrl",
      render: (url) => <Avatar src={url} />,
    },
    {
      key: "nameSupplier",
      title: "Supplier Name",
      dataIndex: "name",
    },
    {
      key: "product",
      title: "Product",
      dataIndex: "product",
    },
    {
      key: "contact",
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "isTaking",
      title: "Type",
      dataIndex: `isTaking`,
      render: (isTaking: number) => (
        <span
          style={{
            color: isTaking === 1 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {isTaking === 1 ? "Taking Return" : "Not Taking Return"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, []);
  // ------------- GET SUPPLIERS FROM BACKEND-----------------
  const getSuppliers = async () => {
    const api = "/supplier";
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={suppliers}
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
        // onAddNew={(val) => {
        //   console.log(val);
        // }}
        onAddNew={async () => {
          try {
            // Sau khi thêm nhà cung cấp, gọi lại hàm getSuppliers để tải dữ liệu mới
            await getSuppliers();
            console.log("Loading Page Suppliers Success");
            // message.success("Thêm nhà cung cấp thành công!");
          } catch (error: any) {
            message.error("Cập nhật danh sách thất bại: " + error.message);
          }
        }}
      />
    </div>
  );
};

export default SupplierScreen;
