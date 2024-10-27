import { Avatar, Button, Space, Table, Typography } from "antd";
import { FormModel } from "../models/FormModel";

import { MdOutlineAddToPhotos } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { SupplierModel } from "../models/SupplierModel";
import dayjs from "dayjs";

interface Props {
  forms: FormModel;
  loading?: boolean;
  records: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddNew: () => void;
  scrollHeight: number;
  total: number;
  extraColumn?: (item: any) => void;
}

const { Title, Text } = Typography;

const TableComponent = (props: Props) => {
  const {
    forms,
    loading,
    records,
    onPageChange,
    onAddNew,
    scrollHeight,
    total,
    extraColumn,
  } = props;
  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);

  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  //-------------- ADD TABLE SUPPLIER ------------------
  useEffect(() => {
    if (forms && forms.formItems && forms.formItems.length > 0) {
      const items: any[] = [];
      forms.formItems.forEach((item) =>
        items.push({
          title: item.label,
          key: item.key,
          dataIndex: item.value,
          ellipsis: true,
          //   width: 'auto'

        //   render: (value: any) => {
        //     // console.log("Check isTaking value:", value);
        //     if (item.label === 'Taking Return') {
        //         return (
        //           <Text type={value ? "success" : "danger"}>
        //             {value ? "Taking Return" : "Not Taking Return"}
        //           </Text>
        //         );
        //       }
        //       return value
        //   },
        })
      );
      items.unshift(
        {
          key: "index",
          title: "#",
          dataIndex: "index",
          fixed: "left",
          align: `center`,
          render: (text: any, record: SupplierModel, index: number) =>
            (pageInfo.page - 1) * pageInfo.pageSize + (index + 1),
        },
        {
          key: "avatar",
          title: "Logo",
          dataIndex: "photoUrl",
          fixed: "left",
          align: `center`,
          render: (url: string) => <Avatar src={url} />,
        }
      );
      items.push(
        {
          key: "userCreated",
          title: "User Created",
          dataIndex: `userCreated`,
          render: (userCreated: string) => (userCreated ? userCreated : "-"),
          align: `center`,
          width: `6rem`,
        },
        {
          key: "dateCreated",
          title: "Date Created",
          dataIndex: `createdAt`,
          render: (createdAt: string) => {
            const date = dayjs(createdAt).format("HH:mm:ss DD-MM-YYYY");
            return date;
          },
        }
      );
      if (extraColumn)
        items.push({
          key: "buttonContainer",
          title: "Actions",
          dataIndex: "",
          fixed: "right",
          align: "center",
          render: (item: any) => extraColumn(item),
        });
      setColumns(items);
    }
  }, [forms, pageInfo]);

  return (
    <div>
      <Table
        summary={() => <Table.Summary fixed={"top"} />}
        // scroll={{ y: scrollHeight ? scrollHeight:  `calc(100vh - 300px)` }}
        scroll={{ y: scrollHeight, x: "max-content" }}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            // console.log(current, size);
            setPageInfo({ ...pageInfo, pageSize: size });
            // setPage(current);
          },
          total: total,
          onChange: (page, pageSize) => {
            setPageInfo({
              ...pageInfo,
              page: page,
              pageSize: pageSize || pageInfo.pageSize,
            });
          },
        }}
        loading={loading}
        dataSource={records}
        columns={columns}
        bordered
        title={() => (
          <div className="row">
            <div className="col">
              <Title style={{ fontSize: "20px", color: `${colors.mainColor}` }}>
                {forms.title}
              </Title>
            </div>
            <div className="col text-end">
              <Space>
                <Button
                  icon={<MdOutlineAddToPhotos size={20} />}
                  type="primary"
                  // Show Modal Supplier when to onclick
                  onClick={onAddNew}
                >
                  Add Supplier
                </Button>
                <Button icon={<LuFilter size={20} />}>Filters</Button>
                <Button icon={<PiExportLight size={20} />}>Export</Button>
              </Space>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default TableComponent;
