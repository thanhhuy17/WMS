// import SiderComponent from "@/components/SiderComponent";
// import HomeScreen from "@/screens/HomeScreen";

import { Layout } from "antd";

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
// Chia Layout
const { Footer, Content } = Layout;
const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <SiderComponent />
        <Layout>
          <HeaderComponent />
          <Content className="mt-3 mb-3 container bg-white">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
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
