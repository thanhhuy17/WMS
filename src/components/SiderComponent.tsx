import { Layout, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { TbHomeStats } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiShippingContainer } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { IoBarChartOutline } from "react-icons/io5";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: (
        <Link to={"/"} style={{ textDecoration: "none" }}>
          Dashboard
        </Link>
      ),
      icon: <TbHomeStats size={20} />,
    },
    {
      key: "inventory",
      label: (
        <Link to={"/inventory"} style={{ textDecoration: "none" }}>
          Inventory
        </Link>
      ),
      icon: <TfiShoppingCartFull size={20} />,
    },
    {
      key: "reports",
      label: (
        <Link to={"/reports"} style={{ textDecoration: "none" }}>
          Reports
        </Link>
      ),
      icon: <IoBarChartOutline size={20} />,
    },
    {
      key: "suppliers",
      label: (
        <Link to={"/suppliers"} style={{ textDecoration: "none" }}>
          Suppliers
        </Link>
      ),
      icon: <FaRegCircleUser size={20} />,
    },
    {
      key: "orders",
      label: (
        <Link to={"/orders"} style={{ textDecoration: "none" }}>
          Orders
        </Link>
      ),
      icon: <PiShippingContainer size={20} />,
    },
    {
      key: "manageStore",
      label: (
        <Link to={"/manage-store"} style={{ textDecoration: "none" }}>
          Manage Store
        </Link>
      ),
      icon: <CgNotes size={20} />,
    },
  ];
  return (
    <Sider theme="light">
      WHMS
      <Menu items={items} theme="light" />
    </Sider>
  );
};

export default SiderComponent;
