import { Form, Input, message, Modal, TreeSelect } from "antd";
import { useState } from "react";
import { colors } from "../constants/colors";
import handleAPI from "../apis/handleAPI";
import { replaceName } from "../utils/replaceName";
import { TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
}

const ModalCategory = (props: Props) => {
  const { visible, onClose, onAddNew, values } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<any>();

  //-------------- CLOSE TOGGLE ---------------
  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  //-------------- HANDLE CATEGORY ---------------
  const handleCategory = async (values: any) => {
    setIsLoading(true);
    const api = `/product/category-add-new`;
    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.title);

    try {
      const res: any = await handleAPI(api, data, `post`);
      message.success(res.message);
      onAddNew(res.data);
      handleClose();
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
          <span style={{ color: `${colors.mainColor}` }}>Add Category</span>
        }
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
        </Form>
      </Modal>
    </div>
  );
};

export default ModalCategory;
