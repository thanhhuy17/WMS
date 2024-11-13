import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Inventories = () => {
  return (
    <div>
      <Button type="primary" >
        <Link to={`/inventory/add-product`} style={{textDecoration: 'none'}} onClick={() => {}}>
          Add Product
        </Link>
      </Button>
    </div>
  );
};

export default Inventories;
