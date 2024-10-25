import { Checkbox, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { colors } from "../constants/colors";

interface Props {
  item: any;
}

const FormItem = (props: Props) => {
  const [isTaking, setIsTaking] = useState<boolean>();

  const { item } = props;
  console.log("Get Form Item: ", item);
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
      {item.type === `input` ? (
        <Input
          placeholder={item.placeholder}
          allowClear
          type={item.typeInput}
        />
      ) : item.type === `select` ? (
        <Select options={[]} placeholder={item.placeholder} />
      ) : (
        <div>
          <div className="mb-2">
            <Checkbox onChange={() => setIsTaking(false)} checked={!isTaking}>
              Not taking return
            </Checkbox>
          </div>
          <Checkbox onChange={() => setIsTaking(true)} checked={isTaking}>
            Taking return
          </Checkbox>
        </div>
      )}
    </Form.Item>
  );
};

export default FormItem;
