import { Avatar, Button, Form, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
import { UserAdd } from "iconsax-react";
import Paragraph from "antd/es/typography/Paragraph";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import { SupplierModel } from "../models/SupplierModel";
import { useSelector } from "react-redux";
import { FormModel, TreeModel } from "../models/FormModel";
import FormItem from "../components/FormItem";
import { getTreeValues } from "../utils/getTreeValues";
// import { ProductModel } from "../models/ProductModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
  getSuppliers?: () => void;
}

const ToggleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier, getSuppliers } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState();
  const [formDynamic, setFormDynamic] = useState<FormModel>();
  const [categories, setCategories] = useState<FormModel>();
  const [categoriesTreeModel, setCategoriesTreeModel] = useState<TreeModel[]>(
    []
  );

  const [form] = Form.useForm<any>();
  const inpRef = useRef<any>();

  //Add User Created
  const userCreated = useSelector(
    (state: any) => state.authReducer?.data?.name
  );

  // console.log("Check User: ", userCreated);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTaking);
    }
  }, [form, supplier, categories]);
  // ------ GET FORM WHEN TO START WEB -------
  useEffect(() => {
    getFormSupplier();
    getAllCategories();
  }, []);

  // ---------- SEND DATA TO BACKEND ------------
  const addNewSupplier = async (values: any) => {
    setIsLoading(true);
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? parseInt(values.price) : 0;
    data.isTaking = isTaking ? 1 : 0;
    // console.log("Check isTaking in ToggleSupplier: ", data.isTaking);
    // Add UserEdit and TimeEdit
    if (!supplier) {
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
    const api = `/supplier/${
      supplier ? `update-supplier?id=${supplier._id}` : `add-new-supplier`
    }`;
    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      message.success(res.message);
      console.log("Check data Supplier to Server: ", data);
      console.log("Check response from Server: ", res);
      !supplier && onAddNew(res.data);
      handleClose();
      getSuppliers?.();
      // getFormSupplier()
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
    setFile(undefined);
    onClose();
  };
  //-------------- GET FORM SUPPLIER ---------------
  const getFormSupplier = async () => {
    const api = `/supplier/get-form-supplier`;
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

  //----------------- GET ALL CATEGORIES USE TO SELECT PARENT CATEGORY---------------------
  const getAllCategories = async () => {
    const api = `/product/get-categories`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api); // default = get
      // console.log("Check Get All Categories: ", res);
      res?.data?.categories && setCategories(res?.data?.categories);

      const data: any =
        res.data.categories.length > 0
          ? getTreeValues(res.data.categories, "parentId")
          : [];
      setCategoriesTreeModel(data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
          ) : supplier ? (
            <Avatar size={80} src={supplier.photoUrl} />
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

          <div>
            <Paragraph className="mb-0">Drag Image here</Paragraph>
            <Paragraph className="mb-0">Or</Paragraph>
            <Button onClick={() => inpRef.current.click()} type="link">
              Browse Image
            </Button>
          </div>
        </label>
        {formDynamic && (
          <Form
            disabled={isLoading}
            onFinish={addNewSupplier}
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
                supplier={supplier}
                values={categoriesTreeModel}
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

export default ToggleSupplier;
