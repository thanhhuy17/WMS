import { Form, Input, message, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import handleAPI from "../apis/handleAPI";
import { replaceName } from "../utils/replaceName";
import { TreeModel } from "../models/FormModel";
import { CategoryModel } from "../models/CategoryModel";
import { AddCategory } from "../components";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
  category?: CategoryModel;
}

const ModalCategory = (props: Props) => {
  const { visible, onClose, onAddNew, values, category } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<any>();

  //-------------- CLOSE TOGGLE ---------------
  const handleClose = () => {
    form.resetFields(); // Reset form về trạng thái ban đầu
    onClose();
  };

  // -------------- SET FORM VALUES ---------------------
  // useEffect(() => {
  //   // console.log("Check Category:", category);
  //   if (category) {
  //     form.setFieldsValue({
  //       parentId: category.parentId || undefined,
  //       title: category.title || "",
  //       description: category.description || "",
  //     });
  //   } else {
  //     form.resetFields(); // Reset khi mở modal thêm mới
  //   }
  // }, [category, form]);

  // //-------------- HANDLE ADD NEW CATEGORY ---------------
  // const handleCategory = async (values: any) => {
  //   setIsLoading(true);
  //   // Get Category and show on Screen

  //   const api = `/product${
  //     category ? `/update-category` : `/category-add-new`
  //   }`;
  //   const data: any = {};

  //   for (const i in values) {
  //     data[i] = values[i] ?? "";
  //   }
  //   data.slug = replaceName(values.title);

  //   try {
  //     const res: any = await handleAPI(api, data, category ? `put` : `post`);
  //     message.success(res.message);
  //     !category && onAddNew(res.data); // Chú Ý
  //     handleClose();
  //     console.log("Check data sent to Server: ", data);
  //     console.log("Check data response : ", res.data);
  //   } catch (error: any) {
  //     message.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <div>
      <Modal
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        okButtonProps={{ loading: isLoading, disabled: isLoading }}
        cancelButtonProps={{ loading: isLoading, disabled: isLoading }}
        closable={!isLoading}
        onOk={() => form.submit()}
        title={
          <span style={{ color: `${colors.mainColor}` }}>
            {category ? `Update Category` : `Add Category`}
          </span>
        }
        okText={category ? "Update" : "Add Category"}
        cancelText="Cancel"
      >
        {/* <Form
          layout="vertical"
          labelAlign="left"
          form={form}
          disabled={isLoading}
          onFinish={handleCategory}
          style={{ color: `${colors.mainColor}` }}
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 18 }}
          colon={false}
        >
          <Form.Item
            name={"parentId"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>
                Parent Category
              </span>
            }
          >
            <TreeSelect treeData={values} allowClear showSearch></TreeSelect>
          </Form.Item>
          <Form.Item
            name={"title"}
            label={<span style={{ color: `${colors.mainColor}` }}>Title</span>}
            rules={[
              {
                required: true,
                message: "Enter category title",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name={"description"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>Description</span>
            }
            rules={[
              {
                required: false,
                message: "Enter category title",
              },
            ]}
          >
            <Input.TextArea rows={4} allowClear />
          </Form.Item>
        </Form> */}
        <AddCategory
          onClose={handleClose}
          visible={visible}
          category={category}
          values={values}
          onAddNew={onAddNew}
        />
      </Modal>
    </div>
  );
};

export default ModalCategory;
