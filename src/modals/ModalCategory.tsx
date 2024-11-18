import { Form, Modal } from "antd";
import React, { useState } from "react";
import { colors } from "../constants/colors";
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
    onClose();
  };
  return (
    <div>
      <Modal
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        okButtonProps={{ loading: isLoading }}
        title={
          <span style={{ color: `${colors.mainColor}` }}>Add Category</span>
        }
      >
        <Form form={form} layout="vertical"></Form>
      </Modal>
    </div>
  );
};

export default ModalCategory;
