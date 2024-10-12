// import SiderComponent from "@/components/SiderComponent";
// import HomeScreen from "@/screens/HomeScreen";

import { Layout } from "antd";
import SiderComponent from "../components/SiderComponent";
import HomeScreen from "../screens/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
