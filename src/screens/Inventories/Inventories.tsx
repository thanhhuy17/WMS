import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { ProductModel } from "../../models/ProductModel";

const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  // -------- GET ALL PRODUCTS -----------
  const getProducts = async () => {
    const api = `/product?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      console.log("Get Product: ", res);
      res.data && setProducts(res.data.items);
      console.log("Get Products: ", products);
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

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  return (
    <div>
      <Link
        to={`/inventory/add-product`}
        style={{ textDecoration: "none" }}
        // onClick={() => {}}
      >
        Add Product
      </Link>
    </div>
  );
};

export default Inventories;
