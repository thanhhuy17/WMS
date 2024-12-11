import { Checkbox, DatePicker, Form, Input, Select, TreeSelect } from "antd";
import { colors } from "../constants/colors";
import { FormItemModel, FormModel, SelectModel, TreeModel } from "../models/FormModel";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { SupplierModel } from "../models/SupplierModel";
import { useEffect, useState } from "react";
import { ProductModel } from "../models/ProductModel";
import { Dayjs } from "dayjs";
import unorm from "unorm";

interface Props {
  item: FormItemModel;
  onIsTakingChange: (value: boolean) => void;
  onExpiryDateChange?: (
    _date: Dayjs | Dayjs[],
    dateString: string | string[]
  ) => void;
  onCategories?: (category: string[]) => void;
  supplier?: SupplierModel;
  product?: ProductModel ;
  values?: TreeModel[];
  productsOption?: SelectModel[]
}

const FormItem = (props: Props) => {
  const {
    item,
    onIsTakingChange,
    supplier,
    onExpiryDateChange,
    onCategories,
    values,
    product,
    productsOption,
  } = props;
  const [isTakingSOS, setIsTakingSOS] = useState<boolean>(
    supplier?.isTaking ?? false
  );

  useEffect(() => {
    // Cập nhật trạng thái ban đầu của checkbox khi supplier (Mỗi khi Nhấn Edit mới) thay đổi
    if (supplier) {
      setIsTakingSOS(supplier.isTaking);
    }
  }, [supplier]);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setIsTakingSOS(isChecked);
    onIsTakingChange(isChecked); // Gọi callback để thông báo cho ToggleSupplier
  };

  const renderInput = (item: FormItemModel) => {
    let content = <></>;

    switch (item.type) {
      case "select":
        content =
          item.key === "category" ? (
            <TreeSelect
              treeData={values}
              allowClear
              showSearch // ------------ Lọc theo tiếng việt ------------
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
          ) : (
            <Select
              options={productsOption}
              allowClear
              showSearch
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
            />
          );
        break;
      case "checkbox":
        content = (
          <div>
            <Checkbox
              checked={isTakingSOS}
              onChange={
                handleCheckboxChange // Cập nhật lại trạng thái khi checkbox thay đổi
              }
            >
              {item.label}
            </Checkbox>
          </div>
        );
        break;
      case "dateTime":
        content = (
          <div>
            <DatePicker onChange={onExpiryDateChange}>{item.label}</DatePicker>
          </div>
        );
        break;
      default:
        content = (
          <Input placeholder={item.placeholder} allowClear type={item.type} />
        );
        break;
    }
    return content;
  };

  return (
    <Form.Item
      key={item.key}
      name={item.value}
      rules={[
        {
          required: item.require,
          message: item.message,
        },
      ]}
      label={<span style={{ color: `${colors.mainColor}` }}>{item.label}</span>}
      colon={false}
    >
      {renderInput(item)}
    </Form.Item>
  );
};

export default FormItem;
