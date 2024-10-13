import { Button, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  supplier?: any;
}

const ToggleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [form] = Form.useForm();

  // ---------- SEND DATA TO BACKEND ------------
  const addNewSupplier = async (values: Props) => {
    setIsLoading(true);
    try {
      const res: any = await handleAPI(
        "/supplier/add-new-supplier",
        values,
        "post"
      );
      message.success(res.message);
      // dispatch to redux
    } catch (error) {}
  };
  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  return (
    <div>
      <Modal
        // width={720}
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        // title="Add Supplier"
        title={
          <span style={{ color: `${colors.mainColor}` }}>Add Supplier</span>
        }
        okText="Add Supplier"
        cancelText="Discard"
      >
        <Form
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
            name={"buying-price"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>Buying Price</span>
            }
            colon={false}
          >
            <Input placeholder="Enter buying price" allowClear />
          </Form.Item>
          <Form.Item
            name={"contact-number"}
            label={
              <span style={{ color: `${colors.mainColor}` }}>
                Supplier Name
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
            <div className="mb-2">
              <Button
                onClick={() => setIsTaking(false)}
                type={isTaking === false ? "primary" : "default"}
              >
                Not taking return
              </Button>
            </div>
            <Button
              onClick={() => setIsTaking(true)}
              type={isTaking ? "primary" : "default"}
            >
              Taking return
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ToggleSupplier;
