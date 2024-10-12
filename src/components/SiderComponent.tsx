import { Layout, Menu } from "antd";
import { HomeTrendUp } from "iconsax-react";
import { MenuProps } from "rc-menu";
import { Link } from "react-router-dom";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link to={"/"}>Dashboard</Link>,
      itemIcon: <HomeTrendUp size={24} />,
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
