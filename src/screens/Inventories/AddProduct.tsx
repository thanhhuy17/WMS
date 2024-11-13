import React, { useEffect, useRef, useState } from "react";
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
  Typography,
} from "antd";
import { colors } from "../../constants/colors";
import handleAPI from "../../apis/handleAPI";
import { SelectModel } from "../../models/FormModel";
import { replaceName } from "../../utils/replaceName";
import { uploadFile } from "../../utils/uploadFile";

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
  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();
  const { Text, Title, Paragraph } = Typography;

  useEffect(() => {
    getData();
  }, []);
  //--------- Get Data Supplier -----------
  const getData = async () => {
    try {
      await getSuppliers();
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
    console.log(content);
  };

  return (
    <div>
      <div className="container">
        <Title level={5} style={{ color: colors.mainColor }}>
          Add New Product
        </Title>
        <Form
          form={form}
          onFinish={handleAddNewProduct}
          layout="vertical"
          size="middle"
        >
          <div className="row">
            <div className="col-8">
              <Form.Item
                name={"productName"}
                label={"Product Name"}
                rules={[
                  {
                    required: true,
                    message: "Please enter product title",
                  },
                ]}
              >
                <Input allowClear maxLength={100} showCount />
              </Form.Item>
              <Form.Item
                name={"description"}
                label={"Description"}
                rules={[
                  {
                    required: false,
                    message: "",
                  },
                ]}
              >
                <Input.TextArea allowClear maxLength={300} showCount rows={4} />
              </Form.Item>
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
              <Card className="mt-3" title="Categories">
                <Form.Item
                  name={"categories"}
                  rules={
                    [
                      // { required: true, message: "Please Select Category" },
                    ]
                  }
                >
                  <Select
                    mode="multiple"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider />
                        {/* Show Modal Add Category */}
                        <Button size="small" type="primary" onClick={() => {}}>
                          Add New
                        </Button>
                      </>
                    )}
                  />
                </Form.Item>
              </Card>
              <Card className="mt-3" title="Suppliers">
                <Form.Item
                  name={"suppliers"}
                  rules={[
                    { required: true, message: "Please Select Supplier" },
                  ]}
                >
                  <Select
                    options={supplierOptions}
                    showSearch={true}
                    filterOption={(input, option) =>
                      replaceName(option?.label ? option.label : "").includes(
                        replaceName(input)
                      )
                    }
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
      </div>
    </div>
  );
};

export default AddProduct;
