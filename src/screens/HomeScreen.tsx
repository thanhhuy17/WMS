import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeAuth({}));
  };

  return (
    <div>
      {/* <button className='btn btn-xl btn-danger'> Enter</button> */}

      <Button onClick={() => handleLogout()}>Logout</Button>
    </div>
  );
};

export default HomeScreen;
