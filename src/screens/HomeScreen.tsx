import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {};

  return (
    <div>
      {/* <button className='btn btn-xl btn-danger'> Enter</button> */}

      <Button>Logout</Button>
    </div>
  );
};

export default HomeScreen;
