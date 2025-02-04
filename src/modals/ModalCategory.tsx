import { Form, Input, message, Modal, TreeSelect } from "antd";
import unorm from "unorm";

import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import handleAPI from "../apis/handleAPI";
import { replaceName } from "../utils/replaceName";
import { TreeModel } from "../models/FormModel";
import { CategoryModel } from "../models/CategoryModel";
import { useSelector } from "react-redux";

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

  //Add User Created
  const userLogin = useSelector((state: any) => state.authReducer?.data?.name);

  //-------------- CLOSE TOGGLE ---------------
  const handleClose = () => {
    form.resetFields(); // Reset form về trạng thái ban đầu
    onClose();
  };

  // -------------- SET FORM VALUES ---------------------
  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields(); // Reset khi mở modal thêm mới
    }
  }, [category, form]);

  //-------------- HANDLE ADD NEW CATEGORY - UPDATE CATEGORY ---------------
  const handleCategory = async (values: any) => {
    setIsLoading(true);
    // Get Category and show on Screen

    const api = `/product${
      category ? `/update-category?id=${category._id}` : `/category-add-new`
    }`;
    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.title);
    // --------- ADD EDITED AND CREATED ---------
    data.userCreated = userLogin;
    // data.createdAt = new Date().toISOString()

    if (!category) {
      data.userEdited = undefined;
      data.updatedAt = "";
      data.createdAt = new Date().toISOString();
    } else {
      data.userEdited = userLogin;
      data.updatedAt = new Date().toISOString();
    }

    try {
      const res: any = await handleAPI(api, data, category ? `put` : `post`);
      message.success(res.message);
      // !category && onAddNew(res.data); // Chú Ý
      handleClose();
      onAddNew(res.data);
      // console.log("Check data sent to Server: ", data);
      // console.log("Check data response : ", res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
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
        <Form
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
            <TreeSelect
              treeData={values}
              allowClear
              showSearch // ------------ Lọc theo tiếng việt ------------
              filterTreeNode={(input, option) => {
                const title = String(option?.title);
                // Chuẩn hóa chuỗi trước khi so sánh
                const normalizedInput = unorm
                  .nfkd(input)
                  .replace(/[\u0300-\u036f]/g, "");
                const normalizedTitle = unorm
                  .nfkd(title)
                  .replace(/[\u0300-\u036f]/g, "");

                // console.log("normalizedInput: ", normalizedInput);
                // console.log("normalizedTitle: ", normalizedTitle);

                // So sánh chuỗi đã chuẩn hóa
                return normalizedTitle
                  .toLowerCase()
                  .includes(normalizedInput.toLowerCase());
              }}
            />
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
        </Form>
      </Modal>
    </div>
  );
};

export default ModalCategory;
