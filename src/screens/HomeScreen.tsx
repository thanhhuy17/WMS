// import { Button, message } from "antd";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { authSelector, refreshToken } from "../redux/reducers/authReducer";
// import handleAPI from "../apis/handleAPI";
import { StatisticComponent } from "../components";
import { StatisticModel } from "../models/StatisticModel";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiChart } from "react-icons/gi";
import { TbChartHistogram } from "react-icons/tb";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { BsFillBox2Fill } from "react-icons/bs";
import { GrMapLocation } from "react-icons/gr";
import { BsHandbag } from "react-icons/bs";
import { TbShoppingCartCancel } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";

const HomeScreen = () => {
  const salesData: StatisticModel[] = [
    {
      key: "sales",
      description: "Sales",
      icon: (
        <>
          <GiTakeMyMoney />
        </>
      ),
      color: "#629FF4",
      valueType: "currency",
      value: Math.floor(Math.random() * 100000),
      backgroundColor: "#E8F1FD",
    },
    {
      key: "revenue",
      description: "Revenue",
      icon: (
        <>
          <GiChart />
        </>
      ),
      color: "#817AF3",
      valueType: "currency",
      value: Math.floor(Math.random() * 100000),
      backgroundColor: "#ECEAFF",
    },
    {
      key: "profit",
      description: "Profit",
      icon: (
        <>
          <TbChartHistogram />
        </>
      ),
      color: "#DBA362",
      valueType: "currency",
      value: Math.floor(Math.random() * 100000),
      backgroundColor: "#FFEEDB",
    },
    {
      key: "cost",
      description: "Cost",
      icon: (
        <>
          <RiMoneyRupeeCircleLine />
        </>
      ),
      color: "#58D365",
      valueType: "currency",
      value: Math.floor(Math.random() * 100000),
      backgroundColor: "#EBFFED",
    },
  ];
  const inventoryData: StatisticModel[] = [
    {
      key: "quantityInHand",
      description: "Quantity in Hand",
      icon: (
        <>
          <BsFillBox2Fill />
        </>
      ),
      color: "#DBA362",
      valueType: "number",
      value: Math.floor(Math.random() * 1000),
      backgroundColor: "#FFEEDB",
      type: "vertical",
    },
    {
      key: "toBeReceived",
      description: "To be received",
      icon: (
        <>
          <GrMapLocation />
        </>
      ),
      color: "#817AF3",
      valueType: "number",
      value: Math.floor(Math.random() * 1000),
      backgroundColor: "#ECEAFF",
      type: "vertical",
    },
  ];

  const purchaseData: StatisticModel[] = [
    {
      key: "purchase",
      description: "Purchase",
      icon: (
        <>
          <BsHandbag />
        </>
      ),
      color: "#009ED8",
      valueType: "number",
      value: Math.floor(Math.random() * 100),
      backgroundColor: "#E5F6FD",
      type: "horizontal",
    },
    {
      key: "cost",
      description: "Cost",
      icon: (
        <>
          <RiMoneyRupeeCircleLine />
        </>
      ),
      color: "#58D365",
      valueType: "currency",
      value: Math.floor(Math.random() * 100000),
      backgroundColor: "#EBFFED",
      type: "horizontal",
    },
    {
      key: "cancel",
      description: "Cancel",
      icon: (
        <>
          <TbShoppingCartCancel />
        </>
      ),
      color: "#817AF3",
      valueType: "number",
      value: Math.floor(Math.random() * 10),
      backgroundColor: "#E7E5FF",
      type: "horizontal",
    },
    {
      key: "return",
      description: "Return",
      icon: (
        <>
          <TbChartHistogram />
        </>
      ),
      color: "#DBA362",
      valueType: "currency",
      value: Math.floor(Math.random() * 10000),
      backgroundColor: "#FFEEDB",
      type: "horizontal",
    },
  ];

  const productData: StatisticModel[] = [
    {
      key: "numberOfSuppliers",
      description: "Number of Suppliers",
      icon: (
        <>
          <FaRegUserCircle />
        </>
      ),
      color: "#24B8F1",
      valueType: "number",
      value: Math.floor(Math.random() * 100),
      backgroundColor: "#E5F7FD",
      type: "vertical",
    },
    {
      key: "numberOfCategories",
      description: "Number of Categories",
      icon: (
        <>
          <CiViewList />
        </>
      ),
      color: "#817AF3",
      valueType: "number",
      value: Math.floor(Math.random() * 100),
      backgroundColor: "#ECEAFF",
      type: "vertical",
    },
  ];
  // const auth = useSelector(authSelector);

  // const dispatch = useDispatch();

  // const getProducts = async () => {
  //   const api = `/product`;
  //   try {
  //     const res: any = await handleAPI(api);
  //     // console.log("Check Get Data from Storage: ", res);
  //     message.success(res?.message);
  //   } catch (error: any) {
  //     console.log(error.error);
  //     if (error.error === "jwt expired") {
  //       handleRefreshToken();
  //     }
  //   }
  // };

  // const handleRefreshToken = async () => {
  //   const api = `auth/refresh-token?id=${auth._id}`;
  //   try {
  //     const res: any = await handleAPI(api);
  //     console.log("Check API refresh Token: ", res);
  //     message.warning("Hết thời hạn hiệu lực \n Mời đăng nhập lại");
  //     dispatch(refreshToken(res.data.token));
  //   } catch (error) {
  //     console.log("Timeout Refresh Token: ", error);
  //   }
  // };

  return (
    <div>
      {/* <Button size="large" onClick={getProducts}>
        Get Product
      </Button> */}
      <div className="row align-items-stretch">
        <div className="col-md-8">
          <StatisticComponent data={salesData} title="Sales Overview" />
        </div>
        <div className="col-md-4">
          <StatisticComponent data={inventoryData} title="Inventory Summary" />
        </div>
      </div>

      <div className="row align-items-stretch mt-2">
        <div className="col-md-8">
          <StatisticComponent data={purchaseData} title="Purchase Overview" />
        </div>
        <div className="col-md-4">
          <StatisticComponent data={productData} title="Product Summary" />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
