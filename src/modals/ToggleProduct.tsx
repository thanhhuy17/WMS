import { Form, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import { useSelector } from "react-redux";
import { FormModel } from "../models/FormModel";
import FormItem from "../components/FormItem";
import { ProductModel } from "../models/ProductModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: ProductModel) => void;
  product?: ProductModel;
  getProducts: () => void;
}

const ToggleProduct = (props: Props) => {
  const { visible, onClose, onAddNew, product, getProducts } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState();
  const [formDynamic, setFormDynamic] = useState<FormModel>();

  const [form] = Form.useForm<any>();
  const inpRef = useRef<any>();

  //Add User Created
  const userCreated = useSelector(
    (state: any) => state.authReducer?.data?.name
  );

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [form, product]);
  // ------ GET FORM WHEN TO START WEB -------
  useEffect(() => {
    getFormProduct();
  }, []);

  // ---------- SEND DATA TO BACKEND (Change Value before push Server) ------------
  const addNewProduct = async (values: any) => {
    setIsLoading(true);
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? parseInt(values.price) : 0;
    data.isTaking = isTaking ? 1 : 0;
    // Add UserEdit and TimeEdit
    if (!product) {
      data.userEdited = undefined;
      data.dateEdited = "";
      data.dateCreated = new Date().toISOString();
    } else {
      data.userEdited = userCreated;
      data.dateEdited = new Date().toISOString();
    }

    if (file) {
      data.photoUrl = await uploadFile(file);
    }

    data.slug = replaceName(values.name);
    data.userCreated = userCreated;
    const api = `/storage/${
      product ? `update-product?id=${product._id}` : `add-new-product`
    }`;
    try {
      const res: any = await handleAPI(api, data, product ? "put" : "post");
      message.success(res.message);
      console.log("Check data Product to Server: ", data);
      console.log("Check response Product from Server: ", res);
      !product && onAddNew(res.data);
      handleClose();
      getProducts();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  //-------------- CLOSE TOGGLE ---------------
  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };
  //-------------- GET FORM PRODUCT ---------------
  const getFormProduct = async () => {
    const api = `/storage/get-form-product`;
    setIsGetting(true);
    try {
      const res: any = await handleAPI(api);
      res.data && setFormDynamic(res.data);
      // console.log("Check Get Form Dynamic: ", res);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsGetting(false);
    }
  };
  //---------------Handle Is Taking -----------------
  const handleIsTakingChange = (value: boolean) => {
    setIsTaking(value); // Update isTaking state based on FormItem checkbox
  };

  //--------------- MAIN LOGIC -----------------
  return (
    <div>
      <Modal
        closable={!isLoading}
        loading={isGetting}
        open={visible}
        onClose={handleClose}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okButtonProps={{ loading: isLoading }}
        title={
          <span style={{ color: `${colors.mainColor}` }}>
            {product ? "Edit Product" : "Add Product"}
          </span>
        }
        okText={product ? "Update" : "Add Product"}
        cancelText="Discard"
      >
        {formDynamic && (
          <Form
            disabled={isLoading}
            onFinish={addNewProduct}
            // layout='vertical'
            layout={formDynamic.layout}
            labelCol={{ span: formDynamic.labelCol }}
            labelAlign={formDynamic.labelAlign}
            wrapperCol={{ span: formDynamic.wrapperCol }}
            size={formDynamic.size}
            form={form}
            style={{ color: `${colors.mainColor}` }}
          >
            {formDynamic.formItems.map((item) => (
              <FormItem
                key={item.key}
                item={item}
                onIsTakingChange={handleIsTakingChange}
                product={product}
              ></FormItem>
            ))}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ToggleProduct;
