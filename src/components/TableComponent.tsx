import { Avatar, Button, Space, Table, Tag, Typography } from "antd";
import { FormModel } from "../models/FormModel";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { LuFilter } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { SupplierModel } from "../models/SupplierModel";
import dayjs from "dayjs";
import { Resizable } from "re-resizable";
import { ModalExportData } from "../modals";
import { ProductModel } from "../models/ProductModel";

interface Props {
  forms: FormModel;
  loading?: boolean;
  records: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddNew: () => void;
  scrollHeight: number;
  total: number;
  extraColumn?: (item: any) => void;
  api: string;
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
    api,
  } = props;
  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);

  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  });

  const [isVisibleModalExport, setIsVisibleModalExport] = useState(false);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);


  // ------------------------------------
  const renderFilterAll =  records.map((item: any) => ({
    text: item.name,
    value: item.name,
  }))

  //-------------- ADD TABLE SUPPLIER ------------------
  useEffect(() => {
    // console.log("Check Records: ", forms.formItems);
    if (forms && forms.formItems && forms.formItems.length > 0) {
      const items: any[] = [];
      forms.formItems.map((item) =>
        items.push({
          key: item.key,
          title: item.label,
          dataIndex: item.value,
          ellipsis: true,
          width: item.displayLength,
          align: `${item.key !== "productName" ? "center" : "left"}`,

          render: (text: any, record: SupplierModel & ProductModel) => {
            // console.log("check record: ", record.product)
            if (item.key === "type") {
              return (
                <Text type={record.isTaking ? "success" : "danger"}>
                  {record.isTaking ? "Taking Return" : "Not Taking Return"}
                </Text>
              );
            }
            if (item.key === "category") {
              const items = record.category.map((item) => (
                <Text key={item._id}>{item.title}</Text>
              ));
              return items;
            }
            if (item.key === "product") {
              // Kiểm tra nếu product là mảng
              if (Array.isArray(record.product)) {
                // Nếu là mảng, dùng map để render từng sản phẩm
                const items = record.product.map((product) => (
                  <Text key={product._id}>{product.productName}</Text>
                ));
                return items;
              }
              // else {
              //   // Nếu chỉ có một sản phẩm duy nhất
              //   return <Text key={record.product._id}>{record.product.productName}</Text>;
              // }
            }
            if (item.key === "expiryDate") {
              const date = dayjs(record.expiryDate).format("DD-MM-YYYY");
              return <Text>{date}</Text>;
            }
            return text;
          },

          // filters: renderFilterAll,
          // filterSearch: true,
          // onFilter: (value: any, record: any) =>
          //   record.name.toLowerCase().includes(value.toLowerCase()),
        })
      );

      if (forms.title === `Supplier`) {
        items.unshift({
          key: "avatar",
          title: "Logo",
          dataIndex: "photoUrl",
          fixed: "left",
          align: `center`,
          render: (url: string, index: number) => (
            <Avatar key={index} src={url} />
          ),
        });
      }
      items.unshift({
        key: "status",
        title: "Status",
        dataIndex: `status`,
        render: (status: string) => (
          <Tag color="green" key={status}>
            {status ?? ""}
          </Tag>
        ),
        fixed: "left",
        // width: "8rem",
        align: "center",
      });

      items.unshift({
        key: "index",
        title: "#",
        dataIndex: "index",
        fixed: "left",
        align: `center`,
        render: (text: any, record: SupplierModel, index: number) =>
          (pageInfo.page - 1) * pageInfo.pageSize + (index + 1),
      });
      items.push(
        {
          key: "userCreated",
          title: "User Created",
          dataIndex: `userCreated`,
          render: (userCreated: string) => (userCreated ? userCreated : "-"),
          align: `center`,
          width: `10rem`,
          filters: [...new Set(records.map((item) => item.userCreated))].map(
            (user) => ({
              text: user,
              value: user,
            })
          ),
          filterSearch: true,
          onFilter: (value: any, record: any) =>
            record.userCreated.toLowerCase().includes(value.toLowerCase()),
        },
        {
          key: "dateCreated",
          title: "Date Created",
          dataIndex: `dateCreated`,
          render: (dateCreated: string) => {
            const date = dayjs(dateCreated).format("DD-MM-YYYY HH:mm:ss");
            return date.replace("00:02:17 28-10-2024", "-");
          },
          width: `10rem`,
          sorter: (a: any, b: any) => {
            // Sử dụng dayjs để chuyển đổi thành đối tượng ngày
            return dayjs(a.dateCreated).isBefore(dayjs(b.dateCreated)) ? -1 : 1;
          },
        },
        {
          key: "userEdited",
          title: "User Edited",
          dataIndex: `userEdited`,
          render: (userEdited: string) => (userEdited ? userEdited : "-"),
          align: `center`,
          width: `10rem`,
          filters: [...new Set(records.map((item) => item.userEdited))].map(
            (user) => ({
              text: user,
              value: user,
            })
          ),
          filterSearch: true,
          onFilter: (value: any, record: any) =>
            record.userEdited.toLowerCase().includes(value.toLowerCase()),
        },
        {
          key: "dateEdited",
          title: "Date Edited",
          dataIndex: `dateEdited`,
          render: (dateEdited: string) => {
            const date = dayjs(dateEdited).format("DD-MM-YYYY HH:mm:ss");
            // return  (date === '23:24:20 27-10-2024')? '-': date;
            return date === "Invalid Date"
              ? "-"
              : date.replace("00:02:17 28-10-2024", "-");
          },
          align: `center`,
          width: `10rem`,
          sorter: (a: any, b: any) => {
            // Sử dụng dayjs để chuyển đổi thành đối tượng ngày
            return dayjs(a.dateEdited).isBefore(dayjs(b.dateEdited)) ? -1 : 1;
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
          width: "8rem",
          render: (item: any) => extraColumn(item),
        });
      setColumns(items);
    }
  }, [forms, pageInfo]);

  //--------- RESIZE TABLE ---------------
  const RenderTitle = (props: any) => {
    const { children, ...restProps } = props;
    return (
      <th style={{ padding: "0 8px", cursor: "col-resize" }} {...restProps}>
        <Resizable
          enable={{
            top: false,
            right: true, // Allow only right-side resizing
            bottom: false,
            left: false,
          }}
          onResizeStop={(_e, _direction, _ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );
            if (item) {
              const items = [...columns];
              const index = columns.findIndex(
                (element) => element.key === item.key
              );
              if (index !== -1) {
                items[index] = {
                  ...item,
                  width: (item.width as number) + d.width,
                };
              }
              setColumns(items);
            }
          }}
        >
          <div>{children}</div>
        </Resizable>
      </th>
    );
  };

  //---------- HANDLE EXPORT EXCEL --------------
  // const handleExportExcel = async () => {
  //   console.log("Check data excel: ", records);
  //   const ws = utils.json_to_sheet(records);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, `data`);
  //   writeFileXLSX(wb, `suppliers_list.xlsx`);
  // };
  return (
    <div>
      <Table
        tableLayout="fixed"
        summary={() => <Table.Summary fixed={"top"} />}
        // scroll={{ y: scrollHeight ? scrollHeight:  `calc(100vh - 300px)` }}
        scroll={{ y: scrollHeight, x: "max-content" }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageInfo({ ...pageInfo, pageSize: size });
          },
          total: total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} rows`,
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
                  {forms.nameButton}
                </Button>
                <Button icon={<LuFilter size={20} />}>Filters</Button>
                <Button
                  icon={<PiExportLight size={20} />}
                  onClick={() => setIsVisibleModalExport(true)}
                >
                  Export
                </Button>
              </Space>
            </div>
          </div>
        )}
        // components={{
        //   header: {
        //     cell: RenderTitle,
        //   },
        // }}
      />
      <ModalExportData
        api={api}
        onClose={() => setIsVisibleModalExport(false)}
        visible={isVisibleModalExport}
        name={api}
      ></ModalExportData>
    </div>
  );
};

export default TableComponent;
