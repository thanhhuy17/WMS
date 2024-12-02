import { Button, Card, message, Modal, Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { CategoryModel } from "../../models/CategoryModel";
import { TreeModel } from "../../models/FormModel";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { ModalCategory } from "../../modals";
import { getTreeValues } from "../../utils/getTreeValues";
import Title from "antd/es/typography/Title";
import { colors } from "../../constants/colors";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Categories = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesTreeModel, setCategoriesTreeModel] = useState<TreeModel[]>(
    []
  );
  const [categorySelected, setCategorySelected] = useState<CategoryModel>();

  // const [forms, setForms] = useState<any>();
  const [isVisibleAddNewCategory, setIsVisibleAddNewCategory] = useState(false);
  const [total, setTotal] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  });

  const { confirm } = Modal;

  const onPageChange = (val: { page: number; pageSize: number }) => {
    setPage(val.page);
    setPageSize(val.pageSize);
  };

  useEffect(() => {
    getCategories(); // gọi hàm get ALL
    getAllCategories();
  }, [page, pageSize]);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  //----------------- GET CATEGORIES ---------------------
  const getCategories = async () => {
    const api = `/product/get-categories?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api); // default = get
      // console.log("Check Get Categories: ", res);
      res?.data?.categories && setCategories(res?.data?.categories);

      // ---- Page, PageSize ----
      const items: CategoryModel[] = [];
      res.data.categories.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + (index + 1),
          ...item,
        })
      );
      setTotal(res.data.total);

      // const data: any =
      //   res.data.categories.length > 0
      //     ? getTreeValues(res.data.categories, "parentId")
      //     : [];
      // setCategoriesTreeModel(data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //----------------- GET ALL CATEGORIES USE TO SELECT PARENT CATEGORY---------------------
  const getAllCategories = async () => {
    const api = `/product/get-categories`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api); // default = get
      // console.log("Check Get All Categories: ", res);
      res?.data?.categories && setCategories(res?.data?.categories);

      const data: any =
        res.data.categories.length > 0
          ? getTreeValues(res.data.categories, "parentId")
          : [];
      setCategoriesTreeModel(data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------- DELETE CATEGORY (Xóa cứng) ----------
  const handleDeletedCategory = async (id: string, isDeleted: boolean) => {
    const api = `/product/delete-category?id=${id}&isDeleted=${isDeleted}`; // isDeleted === true (Xóa luôn)

    // console.log("Lay ID: ", id);
    try {
      const res: any = await handleAPI(api, undefined, "delete");

      // Call back getCategories
      setCategories((categories) =>
        categories.filter(
          (element) => element._id !== id && element.parentId !== id
        )
      );
      // await getCategories();
      message.success(res.message);
    } catch (error: any) {
      message.error(error);
    }
  };

  //------------- COLUMN ---------------
  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      title: "Name",
      // dataIndex: "title",
      dataIndex: "",
      render: (item: CategoryModel) => (
        <Link
          style={{ textDecoration: "none" }}
          to={`/categories/detail/${item.slug}?id=${item._id}`}
        >
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
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
      dataIndex: `createdAt`,
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
      key: "updatedAt",
      title: "Date Edited",
      dataIndex: `updatedAt`,
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
                setIsVisibleAddNewCategory(true);
                setCategorySelected(item);
                console.log("Check select category: ", item);
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Delete Categories" key={"btnDelete"}>
            <Button
              icon={<Trash size={20} className="text-danger" />}
              onClick={(val) =>
                confirm({
                  title: "Confirm",
                  content: `Are you sure want to Delete this Category?`,
                  onOk: () => handleDeletedCategory(item._id, false), // False (Xóa mềm)
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
      <div className="row  mt-4">
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
                      Categories
                    </Title>
                  </div>
                  <div className="col text-end">
                    <Space>
                      <Button
                        icon={<MdOutlineAddToPhotos size={20} />}
                        type="primary"
                        // Show Modal Supplier when to onclick
                        onClick={() => {
                          setCategorySelected(undefined);
                          setIsVisibleAddNewCategory(true);
                        }}
                      >
                        Add New Category
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
              dataSource={categories}
              columns={columns}
              // onChange={(val: any) => console.log(val)}
              loading={isLoading}
              bordered
              pagination={{
                size: "default",
                current: page,
                showQuickJumper: true,
                showSizeChanger: true,
                total: total,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} rows`,
                onShowSizeChange: (current, size) => {
                  setPageInfo({
                    ...pageInfo,
                    pageSize: size,
                  });
                },
                onChange: (page, pageSize) => {
                  // console.log("Check page: ", page, pageSize);
                  setPageInfo({
                    ...pageInfo,
                    page: page,
                    pageSize: pageSize || pageInfo.pageSize,
                  });
                },
              }}
            />
          </Card>
        </div>
      </div>
      <ModalCategory
        visible={isVisibleAddNewCategory}
        onAddNew={async (val) => await getCategories()}
        onClose={() => {
          setIsVisibleAddNewCategory(false);
        }}
        values={categoriesTreeModel}
        category={categorySelected}
      />
    </div>
  );
};

export default Categories;
