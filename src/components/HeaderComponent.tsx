import { Avatar, Button, Input, Space } from "antd";
import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { appInfo } from "../constants/appInfos";
import { colors } from "../constants/colors";
import { IoSearchOutline } from "react-icons/io5";

const HeaderComponent = () => {
  return (
    <div className="p-2 row bg-white ">
      <div className="col">
        <Input
          placeholder="`Search product, supplier, order"
          prefix={<IoSearchOutline className="text-muted" size={24} />}
          size="large"
          //   style={{ borderRadius: 100 }}
          style={{ width: "50%" }}
        />
      </div>
      <div className="col text-end">
        <Space>
          <Button
            type="text"
            icon={
              <IoMdNotificationsOutline size={22} color={colors.gray_600} />
            }
          />
          <Avatar src={appInfo.myLogo} className="rounded-circle" size={40} />
        </Space>
      </div>
    </div>
  );
};

export default HeaderComponent;
