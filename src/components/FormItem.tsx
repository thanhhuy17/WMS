import { Checkbox, DatePicker, Form, Input, Select } from "antd";
import { colors } from "../constants/colors";
import { FormItemModel } from "../models/FormModel";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { SupplierModel } from "../models/SupplierModel";
import { useEffect, useState } from "react";
import { ProductModel } from "../models/ProductModel";
import { Dayjs } from "dayjs";

interface Props {
  item: FormItemModel;
  onIsTakingChange: (value: boolean) => void;
  onExpiryDateChange?: (_date: Dayjs | Dayjs[], dateString: string | string[]) => void;
  supplier?: SupplierModel;
  product?: ProductModel;
}

const FormItem = (props: Props) => {
  const { item, onIsTakingChange, onExpiryDateChange, supplier, product } = props;
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

  // ----------- Handle Expiry Date --------------
  // const handleExpiryDateChange = (
  //   _date: Dayjs | Dayjs[],
  //   dateString: string | string[]
  // ) => {
  //   onExpiryDateChange(dateString);
  //   console.log("Check dateExpiry FormItem: ", dateString);
  // };

  const renderInput = (item: FormItemModel) => {
    let content = <></>;

    switch (item.type) {
      case "select":
        content = (
          <Select
            // options={item.lockup_item ?? []}
            options={[
              { label: <span>Consumables</span>, value: "Consumables" },
              { label: <span>Electric</span>, value: "Electric" },
              { label: <span>Asset</span>, value: "Asset" },
            ]}
            placeholder={item.placeholder}
            // defaultValue={''}
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
