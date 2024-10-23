import { Avatar, Button, Dropdown, Input, MenuProps, Space } from "antd";
// import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
// import { appInfo } from "../constants/appInfos";
import { colors } from "../constants/colors";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../redux/reducers/authReducer";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const HeaderComponent = () => {
  const navigate = useNavigate()
  const user = useSelector(authSelector);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(removeAuth({}));
  };
  
  // console.log("Check Img: ", user);

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      onClick: async () => {
        signOut(auth)
        handleLogout();
        localStorage.clear()
        navigate(`/`)
      },
    },
  ];

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
          {/* <Avatar src={appInfo.myLogo} className="rounded-circle" size={40} /> */}
          <Dropdown menu={{ items }}>
            <Avatar src={user.photoUrl} className="rounded-circle" size={40} />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default HeaderComponent;
