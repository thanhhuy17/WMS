import { Form, Modal } from "antd";
import { useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ModalAddSubProduct = (props: Props) => {
  const { visible, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<any>();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  return (
    <div>
      <Modal
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
      ></Modal>
    </div>
  );
};

export default ModalAddSubProduct;
