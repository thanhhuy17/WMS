import {
  Avatar,
  Button,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
  Pagination,
  Tag,
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
import { useSelector } from "react-redux";
import dayjs from "dayjs";
// import { demoData } from "../data/demoData";
// import { replace } from "react-router-dom";
// import { replaceName } from "../utils/replaceName";
// import { current } from "@reduxjs/toolkit";

<Pagination defaultCurrent={6} total={500} />;
const SupplierScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);

  const { Title, Text } = Typography;
  const { confirm } = Modal;

  //-------------- ADD TABLE SUPPLIER ------------------
  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "index",
      title: "#",
      dataIndex: "index",
      fixed: "left",
      align: `center`,
      render: (text, record, index) => (page - 1) * pageSize + (index + 1),
    },
    {
      key: "avatar",
      title: "Logo",
      dataIndex: "photoUrl",
      render: (url) => <Avatar src={url} />,
      fixed: "left",
    },
    {
      key: "status",
      title: "Status",
      dataIndex: `status`,
      render: (status: string) => (
        <Tag color="green" key={status}>
          {status ?? ""}
        </Tag>
      ),
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
      key: "active",
      title: "On the way",
      dataIndex: "active",
      render: (num) => (num ? num : `-`),
      align: `center`,
      width: `6rem`,
    },
    {
      key: "userCreated",
      title: "User Created",
      dataIndex: `userCreated`,
      render: (userCreated) => (userCreated ? userCreated : "-"),
      align: `center`,
      width: `6rem`,
    },
    {
      key: "dateCreated",
      title: "Date Created",
      dataIndex: `createdAt`,
      render: (createdAt) => {
        const date = dayjs(createdAt).format("HH:mm:ss DD-MM-YYYY");
        return date;
      },
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
              onClick={(val) =>
                confirm({
                  title: "Confirm",
                  content: `Are you sure want to Delete this Supplier?`,
                  onOk: () => handleDeleteSupplier(item._id),
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);
  // ------------- GET SUPPLIERS FROM BACKEND-----------------
  const getSuppliers = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data.items);
      const items: SupplierModel[] = [];
      console.log("Check Index: ", items);

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + (index + 1),
          ...item,
        })
      );
      setTotal(res.data.total);
      // console.log("Check Total Row: ",res);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //  ---------------- SORT DELETE ---------------
  const handleDeleteSupplier = async (id: string) => {
    console.log(id);
    try {
      // Sort Delete (Xoá mềm)
      // await handleAPI(`/supplier/update-supplier?id=${id}`, {isDeleted: true}, 'put')
      // Delete (Xoá cứng)
      const res: any = await handleAPI(
        `/supplier/delete-supplier?id=${id}`,
        undefined,
        "delete"
      );
      message.success(res.message);
      getSuppliers();
    } catch (error) {
      console.log(error);
    }
  };
  //  ---------------- ADD DEMO DATA ---------------
  //   const handleAddDemoData = () => {
  //     /*
  //   {
  //     "name": "VietTiep",
  //     "email": "viettiep@gmail.com",
  //     "product": "Lock 502",
  //     "category": "",
  //     "price": 680000,
  //     "contactNumber": "0379849760",
  //     "active": "2",
  //     "type": "",
  //     "isTaking": 1,
  //     "photoUrl": "https://firebasestorage.googleapis.com/v0/b/whms-81447.appspot.com/o/images%2Fcolor.png?alt=media&token=ae6472ad-1f6e-4964-9aac-1d47aee0e7ea",
  //     "slug": "viettiep"
  // }
  //   */
  //     demoData.forEach(async (item: any) => {
  //       const data = {
  //         name: item.name,
  //         email: "viettiep@gmail.com",
  //         product: "Lock 502",
  //         category: "",
  //         price: Math.floor(Math.random() * 100000),
  //         contactNumber: "0379849760",
  //         active: "2",
  //         type: "",
  //         isTaking: 1,
  //         slug: replaceName(item.title),
  //       };
  //       const api = `/supplier/add-new-supplier`;
  //       try {
  //         await handleAPI(api, data, "post");
  //         console.log("Add Data Demo Done!");
  //       } catch (error: any) {
  //         console.log(error);
  //       }
  //     });
  //   };

  return (
    <div>
      {/* <Button type="default" onClick={handleAddDemoData}>
        Add Demo Data
      </Button> */}
      <Table
        summary={() => <Table.Summary fixed={"top"} />}
        // scroll={{ x: "max-content" }}
        scroll={{ x: "max-content", y: 600 }}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            // console.log(current, size);
            setPageSize(size);
            // setPage(current);
          },
          total: total,
          onChange: (page, pageSize) => {
            // console.log(page, pageSize);
            setPage(page);
            setPageSize(pageSize);
          },
        }}
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
          supplierSelected && getSuppliers();
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
