import { Avatar, Button, Form, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
// import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import { useSelector } from "react-redux";
import { FormModel } from "../models/FormModel";
import FormItem from "../components/FormItem";
import { ProductModel } from "../models/ProductModel";
import { Dayjs } from "dayjs";
import { UserAdd } from "iconsax-react";
import Paragraph from "antd/es/typography/Paragraph";
import { uploadFile } from "../utils/uploadFile";
import { FcAddImage } from "react-icons/fc";

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
  const [dateExpiry, setDateExpiry] = useState<string | string[]>();
  const [categories, setCategories] = useState<string[]>([]);
  const [form] = Form.useForm<any>();
  const inpRef = useRef<any>();

  //--------------- ADD USER CREATED --------------
  const userCreated = useSelector(
    (state: any) => state.authReducer?.data?.name
  );

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
      console.log("object, ", product);
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

    data.buyingPrice = values.buyingPrice ? parseInt(values.buyingPrice) : 0;
    data.quantity = values.quantity ? parseInt(values.quantity) : 0;
    data.thresholdValue = values.thresholdValue
      ? parseInt(values.thresholdValue)
      : 0;

    // data.expiryDate = dateExpiry ? dayjs(dateExpiry).format("DD-MM-YYY") : '';
    data.expiryDate = dateExpiry;
    data.categories = categories;

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

    data.slug = replaceName(values.productName);
    data.userCreated = userCreated;
    const api = `/product/${
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
    const api = `/product/get-form-product`;
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

  //--------------- HANDLE IS TAKING -----------------
  const handleIsTakingChange = (value: boolean) => {
    setIsTaking(value); // Update isTaking state based on FormItem checkbox
  };

  //--------------- HANDLE EXPIRY DATE  -----------------
  const handleExpiryDateChange = (
    _date: Dayjs | Dayjs[],
    dateString: string | string[]
  ) => {
    setDateExpiry(dateString);
  };
  //--------------- HANDLE CATEGORY  -----------------
  const handleCategories = (category: string[]) => {
    setCategories(category);
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
        {/* <label
          htmlFor="inpFile"
          className="p-2 mb-3 text-center d-flex justify-content-center gap-3"
        >
          {file ? (
            <Avatar size={80} src={URL.createObjectURL(file)} />
          ) : product ? (
            <Avatar size={80} src={product.photoUrl} />
          ) : (
            <Avatar
              size={80}
              style={{
                backgroundColor: "white",
                border: `2px dashed ${colors.gray_100}`,
              }}
            >
              <FcAddImage size={60} color={colors.gray_300} />
            </Avatar>
          )}

          <div>
            <Paragraph className="mb-0">Drag Image here</Paragraph>
            <Paragraph className="mb-0">Or</Paragraph>
            <Button onClick={() => inpRef.current.click()} type="link">
              Browse Image
            </Button>
          </div>
        </label> */}
        {formDynamic && (
          <Form
            disabled={isLoading}
            onFinish={addNewProduct}
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
                onExpiryDateChange={handleExpiryDateChange}
                onCategories={handleCategories}
                product={product}
              ></FormItem>
            ))}
          </Form>
        )}
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

export default ToggleProduct;
