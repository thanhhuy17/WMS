import {
  Avatar,
  Button,
  Card,
  message,
  Modal,
  QRCode,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { ProductModel, SubProductModel } from "../../models/ProductModel";
import Table, { ColumnProps } from "antd/es/table";

import { colors } from "../../constants/colors";
import { MdLibraryAdd, MdOutlineAddToPhotos } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import dayjs from "dayjs";
import { Edit2, Trash } from "iconsax-react";
import CategoryComponent from "../../components/CategoryComponent";
import { ModalAddSubProduct } from "../../modals";

const Inventories = () => {
  // const [productSelected, setProductSelected] = useState<any[]>([]); // No use
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  });
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  const navigate = useNavigate();
  // ------------- NAVIGATE ----------------
  const handleOpenFormAddProduct = () => {
    navigate(`/inventory/add-product`);
  };

  const { confirm } = Modal;
  const { Title } = Typography;

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  // ---------------- Pagination-----------------
  const onPageChange = (val: { page: number; pageSize: number }) => {
    setPage(val.page);
    setPageSize(val.pageSize);
  };
  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  // -------- GET ALL PRODUCTS -----------
  const getProducts = async () => {
    const api = `/product?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      // console.log("Get Product1: ", res.data);
      res.data && setProducts(res.data.items);
      // console.log("Get Products2: ", products);
      const items: ProductModel[] = [];
      // console.log("Check Index: ", items);

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

  // -------- GET MIN MAX VALUE PRICE -----------
  const getMinMaxValues: any = (data: SubProductModel[]) => {
    const nums: number[] = [];
    if (data.length > 0) {
      data.forEach((item) => nums.push(item.price));
    }
    return nums.length > 0 && `${Math.min(...nums)} - ${Math.max(...nums)}`;
  };

  // -------- DELETE PRODUCT -----------
  const handleDeletedProduct = async (id: string) => {
    console.log("Id Delete Product: ", id);
    setIsLoading(true);
    try {
      const api = `/product/delete-product?id=${id}`;
      const res: any = await handleAPI(api, undefined, "delete");
      // console.log("Check Delete Response to Server: ", res);
      await getProducts();
      message.success(res.message);
    } catch (error: any) {
      message.error(error.message);
      console.log("Delete Product Error!: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "productName",
      title: "Product Name",
      // dataIndex: "productName",
      dataIndex: "",
      filters: products.map((product) => ({
        text: product.productName,
        value: product.productName,
      })),
      filterSearch: true,
      onFilter: (value: any, record) =>
        record.productName.toLowerCase().includes(value.toLowerCase()),
      render: (item: ProductModel) => (
        <Link
          to={`/inventory/detail/${item.slug}?id=${item._id}`}
          style={{ textDecoration: "none" }}
        >
          {item.productName}
        </Link>
      ),
    },
    {
      key: "qrCode",
      title: "QR Code",
      dataIndex: "_id", // Id Product
      render: (id: string) => (
        // <QRCode size={80} value={`https://whms/product/detail?id=${id}`} />
        <QRCode size={80} value={id} />
      ),
    },

    {
      key: "categories",
      title: "Category",
      dataIndex: "categories", // Fix name
      // render: (text: any, record: ProductModel) => {
      //   const items = record.categories.map((item) => (
      //     <Tag key={item._id}>{item.title}</Tag>
      //   ));
      //   return items;
      // },
      render: (value: any, record: ProductModel) => (
        <Space>
          {record.categories.map((item) => (
            <CategoryComponent id={item._id} />
          ))}
        </Space>
      ),

      filters: [
        ...new Set(
          products.flatMap((item) => item.categories.map((cate) => cate.title))
        ),
      ].map((title) => ({
        text: title,
        value: title,
      })),
      filterSearch: true,
      onFilter: (value: any, record: any) =>
        record.categories.some((category: any) =>
          category.title.toLowerCase().includes(value.toLowerCase())
        ),
    },

    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      filters: products.map((product) => ({
        text: product.description,
        value: product.description,
      })),
      filterSearch: true,
      onFilter: (value: any, record) =>
        record.description.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: "supplier",
      title: "Supplier",
      dataIndex: "suppliers", // Fix name
      render: (text: any, record: ProductModel) => {
        const items = record.suppliers.map((item) => (
          <Tag key={item._id}>{item.name}</Tag>
        ));
        return items;
      },
      filters: [
        ...new Set(
          products.flatMap((item) => item.suppliers.map((supp) => supp.name))
        ),
      ].map((nameSupp) => ({
        text: nameSupp,
        value: nameSupp,
      })),
      filterSearch: true,
      onFilter: (value: any, record: any) =>
        record.suppliers.some((supplier: any) =>
          supplier.name.toLowerCase().includes(value.toLowerCase())
        ),
    },
    {
      key: "photoUrls",
      title: "Image",
      dataIndex: "photoUrls",
      render: (text: any, record: ProductModel) => {
        const urls = record.photoUrls;        
        const img =
          urls &&
          urls.map((url: string, index: number) => (
            <Avatar key={index} src={url} size={40} />
          ));
          // console.log("test img: ", urls)

        return <Avatar.Group className="d-flex flex-row">{img}</Avatar.Group>;
      },
    
      sorter: (a: any, b: any) => {
        return dayjs(a.photoUrls).isBefore(dayjs(b.photoUrls)) ? -1 : 1;
      },
    },
    {
      key: "colors",
      title: "Colors",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) => (
        <Space>
          {items.length > 0 &&
            items.map((item) => (
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: item.color,
                  borderRadius: 12,
                }}
                key={`color${item.color}`}
              />
            ))}
        </Space>
      ),
    },
    {
      key: "sizes",
      title: "Sizes",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) => (
        <Space>
          {items.length > 0 &&
            items.map((item) => (
              <Tag key={`color${item.size}`}>{item.size}</Tag>
            ))}
        </Space>
      ),
    },
    {
      key: "prices",
      title: "Prices",
      dataIndex: "subItems",
      width: 400,
      render: (items: SubProductModel[]) => (
        <Typography.Text>{getMinMaxValues(items)}</Typography.Text>
      ),
    },
    {
      key: "stocks",
      title: "Stocks",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) =>
        items.reduce((a, b) => a + b.qty, 0),
    },
    {
      key: "userCreated",
      title: "User Created",
      dataIndex: `userCreated`,
      render: (userCreated: string) => (userCreated ? userCreated : "-"),
      align: `center`,
      width: `10rem`,
      filters: [...new Set(products.map((item) => item.userCreated))].map(
        (user) => ({
          text: user,
          value: user,
        })
      ),
      filterSearch: true,
      onFilter: (value: any, record) => {
        const userCreated = record.userCreated || "";
        return userCreated.toLowerCase().includes(value.toLowerCase());
      },
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
      sorter: (a: any, b: any) => {
        return dayjs(a.dateCreated).isBefore(dayjs(b.dateCreated)) ? -1 : 1;
      },
    },
    {
      key: "userEdited",
      title: "User Edited",
      dataIndex: `userEdited`,
      render: (userEdited: string) => (userEdited ? userEdited : "-"),
      align: `center`,
      width: `10rem`,
      filters: [...new Set(products.map((item) => item.userEdited))].map(
        (user) => ({
          text: user,
          value: user,
        })
      ),
      filterSearch: true,
      onFilter: (value: any, record) => {
        const userEdited = record.userEdited || "";
        return userEdited.toLowerCase().includes(value.toLowerCase());
      },
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
      sorter: (a: any, b: any) => {
        return dayjs(a.dateEdited).isBefore(dayjs(b.dateEdited)) ? -1 : 1;
      },
    },
    {
      key: "btnContainer",
      title: "Actions",
      dataIndex: "",
      fixed: "right",
      render: (item: any) => (
        <Space>
          <Tooltip title="Add Sub Product" key={"addSubProduct"}>
            <Button
              icon={<MdLibraryAdd size={20} className="text-info" />}
              onClick={() => {
                setProductSelected(item);
                setIsVisibleModalAddSubProduct(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit Categories" key={"btnEdit"}>
            <Button
              icon={<Edit2 size={20} />}
              className="text-info"
              onClick={() => {
                // if (item) {
                //   setProductSelected(item);
                //   console.log("Item selected: ", item);
                // handleOpenFormEditProduct();
                // }
                // console.log("Item selected2: ", productSelected);
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
                  onOk: () => handleDeletedProduct(item._id), // False (Xóa mềm)
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
                        onClick={handleOpenFormAddProduct}
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
              bordered
            ></Table>
          </Card>
        </div>
      </div>
      <ModalAddSubProduct
        visible={isVisibleModalAddSubProduct}
        onClose={() => {
          setIsVisibleModalAddSubProduct(false);
          setProductSelected(undefined);
        }}
        product={productSelected}
        onAddNew={async(val) => 
          //C1: ReCall API GetProducts 
           await getProducts()}
      />
    </div>
  );
};

export default Inventories;
