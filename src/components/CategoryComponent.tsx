import React, { useEffect, useState } from "react";
import { CategoryModel } from "../models/CategoryModel";
import handleAPI from "../apis/handleAPI";
import { Link } from "react-router-dom";
import { Tag } from "antd";
interface Props {
  id: string;
}
const CategoryComponent = (props: Props) => {
  const { id } = props;
  const [categoryDetail, setCategoryDetail] = useState<CategoryModel>();

  useEffect(() => {
    getCategoryDetail();
  }, [id]);

  const getCategoryDetail = async () => {
    const api = `/product/categories/detail?id=${id}`;

    try {
      const res = await handleAPI(api);
      // console.log("Res from server: ", res);
      res.data && setCategoryDetail(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      <Link to={`/categories/detail/${categoryDetail?.slug}?id=${id}`}>
        <Tag>{categoryDetail?.title}</Tag>
      </Link>
    </div>
  );
};

export default CategoryComponent;
