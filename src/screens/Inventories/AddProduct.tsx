import { useEffect, useRef, useState } from "react";
import unorm from "unorm";
import { Editor } from "@tinymce/tinymce-react";
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

const initContent = {
  title: "",
  description: "",
  supplier: "",
};

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [values, setValues] = useState(initContent);
  const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [isVisibleSupplier, setIsVisibleSupplier] = useState(false);
  const [formDynamic, setFormDynamic] = useState<FormModel>();
  const [categories, setCategories] = useState<TreeModel[]>([]);

  //------------- Supplier Modal ---------------
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();
  const { Title } = Typography;

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
    const content = editorRef.current.getContent();
    console.log("Check handleAddNewProduct: ", content); // IN TinyMCE
  };

  //--------------- Get All Categories ---------------------
  const getCategories = async () => {
    const api = `/product/get-categories`;
    try {
      const res = await handleAPI(api);
      const datas = res.data.categories;
      const data: any =
        datas.length > 0 ? getTreeValues(datas, "parentId") : [];

      setCategories(data);
      // console.log("Check data get Category: ", datas);
    } catch (error: any) {
      message.error(error.message);
    }
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
              {formDynamic.title}
            </Title>
            <Form
              form={form}
              onFinish={handleAddNewProduct}
              layout={formDynamic?.layout}
              size={formDynamic?.size}
            >
              <div className="row">
                <div className="col-8">
                  {formDynamic?.formItems?.map((item) => (
                    <Form.Item
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
                          rows={4}
                        />
                      ) : (
                        <Input allowClear maxLength={100} showCount />
                      )}
                    </Form.Item>
                  ))}

                  <Editor
                    disabled={isLoading}
                    apiKey="w7vw37v1rmgydmiiv9zxlerwmzlucno2kxa1xqbnmqu7cfnh"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={content !== "" ? content : ""}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        // Core editing features
                        "anchor",
                        "autolink",
                        "charmap",
                        "codesample",
                        "emoticons",
                        "image",
                        "link",
                        "lists",
                        "media",
                        "searchreplace",
                        "table",
                        "visualblocks",
                        "wordcount",
                        // Your account includes a free trial of TinyMCE premium features
                        // Try the most popular premium features until Nov 27, 2024:
                        "checklist",
                        "mediaembed",
                        "casechange",
                        "export",
                        "formatpainter",
                        "pageembed",
                        "a11ychecker",
                        "tinymcespellchecker",
                        "permanentpen",
                        "powerpaste",
                        "advtable",
                        "advcode",
                        "editimage",
                        "advtemplate",
                        "ai",
                        "mentions",
                        "tinycomments",
                        "tableofcontents",
                        "footnotes",
                        "mergetags",
                        "autocorrect",
                        "typography",
                        "inlinecss",
                        "markdown",
                        // Early access to document converters
                        "importword",
                        "exportword",
                        "exportpdf",
                      ],
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                      tinycomments_mode: "embedded",
                      tinycomments_author: "Author name",
                      mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                      ],
                      ai_request: (request: any, respondWith: any) =>
                        respondWith.string(() =>
                          Promise.reject("See docs to implement AI Assistant")
                        ),
                      exportpdf_converter_options: {
                        format: "Letter",
                        margin_top: "1in",
                        margin_right: "1in",
                        margin_bottom: "1in",
                        margin_left: "1in",
                      },
                      exportword_converter_options: {
                        document: { size: "Letter" },
                      },
                      importword_converter_options: {
                        formatting: {
                          styles: "inline",
                          resets: "inline",
                          defaults: "inline",
                        },
                      },
                    }}
                    //   initialValue="Welcome to TinyMCE!"
                  />
                </div>
                <div className="col-4">
                  <Card className="mt-4">
                    <Space>
                      <Button onClick={() => {}}>Cancel</Button>
                      <Button type="primary" onClick={() => form.submit()}>
                        Submit
                      </Button>
                    </Space>
                  </Card>
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
                        allowClear
                        showSearch
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
                        { required: true, message: "Please Select Supplier" },
                      ]}
                    >
                      <Select
                        options={supplierOptions}
                        showSearch={true}
                        // filterOption={(input, option) =>
                        //   replaceName(
                        //     option?.label ? option.label : ""
                        //   ).includes(replaceName(input))
                        // }
                        filterOption={(input, option)=>{
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
                  <Card className="mt-4">
                    <Input
                      value={fileUrl}
                      onChange={(val) => setFileUrl(val.target.value)}
                      allowClear
                    />
                    <Input
                      className="mt-3"
                      type="file"
                      accept="image/*"
                      onChange={async (files: any) => {
                        const file = files.target.files[0];
                        if (file) {
                          const downLoadUrl = await uploadFile(file);
                          downLoadUrl && setFileUrl(downLoadUrl);
                        }
                      }}
                      //   allowClear
                    />
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
