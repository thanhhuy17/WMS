import { Button, Checkbox, DatePicker, List, Modal, Space } from "antd";
import React, { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { FormModel } from "../models/FormModel";
interface Props {
  visible: boolean;
  onClose: () => void;
  api: string;
  name?: string;
}

const { RangePicker } = DatePicker;

const ModalExportData = (props: Props) => {
  const { visible, onClose, api, name } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [forms, getForms] = useState<FormModel>();
  const [checkedValues, setCheckedValues] = useState<string[]>([])
  const handleExport = async () => {
    console.log("Checked Values: ",checkedValues);
  };

  // ------- GET FROM MODAL --------
  useEffect(() => {
    if (visible) {
      getForm();
    }
  }, [visible, api]);

  const getForm = async () => {
    const apiForm = `/${api}/get-form-supplier`;
    setIsGetting(true);
    try {
      const res = await handleAPI(apiForm);
      res.data && getForms(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };
// ------------- Get value of List Table Supplier -------------
  const handleChangeCheckedValue = (val:string)=>{
    const items= [...checkedValues]  
    const index = items.findIndex(element=> element === val)
    if(index !== -1){
        items.slice(index, 1)
    }
    else{
        items.push(val)
    }
    setCheckedValues(items)
  }

  return (
    <Modal
      loading={isGetting}
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      onOk={handleExport}
      okButtonProps={{
        loading: isLoading,
      }}
      title="Export To Excel"
      width={760}
    >
      {/* <div>
        <Space>
          <RangePicker
            // onChange={(val) => (val)}
          />
          <Button type="link">Export All</Button>
        </Space>
      </div> */}
      <div className="mt-2">
        <List dataSource={forms?.formItems} renderItem={(item)=> <List.Item key={item.key}>
            <Checkbox checked={checkedValues.includes(item.value)} onChange={()=>handleChangeCheckedValue(item.value)}>{item.label}</Checkbox>
        </List.Item>}/>
      </div>
    </Modal>
  );
};

export default ModalExportData;
