
import { InventoryComponent, TableComponent } from "../components";
import { Button, Card } from "antd";
import { message, Modal, Space, Tooltip } from "antd";

import { useEffect, useState } from "react";

import { SupplierModel } from "../models/SupplierModel";
import handleAPI from "../apis/handleAPI";

import { FormModel } from "../models/FormModel";
import { Edit2, UserRemove } from "iconsax-react";
import { ProductModel } from "../models/ProductModel";
import { ToggleProduct } from "../modals";

// import { MdOutlinePlaylistRemove } from "react-icons/md";
// import { ToggleSupplier } from "../modals";

const InventoryScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);

  const [forms, setForms] = useState<FormModel>();

  const { confirm } = Modal;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  //-------------- GET FORM FOR COLS OF TABLE ------------------
  const getData = async () => {
    setIsLoading(true);
    try {
      // await getSuppliers();
      await getForm();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // --------------Gọi dữ liệu Form Modal từ server và đẩy vào mảng setForms để sử dụng ------------------
  const getForm = async () => {
    const api = `/storage/get-form-product`;
    const res = await handleAPI(api);
    console.log("Check get Cols :", res.data);
    res.data && setForms(res.data);
  };

  // ------------- GET SUPPLIERS FROM BACKEND-----------------
  const getProducts = async () => {
    const api = `/storage?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setProducts(res.data.items);
      const items: SupplierModel[] = [];
      // console.log("Check Index: ", items);

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + (index + 1),
          ...item,
        })
      );
      setTotal(res.data.total);
      // console.log("Check Total Row: ",res);
      // console.log(page, pageSize);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //  ---------------- SORT DELETE ---------------
  const handleDeleteSupplier = async (id: string) => {
    // console.log(id);
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
      //Callback getSuppliers
      await getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  const api = "product";
  return (
    <div className="container-figure mt-4">
      {/* Overall Inventory Section */}
      <div className="row">
        <div className="col-12 mb-3">
          <Card>
            <InventoryComponent />
          </Card>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="row">
        <div className="col-12">
          {/* <Card
            title="Products"
            extra={
              <div>
                <Button type="primary" className="me-2">Add Product</Button>
                <Button>Filters</Button>
                <Button className="ms-2">Download all</Button>
              </div>
            }
            className="table-card"
          >
            <InventoryComponent />
          </Card> */}
          {forms && (
            <TableComponent
              api={api}
              forms={forms}
              loading={isLoading}
              records={products}
              onPageChange={(val) => {
                setPage(val.page);
                setPageSize(val.pageSize);
              }}
              onAddNew={() => setIsVisibleAddNew(true)}
              scrollHeight={600}
              total={total}
              // isTaking={isTaking}
              extraColumn={(item) => (
                <Space>
                  <Tooltip title="Edit">
                    <Button
                      icon={<Edit2 size={20} className="text-info" />}
                      onClick={() => {
                        setProductSelected(item);
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
              )}
            />
          )}
          <ToggleProduct
        visible={isVisibleAddNew}
        onClose={() => {
          productSelected && getProducts();
          setIsVisibleAddNew(false);
          setProductSelected(undefined);
        }}
        // Add Supplier
        // Sau khi thêm nhà cung cấp, gọi lại hàm getProduct để tải dữ liệu mới
        onAddNew={(val) => setProducts([...products, val])}
        // product={productSelected}
        product={productSelected}
        getProducts={getProducts}
      />
        </div>
      </div>
    </div>
  );
};

export default InventoryScreen;
