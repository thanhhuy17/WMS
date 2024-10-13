import { Form, message, Modal } from "antd";
import React, { useState } from "react";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  supplier?: any;
}

const ToggleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
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

  return (
    <div>
      <Modal
        title="Add Supplier"
        okText="Add Supplier"
        cancelText="Discard"
      ></Modal>
    </div>
  );
};

export default ToggleSupplier;
