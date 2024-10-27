import { Button, message } from "antd";
// import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, refreshToken } from "../redux/reducers/authReducer";
import handleAPI from "../apis/handleAPI";

const HomeScreen = () => {
  const auth = useSelector(authSelector);

  const dispatch = useDispatch();

  const getProducts = async () => {
    const api = `/storage/products`;
    try {
      const res: any = await handleAPI(api);
      // console.log("Check Get Data from Storage: ", res);
      message.success(res?.message);
    } catch (error: any) {
      console.log(error.error);
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  };

  const handleRefreshToken = async () => {
    const api = `auth/refresh-token?id=${auth._id}`;
    try {
      const res :any = await handleAPI(api);
      console.log("Check API refresh Token: ", res);
      message.warning("Hết thời hạn hiệu lực \n Mời đăng nhập lại");
      dispatch(refreshToken(res.data.token));
    } catch (error) {
      console.log("Timeout Refresh Token: ", error);
    }
  };

  return (
    <div>
      <Button size="large" onClick={getProducts}>
        Get Product
      </Button>
    </div>
  );
};

export default HomeScreen;
