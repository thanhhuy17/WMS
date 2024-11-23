import { Button, Card, message, Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { CategoryModel } from "../models/CategoryModel";
import { TableComponent } from "../components";
import { FormModel, TreeModel } from "../models/FormModel";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { ModalCategory } from "../modals";
import { getTreeValues } from "../utils/getTreeValues";
import confirm from "antd/es/modal/confirm";

const Categories = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesTreeModel, setCategoriesTreeModel] = useState<TreeModel[]>(
    []
  );

  const [forms, setForms] = useState<any>();
  const [isVisibleAddNewCategory, setIsVisibleAddNewCategory] = useState(false);
  const [total, setTotal] = useState<number>(10);

  useEffect(() => {
    getCategories();
  }, [page, pageSize]);

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
  const handleDeletedCategory = async (id: string) => {
    console.log("Lay ID: ", id);
    try {
      const api = `/product/delete-category?id=${id}`;
      const res: any = await handleAPI(api, undefined, "delete");
      // Call back getCategories
      await getCategories();
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
          <Tooltip title="Edit Categories">
            <Button
              icon={<Edit2 size={20} />}
              className="text-info"
              onClick={() => {
                setIsVisibleAddNewCategory(true);
                // setCategorySelected(item)
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Delete Categories">
            <Button
              icon={<Trash size={20} className="text-danger" />}
              // onChange={() => handleDeletedCategory()}
              onClick={(val) =>
                confirm({
                  title: "Confirm",
                  content: `Are you sure want to Delete this Category?`,
                  onOk: () => handleDeletedCategory(item._id),
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
    // <div className="container-fluid">
    //   <div className="row  text-center">
    //     <div className="col-md-4">Form</div>
    //     <div className="col-md-8">Table</div>
    //   </div>
    // </div>
    <div className="container-fluid">
      {/* <!-- Hàng đầu tiên --> */}
      <div className="row text-center">
        <div className="col-md-12" style={{ height: "30vh" }}>
          Form
        </div>
      </div>
      {/* <!-- Hàng thứ hai --> */}
      <div className="row text-center">
        <div className="col-md-12" style={{ height: "70vh" }}>
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
        onClose={() => setIsVisibleAddNewCategory(false)}
        values={categoriesTreeModel}
      />
    </div>
  );
};

export default Categories;
