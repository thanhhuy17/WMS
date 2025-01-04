import {
  ColorPicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { ProductModel } from "../models/ProductModel";
import { colors } from "../constants/colors";
import handleAPI from "../apis/handleAPI";
import { uploadFile } from "../utils/uploadFile";
import { rgbToHex } from "../utils/rbgToHex";

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
    // console.log(items);
    setFileList(items);
  };

  // ----------- ADD SUB PRODUCT -------------
  const handleAddSubProduct = async (values: any) => {
    if (product) {
      const data: any = { ...values };
      for (const i in values) {
        data[i] = values[i] ?? "";
      }
      data.color = values.color || values.mainColor;
      data.price = values.price ? parseInt(values.price) : 0;
      data.qty = values.qty ? parseInt(values.qty) : 0;
      data.productId = product._id;

      const uploadedImageUrls: string[] = []; // Save Images Before UpLoad
      // Upload từng ảnh trong file list
      for (const item of fileList) {
        if (item.originFileObj) {
          try {
            const imageUrl: string = await uploadFile(item.originFileObj);
            if (imageUrl) {
              uploadedImageUrls.push(imageUrl);
            }
          } catch (error) {
            console.error("False to upload image:", error);
          }
        }
      }

      data.image = uploadedImageUrls;
      console.log("Check data send to Server: ", data);

      const api = `/product/add-sub-product`;
      try {
        setIsLoading(true);
        const res: any = await handleAPI(api, data, "post");

        console.log("Response from Server: ", res);
        message.success(res.message);
        handleClose();
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Need To Product Detail !!!");
    }
  };

  useEffect(() => {
    setColor(colors.mainColor);
    form.setFieldsValue({ color: colors.mainColor });
  }, [form]);

  // --------- HANDLE COLOR --------------
  const [color, setColor] = useState<any>(colors.mainColor);

  const handleChangeComplete = (color: any) => {
    // Extract RGB values
    const { r, g, b } = color.metaColor || color; // Adjust depending on structure
    // Convert to hex
    const hexColor = rgbToHex(r, g, b);
    console.log("Hex Color:", hexColor);

    // Update state and form
    setColor(hexColor);
    form.setFieldsValue({ color: hexColor });
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
          initialValues={{
            color: color, // Set the default color
          }}
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
            rules={[
              {
                required: true,
                message: "Please select a color!",
              },
            ]}
          >
            <ColorPicker
              value={color}
              onChange={handleChangeComplete}
              format="hex" // ĐỊnh dạng hex
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
