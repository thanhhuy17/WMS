import { Button, Card, message, Modal, Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { ProductModel } from "../../models/ProductModel";
import Table, { ColumnProps } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { colors } from "../../constants/colors";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import dayjs from "dayjs";
import { Edit2, Trash } from "iconsax-react";

const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/inventory/add-product`);
  };
  const { confirm } = Modal;

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  // -------- GET ALL PRODUCTS -----------
  const getProducts = async () => {
    const api = `/product?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      console.log("Get Product1: ", res);
      res.data && setProducts(res.data.items);
      // console.log("Get Products2: ", products);
      const items: ProductModel[] = [];
      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + (index + 1),
          ...item,
        })
      );

      setTotal(res.data?.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "productName",
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      key: "categories",
      title: "Category",
      dataIndex: "categories", // Fix name
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "supplier",
      title: "Supplier",
      dataIndex: "suppliers", // Fix name
    },
    {
      key: "userCreated",
      title: "User Created",
      dataIndex: `userCreated`,
      render: (userCreated: string) => (userCreated ? userCreated : "-"),
      align: `center`,
      width: `10rem`,
    },
    {
      key: "dateCreated",
      title: "Date Created",
      dataIndex: `dateCreated`,
      render: (dateCreated: string) => {
        const date = dayjs(dateCreated).format("DD-MM-YYYY HH:mm:ss");
        return date;
      },
      width: `10rem`,
    },
    {
      key: "userEdited",
      title: "User Edited",
      dataIndex: `userEdited`,
      render: (userEdited: string) => (userEdited ? userEdited : "-"),
      align: `center`,
      width: `10rem`,
    },
    {
      key: "dateEdited",
      title: "Date Edited",
      dataIndex: `dateEdited`,
      render: (dateEdited: string) => {
        const date = dayjs(dateEdited).format("DD-MM-YYYY HH:mm:ss");
        return date === "Invalid Date" ? "-" : date;
      },
      align: `center`,
      width: `10rem`,
    },
    {
      key: "btnContainer",
      title: "Actions",
      dataIndex: "",
      fixed: "right",
      render: (item: any) => (
        <Space>
          <Tooltip title="Edit Categories" key={"btnEdit"}>
            <Button
              icon={<Edit2 size={20} />}
              className="text-info"
              onClick={() => {
                // setIsVisibleAddNewCategory(true);
                // setCategorySelected(item);
                // console.log("Check select category: ", item);
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Delete Categories" key={"btnDelete"}>
            <Button
              icon={<Trash size={20} className="text-danger" />}
              onClick={(val) =>
                confirm({
                  title: "Confirm",
                  content: `Are you sure want to Delete this Product?`,
                  // onOk: () => handleDeletedCategory(item._id, false), // False (Xóa mềm)
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return isLoading ? (
    <Spin />
  ) : (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-12">
          <Card>
            <Table
              key={page}
              title={() => (
                <div className="row">
                  <div className="col">
                    <Title
                      style={{ fontSize: "20px", color: `${colors.mainColor}` }}
                    >
                      Products
                    </Title>
                  </div>
                  <div className="col text-end">
                    <Space>
                      <Button
                        icon={<MdOutlineAddToPhotos size={20} />}
                        type="primary"
                        // Show Modal Supplier when to onclick
                        onClick={handleClick}
                      >
                        Add Product
                      </Button>
                      <Button icon={<LuFilter size={20} />}>Filters</Button>
                      <Button
                        icon={<PiExportLight size={20} />}
                        // onClick={() => setIsVisibleModalExport(true)}
                      >
                        Export
                      </Button>
                    </Space>
                  </div>
                </div>
              )}
              size="small"
              dataSource={products}
              columns={columns}
              loading={isLoading}
              pagination={{
                size: "default",
                current: page,
                showQuickJumper: true,
                showSizeChanger: true,
                total: total,
                showTotal: (total, range) =>
                  `${range[0]} - ${range[1]} of ${total} rows`,
                onShowSizeChange: (current, size) => {
                  setPageInfo({
                    ...pageInfo,
                    pageSize: size,
                  });
                },
                onChange: (page, pageSize) => {
                  setPageInfo({
                    ...pageInfo,
                    page: page,
                    pageSize: pageSize || pageInfo.pageSize,
                  });
                },
              }}
            ></Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inventories;
