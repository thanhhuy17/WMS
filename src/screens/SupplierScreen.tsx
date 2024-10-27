import { Button, message, Modal, Space, Tooltip } from "antd";

import { useEffect, useState } from "react";
import ToggleSupplier from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import handleAPI from "../apis/handleAPI";

import { FormModel } from "../models/FormModel";
import { TableComponent } from "../components";
import { Edit2, UserRemove } from "iconsax-react";

const SupplierScreen = () => {
  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);

  const [forms, setForms] = useState<FormModel>();

  const { confirm } = Modal;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  // useEffect(() => {
  //   if (forms && forms.formItems && forms.formItems.length > 0) {
  //     const items: any[] = [];
  //     forms.formItems.forEach((item) =>
  //       items.push({
  //         title: item.label,
  //         key: item.key,
  //         dataIndex: item.value,
  //       })
  //     );
  //     items.unshift({
  //       key: "index",
  //       title: "#",
  //       dataIndex: ("index"),
  //       fixed: "left",
  //       align: `center`,
  //       render: (text: any, record: SupplierModel, index: any) =>
  //         (page - 1) * pageSize + (index + 1)
  //     });
  //     setColumns(items);
  //   }
  // }, [forms]);
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
  // --------------Gọi dữ liệu từ server và đẩy vào mảng setForms để sử dụng ------------------
  const getForm = async () => {
    const api = `/supplier/get-form-supplier`;
    const res = await handleAPI(api);
    // console.log("Check get Cols :", res.data);
    res.data && setForms(res.data);
  };

  // ------------- GET SUPPLIERS FROM BACKEND-----------------
  const getSuppliers = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data.items);
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
      await getSuppliers();
    } catch (error) {
      console.log(error);
    }
  };
  //  ---------------- ADD DEMO DATA ---------------
  //   const handleAddDemoData = () => {
  //     /*
  //   {
  //     "name": "VietTiep",
  //     "email": "viettiep@gmail.com",
  //     "product": "Lock 502",
  //     "category": "",
  //     "price": 680000,
  //     "contactNumber": "0379849760",
  //     "active": "2",
  //     "type": "",
  //     "isTaking": 1,
  //     "photoUrl": "https://firebasestorage.googleapis.com/v0/b/whms-81447.appspot.com/o/images%2Fcolor.png?alt=media&token=ae6472ad-1f6e-4964-9aac-1d47aee0e7ea",
  //     "slug": "viettiep"
  // }
  //   */
  //     demoData.forEach(async (item: any) => {
  //       const data = {
  //         name: item.name,
  //         email: "viettiep@gmail.com",
  //         product: "Lock 502",
  //         category: "",
  //         price: Math.floor(Math.random() * 100000),
  //         contactNumber: "0379849760",
  //         active: "2",
  //         type: "",
  //         isTaking: 1,
  //         slug: replaceName(item.title),
  //       };
  //       const api = `/supplier/add-new-supplier`;
  //       try {
  //         await handleAPI(api, data, "post");
  //         console.log("Add Data Demo Done!");
  //       } catch (error: any) {
  //         console.log(error);
  //       }
  //     });
  //   };

  return (
    <div>
      {forms && (
        <TableComponent
          forms={forms}
          loading={isLoading}
          records={suppliers}
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
                    setSupplierSelected(item);
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

      <ToggleSupplier
        visible={isVisibleAddNew}
        onClose={() => {
          supplierSelected && getSuppliers();
          setIsVisibleAddNew(false);
          setSupplierSelected(undefined);
        }}
        // Add Supplier
        // Sau khi thêm nhà cung cấp, gọi lại hàm getSuppliers để tải dữ liệu mới
        onAddNew={(val) => setSuppliers([...suppliers, val])}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SupplierScreen;
