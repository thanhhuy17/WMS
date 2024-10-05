import { ConfigProvider, message } from "antd";
import "./App.css";
import Routers from "./routers/Routers";

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: "my-message",
});

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextHeading: "#1570EF",
        },
        components: {},
      }}
    >
      <Routers />;
    </ConfigProvider>
  );
}

export default App;
