import { Button, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";
import handleAPI from "../apis/handleAPI";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    dispatch(removeAuth({}));
  };

  const getProducts = async () => {
    const api = `/storage/products`;
    // console.log(object);
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      console.log("Check Get Data from Storage: ", res);
      if(res.data){
        message.success(res.message)
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* <button className='btn btn-xl btn-danger'> Enter</button> */}

      <Button onClick={() => handleLogout()}>Logout</Button>
      <Button size="large" onClick={getProducts}>
        Get Product
      </Button>
    </div>
  );
};

export default HomeScreen;
