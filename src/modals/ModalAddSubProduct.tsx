import {
  ColorPicker,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { ProductModel } from "../models/ProductModel";
import { colors } from "../constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  product?: ProductModel;
}

const ModalAddSubProduct = (props: Props) => {
  const { visible, onClose, product } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleClose = () => {
    form.resetFields();
    onClose();
    setFileList([]);
  };
  // ----------- UPLOAD FILE -----------------
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const items = newFileList.map(
      (item) =>
        item.originFileObj && {
          ...item,
          url: item.originFileObj
            ? URL.createObjectURL(item.originFileObj)
            : "",
          status: "done",
        }
    );
    console.log(items);
    setFileList(items);
  };

  // ----------- ADD SUB PRODUCT -------------
  const handleAddSubProduct = async (values: any) => {
    // try {
    //   setIsLoading(true);
    // } catch (error: any) {
    //   message.error(error.message);
    // } finally {
    //   setIsLoading(false);
    // }
    console.log("Form values:", values); // Kiểm tra xem giá trị đã được truyền đúng chưa
    console.log("Selected Color:", values.color); // In ra màu sắc được chọn
  };

  useEffect(() => {
    form.setFieldValue("color", colors.mainColor);
  }, []);

  // --------- HANDLE COLOR --------------
  const [color, setColor] = useState(colors.mainColor);

  const handleChangeComplete = (color: any) => {
    setColor(color.hex); // Lưu màu dưới dạng hex
    form.setFieldValue("color", color.hex); // Cập nhật giá trị trong form
  };
  // ------------ -MAIN ---------------
  return (
    <div>
      <Modal
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        okButtonProps={{ loading: isLoading, disabled: isLoading }}
        cancelButtonProps={{ loading: isLoading, disabled: isLoading }}
        onOk={() => form.submit()}
        title="Add Sub Product"
      >
        <Typography.Title style={{ color: colors.mainColor }} level={5}>
          {product?.productName}
        </Typography.Title>
        <Form
          layout="vertical"
          onFinish={handleAddSubProduct}
          size="middle"
          form={form}
          disabled={isLoading}
        >
          <Form.Item
            name={"size"}
            label={<span style={{ color: `${colors.mainColor}` }}>Size</span>}
            rules={[
              {
                required: true,
                message: "Enter Size Sub Product",
              },
            ]}
          >
            {/* <Input allowClear /> */}
            <Select
              options={[
                {
                  value: "S",
                  label: "S",
                },
                {
                  value: "M",
                  label: "M",
                },
                {
                  value: "L",
                  label: "L",
                },
                {
                  value: "XL",
                  label: "XL",
                },
                {
                  value: "XXL",
                  label: "XXL",
                },
              ]}
            />
          </Form.Item>

          <div className="row">
            <div className="col">
              <Form.Item
                name={"price"}
                label={
                  <span style={{ color: `${colors.mainColor}` }}>Price</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Enter Price Of Product",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </div>
            <div className="col">
              <Form.Item
                name={"qty"}
                label={
                  <span style={{ color: `${colors.mainColor}` }}>Quantity</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Enter Quantity Of Product",
                  },
                ]}
              >
                <Input type="number" defaultValue={0} />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name={"color"}
            label={<span style={{ color: `${colors.mainColor}` }}>Color</span>}
          >
            <ColorPicker
              value={color}
              onChange={handleChangeComplete}
              format="hex"
            />
          </Form.Item>
        </Form>
        {/* Upload Image */}
        <Upload
          action="/upload"
          name="images"
          listType="picture-card"
          multiple
          accept="image/*"
          fileList={fileList}
          onChange={handleChange}
        >
          Upload Images
        </Upload>
      </Modal>
    </div>
  );
};

export default ModalAddSubProduct;
