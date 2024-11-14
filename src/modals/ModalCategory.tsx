import { Form, Modal } from "antd";
import React, { useState } from "react";
import { colors } from "../constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ModalCategory = (props: Props) => {
  const { visible, onClose } = props;
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
        <Form form={form}></Form>
      </Modal>
    </div>
  );
};

export default ModalCategory;
