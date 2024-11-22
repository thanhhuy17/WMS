import { Button, Card, message, Space, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { CategoryModel } from "../models/CategoryModel";
import { TableComponent } from "../components";
import { FormModel } from "../models/FormModel";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { BsTrash2 } from "react-icons/bs";

const Categories = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [forms, setForms] = useState<any>();
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [total, setTotal] = useState<number>(10);

  useEffect(() => {
    getCategories();
  }, [page]);

  //----------------- GET CATEGORIES ---------------------
  const getCategories = async () => {
    const api = `/product/get-categories?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      console.log("Check Get Categories: ", res?.data?.categories);
      res?.data?.categories && setCategories(res?.data?.categories);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const api = `product`;

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
            <Button icon={<Edit2 size={20} />} className="text-info"></Button>
          </Tooltip>
          <Tooltip title="Delete Categories">
            <Button icon={<Trash size={20} />} className="text-danger"></Button>
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
            <Table size="small" dataSource={categories} columns={columns} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Categories;
