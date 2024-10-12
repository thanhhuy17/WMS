// import SiderComponent from "@/components/SiderComponent";
// import HomeScreen from "@/screens/HomeScreen";

import { Layout } from "antd";
import SiderComponent from "../components/SiderComponent";
import HomeScreen from "../screens/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  InventoryScreen,
  ManageScreen,
  OrderScreen,
  ReportScreen,
  SupplierScreen,
} from "../screens";
// Chia Layout
const { Header, Footer, Sider, Content } = Layout;
const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <SiderComponent />
        <Layout>
          <Header />
          <Content>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/reports" element={<ReportScreen />} />
              <Route path="/suppliers" element={<SupplierScreen />} />
              <Route path="/orders" element={<OrderScreen />} />
              <Route path="/manage-store" element={<ManageScreen />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
