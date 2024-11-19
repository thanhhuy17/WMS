import { Layout, Menu, MenuProps, Typography } from "antd";
import { Link } from "react-router-dom";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { TbHomeStats } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiShippingContainer } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { IoBarChartOutline } from "react-icons/io5";
import { appInfo } from "../constants/appInfos";
import { colors } from "../constants/colors";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { IoPricetagsSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";

const { Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(removeAuth({}));
  };

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
        <Link to={""} style={{ textDecoration: "none" }}>
          Inventory
        </Link>
      ),
      icon: <TfiShoppingCartFull size={20} />,
      children: [
        {
          key: "listProduct",
          label: (
            <Link to={"/inventory"} style={{ textDecoration: "none" }}>
              List Products
            </Link>
          ),
        },
        // {
        //   key: 'addNew',
        //   label: <Link to={'/inventory/add-product'} style={{textDecoration: 'none'}} >Add Product</Link>
        // }
      ],
    },
    {
      key: "categories",
      label: (
        <Link to={"/categories"} style={{ textDecoration: "none" }}>
          Categories
        </Link>
      ),
      icon: <IoPricetagsSharp size={20} />,
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
  const itemsSetting: MenuItem[] = [
    {
      key: "settings",
      label: (
        <Link to={"/settings"} style={{ textDecoration: "none" }}>
          Settings
        </Link>
      ),
      icon: <FiSettings size={20} />,
    },
    {
      key: "logout",
      label: (
        <Link
          to={"/"}
          style={{ textDecoration: "none" }}
          onClick={handleLogout}
        >
          Log Out
        </Link>
      ),
      icon: <IoLogOutOutline size={20} />,
    },
  ];
  return (
    <Sider
      width={250}
      theme="light"
      style={{ height: "100vh" }}
      breakpoint="lg"
      collapsedWidth="80"
    >
      <div className="d-flex mt-2 mb-2 align-items-center justify-content-center p-2 ">
        <img
          className="mx-2"
          width={"50px"}
          height={"50px"}
          src={appInfo.logo}
          alt="imgHome"
        />
        <Text
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: `${colors.mainColor}`,
          }}
        >
          {appInfo.title}
        </Text>
      </div>

      <div>
        <Menu mode="inline" items={items} theme="light" />
      </div>
      {/*  fix */}
      <div className="mt-5">
        <Menu items={itemsSetting} theme="light" />
      </div>
    </Sider>
  );
};

export default SiderComponent;
