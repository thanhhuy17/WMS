import {
  Avatar,
  Button,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ColumnProps } from "antd/es/table";

import { colors } from "../constants/colors";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useEffect, useState } from "react";
import ToggleSupplier from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import handleAPI from "../apis/handleAPI";
import { Edit2, UserRemove } from "iconsax-react";

const SupplierScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();

  const { Title, Text } = Typography;
  const {confirm} = Modal
  //-------------- ADD TABLE SUPPLIER ------------------
  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "avatar",
      title: "Logo",
      dataIndex: "photoUrl",
      render: (url) => <Avatar src={url} />,
      fixed: "left",
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
      render: (isTaking: boolean) => (
        <Text type={isTaking ? "success" : "danger"}>
          {isTaking ? "Taking Return" : "Not Taking Return"}
        </Text>
      ),
    },
    {
      key: "onTheWay",
      title: "On the way",
      dataIndex: "",
    },
    {
      key: "buttonContainer",
      title: "Actions",
      dataIndex: "",
      fixed: "right",
      align: "center",
      render: (item: SupplierModel) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<Edit2 size={20} className="text-info" />}
              onClick={() => {
                setSupplierSelected(item);
                setIsVisibleAddNew(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              icon={<UserRemove size={20} className="text-danger" />}
              onClick={(val) => confirm({
                title: 'Confirm',
                content: `Are you sure want to Delete this Supplier?`,
                onOk: ()=> handleDeleteSupplier(item._id),
                
              })}
            />
          </Tooltip>
        </Space>
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

  //  ---------------- SORT DELETE ---------------
  const handleDeleteSupplier = async (id: string)=>{
    console.log(id);
    // Sort Delete
    try {
      await handleAPI(`/supplier/update-supplier?id=${id}`, {isDeleted: true}, 'put')
      getSuppliers()
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Table
        scroll={{ x: "max-content" }}
        // pagination={false}
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
        onClose={() => {
          supplierSelected && getSuppliers()
          setIsVisibleAddNew(false);
          setSupplierSelected(undefined);
        }}
        // Add Supplier
        // Sau khi thêm nhà cung cấp, gọi lại hàm getSuppliers để tải dữ liệu mới
        onAddNew={(val) => setSuppliers([...suppliers, val])}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SupplierScreen;
