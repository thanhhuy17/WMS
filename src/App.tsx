import { ConfigProvider, message } from "antd";
import "./App.css";
import Routers from "./routers/Routers";
import { Provider } from "react-redux";
import { store } from "./redux/store";

console.log("Check ENV: ", process.env.REACT_APP_API_ID);

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
      <Provider store={store}>
        <Routers />;
      </Provider>
    </ConfigProvider>
  );
}

export default App;
