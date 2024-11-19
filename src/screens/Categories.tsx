import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { CategoryModel } from "../models/CategoryModel";
import { TableComponent } from "../components";
import { FormModel } from "../models/FormModel";

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
  return ( isLoading ? <Spin/> :
    <div>
     <div className="container">
        <div className="row">
            <div className="col-md-4">Form</div>
            <div className="col-md-8">Table</div>
        </div>
     </div>
    </div>
  );
};

export default Categories;
