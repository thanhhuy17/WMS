import { Avatar, Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
import { UserAdd } from "iconsax-react";
import Paragraph from "antd/es/typography/Paragraph";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import { SupplierModel } from "../models/SupplierModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
}

const ToggleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState();
  const [form] = Form.useForm<any>();
  const inpRef = useRef<any>();

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
    }
  }, [supplier]);

  // ---------- SEND DATA TO BACKEND ------------
  const addNewSupplier = async (values: any) => {
    setIsLoading(true);
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.buyingPrice ? parseInt(values.buyingPrice) : 0;

    data.isTaking = isTaking ? 1 : 0;

    if (file) {
      data.photoUrl = await uploadFile(file);
    }

    data.slug = replaceName(values.name);
    const api = "/supplier/add-new-supplier";
    try {
      const res: any = await handleAPI(api, data, "post");
      message.success(res.message);
      console.log("Check data Supplier to Server: ", data);
      console.log("Check response from Server: ", res);
      onAddNew(res.data);
      handleClose();
      // dispatch to redux
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  //-------------- CLOSE TOGGLE ---------------
  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  return (
    <div>
      <Modal
        closable={!isLoading}
        // loading={isLoading}
        // width={720}
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okButtonProps={{ loading: isLoading }}
        title={
          <span style={{ color: `${colors.mainColor}` }}>
            {supplier ? "Edit Supplier" : "Add Supplier"}
          </span>
        }
        okText={supplier ? "Update" : "Add Supplier"}
        cancelText="Discard"
      >
        <label
          htmlFor="inpFile"
          className="p-2 mb-3 text-center d-flex justify-content-center gap-3"
        >
          {file ? (
            <Avatar size={80} src={URL.createObjectURL(file)} />
          ) : (
            <Avatar
              size={80}
              style={{
                backgroundColor: "white",
                border: `2px dashed ${colors.gray_100}`,
              }}
            >
              <UserAdd size={60} color={colors.gray_300} />
            </Avatar>
          )}

          <div className="">
            <Paragraph className="mb-0">Drag Image here</Paragraph>
            <Paragraph className="mb-0">Or</Paragraph>
            <Button onClick={() => inpRef.current.click()} type="link">
              Browse Image
            </Button>
          </div>
        </label>
        <Form
          disabled={isLoading}
          onFinish={addNewSupplier}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          size="middle"
          form={form}
          style={{ color: `${colors.mainColor}` }}
        >
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: "Please Enter Supplier Name!",
              },
            ]}
            label={
              <span style={{ color: `${colors.mainColor}` }}>
                Supplier Name
              </span>
            }
            colon={false}
          >
            <Input placeholder="Enter Supplier Name" allowClear />
          </Form.Item>
          <Form.Item
            name={"email"}
            rules={[
              {
                required: true,
                message: "Please Enter Email!",
              },
            ]}
            label={<span style={{ color: `${colors.mainColor}` }}>Email</span>}
            colon={false}
          >
            <Input placeholder="Enter Supplier Email" allowClear />
          </Form.Item>
          <Form.Item
            name={"product"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>Product</span>
            }
            colon={false}
          >
            <Input placeholder="Enter Product" allowClear />
          </Form.Item>
          <Form.Item
            name={"category"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>Category</span>
            }
            colon={false}
          >
            <Select options={[]} placeholder="Select product category" />
          </Form.Item>
          <Form.Item
            name={"buyingPrice"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>Buying Price</span>
            }
            colon={false}
          >
            <Input placeholder="Enter buying price" allowClear />
          </Form.Item>
          <Form.Item
            name={"contactNumber"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>
                Contact Number
              </span>
            }
            colon={false}
          >
            <Input placeholder="Enter supplier contact number" allowClear />
          </Form.Item>
          <Form.Item
            name={"type"}
            label={<span style={{ color: `${colors.mainColor}` }}>Type</span>}
            colon={false}
          >
            <div>
              <div className="mb-2">
                <Button
                  size="small"
                  onClick={() => setIsTaking(false)}
                  type={isTaking === false ? "primary" : "default"}
                >
                  Not taking return
                </Button>
              </div>
              <Button
                size="small"
                onClick={() => setIsTaking(true)}
                type={isTaking ? "primary" : "default"}
              >
                Taking return
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div className="d-none">
          <input
            accept="image/*"
            ref={inpRef}
            type="file"
            name=""
            id="inpFile"
            onChange={(val: any) => {
              const selectedFile = val.target.files[0];
              if (selectedFile) {
                setFile(selectedFile);
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ToggleSupplier;