import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  List,
  message,
  Modal,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { FormModel } from "../models/FormModel";
import { start } from "repl";
import { DateTime } from "../utils/dateTime";
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
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [timeSelected, setTimeSelected] = useState<string>("ranger");
  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  const handleExport = async () => {
    let url = ``;
    // Export Select Date
    if (timeSelected !== "all" && dates.start && dates.end) {
      if (new Date(dates.start).getTime() > new Date(dates.end).getTime()) {
        message.error("Invalid Time");
      } else {
        url = `/${api}/get-export-data/?start=${dates.start}&end=${dates.end}`;
      }
    }
    // Export All
    else {
      url = `/${api}/get-export-data`;
    }
    const data = checkedValues;
    if (Object.keys(data).length > 0) {
      setIsLoading(true);
      try {
        const res = await handleAPI(url, data, 'post');
        console.log("Check Export data: ", res.data);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select 1 key of values");
    }
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
  const handleChangeCheckedValue = (val: string) => {
    const items = [...checkedValues];
    const index = items.findIndex((element) => element === val);
    if (index !== -1) {
      items.slice(index, 1);
    } else {
      items.push(val);
    }
    setCheckedValues(items);
  };
  console.log("Check date: ", dates);
  return (
    <Modal
      loading={isGetting}
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      onOk={handleExport}
      okButtonProps={{
        loading: isGetting,
      }}
      title="Export To Excel"
      width={760}
    >
      <div>
        <Checkbox
          checked={timeSelected === "all"}
          onChange={(val) =>
            setTimeSelected(timeSelected === "all" ? "ranger" : "all")
          }
        >
          Get All
        </Checkbox>
      </div>
      <div className="mt-2">
        <Checkbox
          checked={timeSelected === "ranger"}
          onChange={(val) =>
            setTimeSelected(timeSelected === "all" ? "ranger" : "all")
          }
        >
          Date Ranger
        </Checkbox>
        {timeSelected === "ranger" && (
          <Space>
            <RangePicker
              onChange={
                (_date, dateString) =>
                  setDates(
                    dateString && dateString[0] && dateString[1]
                      ? { start: dateString[0], end: dateString[1] }
                      : { start: "", end: "" }
                  )
                // Case 2
                // setDates({ start: `${DateTime.CalendarDate(dateString[0])}`, end: `${DateTime.CalendarDate(dateString[1])}`})
              }
            />
            {/* <Button type="link">Export All</Button> */}
          </Space>
        )}
      </div>
      <Divider />
      <div className="mt-2">
        <List
          dataSource={forms?.formItems}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checkedValues.includes(item.value)}
                onChange={() => handleChangeCheckedValue(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalExportData;
