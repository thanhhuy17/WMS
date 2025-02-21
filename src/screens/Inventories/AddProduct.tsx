import { useEffect, useRef, useState } from "react";
import unorm from "unorm";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import { colors } from "../../constants/colors";
import handleAPI from "../../apis/handleAPI";
import { FormModel, SelectModel, TreeModel } from "../../models/FormModel";
import { replaceName } from "../../utils/replaceName";
import { uploadFile } from "../../utils/uploadFile";
import { ModalCategory, ToggleSupplier } from "../../modals";
import { Add } from "iconsax-react";
import { SupplierModel } from "../../models/SupplierModel";
import { getTreeValues } from "../../utils/getTreeValues";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ProductModel } from "../../models/ProductModel";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddProduct, setIsAddProduct] = useState(false);

  // const [values, setValues] = useState(initContent);
  const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
  const [fileUrl, setFileUrl] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<string[]>([]); // New
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [isVisibleSupplier, setIsVisibleSupplier] = useState(false);
  const [formDynamic, setFormDynamic] = useState<FormModel>();
  const [categories, setCategories] = useState<TreeModel[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [productDetail, setProductDetail] = useState<ProductModel>();
  // ---------- EDITOR ------------
  const [content, setContent] = useState("");
  var toolbarOptions = [
    ["bold", "italic"],
    // ["link", "blockquote", "code-block", "image"],
    ["link", "blockquote"],
    // [{ list: "ordered" }, { list: "bullet" }],
  ];
  const module = {
    toolbar: toolbarOptions,
  };
  const [searchParams] = useSearchParams();
  const id = searchParams.get(`id`);
  //Add User Created
  const userLogin = useSelector((state: any) => state.authReducer?.data?.name);

  const [form] = Form.useForm();
  const { Title } = Typography;
  useEffect(() => {
    if (id) {
      console.log(id);
      getProductDetail(id);
    }
  }, [id]);
  useEffect(() => {
    getData();
    getFormProduct();
  }, []);



  //--------- GET FORM "ADD NEW PRODUCT" -----------
  const getFormProduct = async () => {
    const api = `/product/get-form-add-new-product`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      // console.log(" check form: ", res);
      res.data && setFormDynamic(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //--------- Get Data Supplier -----------
  const getData = async () => {
    try {
      await getSuppliers();
      await getCategories();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // ---------- Get Product Detail For Edited/Update -------------
  const getProductDetail = async (id: string) => {
    const api = `/product/get-product-detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      console.log("Response to Server: ", res.data);
      res?.data && setProductDetail(res?.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  //---------- Handle Update Product ------------
  // const handleUpdateProduct = async (id: string, values: any) => {

  //   // Start Call API Update
  //   const api = `/product/update-product?id=${id}`;

  //   try {
  //     const res = await handleAPI(api);
  //     console.log("Response from Server for Update Product: ", res.data);
  //   } catch (error: any) {
  //     message.error(error.message);
  //   }
  // };

  //--------- Get All Data Supplier -----------
  const getSuppliers = async () => {
    const api = `/supplier`;
    const res = await handleAPI(api);
    const data = res?.data?.items;
    const options = data.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    // console.log(options);
    setSupplierOptions(options);
  };

  // -------- Add New Product ---------------
  const handleAddNewProduct = async (values: any) => {
    console.log("Values From Add Product :", values);
    // const content = editorRef.current.getContent();
    // console.log("Check handleAddNewProduct: ", content);//

    // ----------------
    const uploadedUrls: string[] = []; // Tạo một mảng để lưu URL đã tải lên
    if (imagesFile && imagesFile.length > 0) {
      for (const file of imagesFile) {
        const downLoadUrl: string = await uploadFile(file);
        if (downLoadUrl) {
          uploadedUrls.push(downLoadUrl); // Thêm URL vào mảng
        }
      }
      console.log("Image", uploadedUrls);
      // setFileUrl(uploadedUrls);
    }
    //-----------------

    const data: any = {};
    for (const i in values) {
      data[`${i}`] = values[i] ?? "";
    }

    data.content = content.replace(/<\/?p>/g, "");
    data.photoUrls = uploadedUrls;
    data.slug = replaceName(values.productName);
    data.userCreated = userLogin;

    // if (!(suppliers && categories)) {
    //   data.userEdited = undefined;
    //   data.dateEdited = "";
    //   data.dateCreated = new Date().toISOString();
    // } else {
    //   data.userEdited = userLogin;
    //   data.dateEdited = new Date().toISOString();
    // }

    console.log("Check data send to server: ", data);

    //----------- POST API ------------
    const api = id
      ? `/product/update-product?id=${id}`
      : `/product/add-new-product`;
    try {
      setIsAddProduct(true);
      const res: any = await handleAPI(api, data, id ? `put` : `post`);
      console.log("Response form server: ", res);

      message.success(res?.message);
      window.history.back();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsAddProduct(false);
    }
  };

  //--------------- Get All Categories ---------------------
  const getCategories = async () => {
    const api = `/product/get-categories`;
    try {
      const res = await handleAPI(api);
      const datas = res.data.categories;
      const data: any =
        datas.length > 0 ? getTreeValues(datas, "parentId") : [];
      // datas.length > 0 ? getTreeValues(datas, true) : [];

      setCategories(data);
      // console.log("Check data get Category: ", datas);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // --------- Handle Input Image Change ------------
  const handleInputImageChange = (event: any) => {
    const files = event.target.files;
    const fileNames = Array.from(files).map((item: any) => item.name);
    console.log("fileNames: ", fileNames);
    setFileUrl(fileNames);
    setImagesFile(files);
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <div className="container">
        {formDynamic && (
          <>
            <Title
              style={{
                color: colors.mainColor,
                fontSize: formDynamic.fontSize,
              }}
            >
              {id ? "Edit Product" : formDynamic.title}
            </Title>
            <Form
              disabled={isAddProduct}
              form={form}
              onFinish={handleAddNewProduct}
              layout={formDynamic?.layout}
              size={formDynamic?.size}
            >
              <div className="row">
                <div className="col-8">
                  {formDynamic?.formItems?.map((item) => (
                    <Form.Item
                      key={item.key}
                      style={{ fontWeight: 500 }}
                      name={item.value}
                      label={
                        <span style={{ color: colors.mainColor, fontSize: 16 }}>
                          {item.label}
                        </span>
                      }
                      rules={[
                        {
                          required: item.require,
                          message: item.message,
                        },
                      ]}
                    >
                      {item.type !== "input" ? (
                        <Input.TextArea
                          allowClear
                          maxLength={300}
                          showCount
                          rows={8}
                          defaultValue={productDetail ? productDetail?.description : ""}
                        />
                      ) : (
                        <Input
                          allowClear
                          maxLength={100}
                          showCount
                          defaultValue={productDetail ? productDetail?.productName : ""}
                        />
                      )}
                    </Form.Item>
                  ))}
                  {/* EDITOR */}
                  <ReactQuill
                    style={{ height: 300 }}
                    theme="snow"
                    value={productDetail ? productDetail?.content : content}
                    // value={(content !== "" ? content : "")}
                    onChange={setContent}
                    modules={module}
                  />
                </div>
                <div className="col-4">
                  <Card
                    className="mt-3"
                    title={
                      <span style={{ color: colors.mainColor }}>
                        Categories
                      </span>
                    }
                  >
                    <Form.Item
                      name={"categories"}
                      rules={
                        [
                          // { required: true, message: "Please Select Category" },
                        ]
                      }
                    >
                      <TreeSelect
                        treeData={categories}
                        multiple
                        allowClear
                        showSearch
                        defaultValue={productDetail ? productDetail?.categories : [""]}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider />
                            {/* Show Modal Add Category */}
                            <Button
                              size="small"
                              type="link"
                              icon={<Add size={20} />}
                              style={{ padding: "-16px 0 16px 0" }}
                              onClick={() => setIsVisibleCategory(true)}
                            >
                              Add New
                            </Button>
                          </>
                        )}
                        // ------------ Lọc theo tiếng anh ------------

                        // filterTreeNode={(input, option) => {
                        //   const title = String(option?.title);
                        //   console.log("input: ", input);
                        //   console.log("label: ", title);
                        //   return title
                        //     .toLowerCase()
                        //     .includes(input.toLowerCase());
                        // }}

                        // ------------ Lọc theo tiếng việt ------------
                        filterTreeNode={(input, option) => {
                          const title = String(option?.title);
                          // Chuẩn hóa chuỗi trước khi so sánh
                          const normalizedInput = unorm
                            .nfkd(input)
                            .replace(/[\u0300-\u036f]/g, "");
                          const normalizedTitle = unorm
                            .nfkd(title)
                            .replace(/[\u0300-\u036f]/g, "");

                          // console.log("normalizedInput: ", normalizedInput);
                          // console.log("normalizedTitle: ", normalizedTitle);

                          // So sánh chuỗi đã chuẩn hóa
                          return normalizedTitle
                            .toLowerCase()
                            .includes(normalizedInput.toLowerCase());
                        }}
                      />
                    </Form.Item>
                  </Card>
                  <Card
                    className="mt-3"
                    title={
                      <span style={{ color: colors.mainColor }}>Suppliers</span>
                    }
                  >
                    <Form.Item
                      name={"suppliers"}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Supplier",
                        },
                      ]}
                    >
                      <Select
                        options={supplierOptions}
                        showSearch={true}
                        defaultValue={productDetail ? productDetail?.suppliers : [""]}
                        // filterOption={(input, option) =>
                        //   replaceName(
                        //     option?.label ? option.label : ""
                        //   ).includes(replaceName(input))
                        // }
                        filterOption={(input, option) => {
                          const label = String(option?.label);
                          // Chuẩn hóa chuỗi trước khi so sánh
                          const normalizedInput = unorm
                            .nfkd(input)
                            .replace(/[\u0300-\u036f]/g, "");
                          const normalizedLabel = unorm
                            .nfkd(label)
                            .replace(/[\u0300-\u036f]/g, "");

                          // console.log("normalizedInput: ", normalizedInput);
                          // console.log("normalizedLabel: ", normalizedLabel);

                          // So sánh chuỗi đã chuẩn hóa
                          return normalizedLabel
                            .toLowerCase()
                            .includes(normalizedInput.toLowerCase());
                        }}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider />
                            {/* Show Modal Add Category */}
                            <Button
                              size="small"
                              type="link"
                              icon={<Add size={20} />}
                              style={{ padding: "-16px 0 16px 0" }}
                              onClick={() => setIsVisibleSupplier(true)}
                            >
                              Add New
                            </Button>
                          </>
                        )}
                      />
                    </Form.Item>
                  </Card>
                  <Card
                    title={
                      <span style={{ color: colors.mainColor }}>Image</span>
                    }
                    className="mt-4"
                  >
                    <Input
                      value={productDetail ? productDetail?.photoUrls : fileUrl}
                      defaultValue={productDetail ? productDetail?.photoUrls : [""]}
                      onChange={(val: any) =>
                        setFileUrl(
                          val.target.value
                            .split(", ")
                            .map((name: string) => name.trim())
                        )
                      }
                      allowClear
                      placeholder="File names"
                    />
                    <Input
                      className="mt-3"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleInputImageChange}
                      //   allowClear
                    />
                  </Card>
                  <Card className="mt-4">
                    <Space>
                      <Button loading={isAddProduct} onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button
                        loading={isAddProduct}
                        type="primary"
                        onClick={() => form.submit()}
                      >
                        {id ? `Update` : `Submit`}
                      </Button>
                    </Space>
                  </Card>
                </div>
              </div>
            </Form>
          </>
        )}
      </div>
      <ModalCategory
        visible={isVisibleCategory}
        onClose={() => setIsVisibleCategory(false)}
        onAddNew={async (val) => await getCategories()}
        values={categories}
      />
      <ToggleSupplier
        visible={isVisibleSupplier}
        onClose={() => setIsVisibleSupplier(false)}
        onAddNew={(newSupplier) => {
          // Thêm trực tiếp vào danh sách hiện tại
          const newOption = { value: newSupplier._id, label: newSupplier.name };
          setSupplierOptions((prevOptions) => [...prevOptions, newOption]);

          // Nếu cần, cập nhật cả danh sách đầy đủ
          setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
        }}
      />
    </div>
  );
};

export default AddProduct;
