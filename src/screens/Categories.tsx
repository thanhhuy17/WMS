import { Button, Card, message, Modal, Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { CategoryModel } from "../models/CategoryModel";
import { TreeModel } from "../models/FormModel";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { ModalCategory } from "../modals";
import { getTreeValues } from "../utils/getTreeValues";
import { AddCategory } from "../components";
import { replaceName } from "../utils/replaceName";

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

  const { confirm } = Modal;

  useEffect(() => {
    getCategories();
  }, [page, pageSize]);

  //-------------- HANDLE ADD NEW CATEGORY ---------------
  const handleCategory = async (values: any) => {
    setIsLoading(true);
    // Get Category and show on Screen

    const api = `/product/category-add-new`;

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.title);

    try {
      const res: any = await handleAPI(api, data, `post`);
      message.success(res.message);
      res.data && setCategories(res.data); // Chú Ý
      setIsVisibleAddNewCategory(false);
      console.log("Check data sent to Server: ", data);
      console.log("Check data response : ", res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //----------------- GET CATEGORIES ---------------------
  const getCategories = async () => {
    const api = `/product/get-categories?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api); // default = get
      // console.log("Check Get Categories: ", res?.data?.categories);
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

      const data: any =
        res.data.categories.length > 0
          ? getTreeValues(res.data.categories, "parentId")
          : [];
      setCategoriesTreeModel(data);
      // console.log("Check Total Row: ", res.data.total);
      // console.log(page, pageSize);
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
      dataIndex: "title",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "btnContainer",
      title: "Actions",
      dataIndex: "",
      render: (item: any) => (
        <Space>
          <Tooltip title="Edit Categories" key={"btnEdit"}>
            <Button
              icon={<Edit2 size={20} />}
              className="text-info"
              onClick={() => {
                setIsVisibleAddNewCategory(true);
                setCategorySelected(item);
                // console.log("Check select category: ", categorySelected);
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
      <div className="row text-center">
        <div className="col-md-4">
          <Card title={"Add New Category"}>
            <AddCategory
              visible={isVisibleAddNewCategory}
              onAddNew={async (val) => await getCategories()}
              onClose={() => {
                setIsVisibleAddNewCategory(false);
              }}
              values={categoriesTreeModel}
              // category={categorySelected}
            />
            <span>
              <Button type="primary" >
                {/* {categorySelected ? `Update Category` : `Add Category`} */}
                Add Category
              </Button>
            </span>
          </Card>
        </div>
        <div className="col-md-8">
          <Card>
            <Table
              size="small"
              dataSource={categories}
              columns={columns}
              onChange={(val: any) => console.log(val)}
            />
          </Card>
        </div>
      </div>
      <ModalCategory
        visible={isVisibleAddNewCategory}
        onAddNew={async (val) => await getCategories()}
        onClose={() => {
          setIsVisibleAddNewCategory(false);
          // setCategorySelected(undefined);
        }}
        values={categoriesTreeModel}
        category={categorySelected}
      />
    </div>

    // <div className="container-fluid">
    //   {/* <!-- Hàng đầu tiên --> */}
    //   <div className="row text-center">
    //     <div className="col-md-12" style={{ height: "40vh" }}>
    //       <Card title={"Add New Category"}>
    //         <AddCategory
    //           visible={isVisibleAddNewCategory}
    //           onAddNew={async (val) => await getCategories()}
    //           onClose={() => {
    //             setIsVisibleAddNewCategory(false);
    //             // setCategorySelected(undefined);
    //           }}
    //           values={categoriesTreeModel}
    //           // category={categorySelected}
    //         />
    //       </Card>
    //     </div>
    //   </div>
    //   {/* <!-- Hàng thứ hai --> */}
    //   <div className="row text-center">
    //     <div className="col-md-12" style={{ height: "60vh" }}>
    //       <Card>
    //         <Table
    //           size="small"
    //           dataSource={categories}
    //           columns={columns}
    //           onChange={(val: any) => console.log(val)}
    //         />
    //       </Card>
    //     </div>
    //   </div>
    //   <ModalCategory
    //     visible={isVisibleAddNewCategory}
    //     onAddNew={async (val) => await getCategories()}
    //     onClose={() => {
    //       setIsVisibleAddNewCategory(false);
    //       // setCategorySelected(undefined);
    //     }}
    //     values={categoriesTreeModel}
    //     category={categorySelected}
    //   />
    // </div>
  );
};

export default Categories;
