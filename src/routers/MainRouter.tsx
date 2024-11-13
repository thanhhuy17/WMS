// import SiderComponent from "@/components/SiderComponent";
// import HomeScreen from "@/screens/HomeScreen";

import { Affix, Layout } from "antd";

import HomeScreen from "../screens/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  InventoryScreen,
  ManageScreen,
  OrderScreen,
  ReportScreen,
  SettingScreen,
  SupplierScreen,
} from "../screens";
import { HeaderComponent, SiderComponent } from "../components";
import Inventories from "../screens/Inventories/Inventories";
import AddProduct from "../screens/Inventories/AddProduct";
// Chia Layout
const { Footer, Content } = Layout;
const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="mt-2 mb-2 container-fluid ">
            {/* <Content className="mt-3 mb-3 container-figure "> */}
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route>
                <Route path="/inventory" element={<Inventories />} />
                <Route
                  path="/inventory/add-product"
                  element={<AddProduct />}
                />
              </Route>

              <Route path="/reports" element={<ReportScreen />} />
              <Route path="/suppliers" element={<SupplierScreen />} />
              <Route path="/orders" element={<OrderScreen />} />
              <Route path="/manage-store" element={<ManageScreen />} />
              <Route path="/settings" element={<SettingScreen />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
