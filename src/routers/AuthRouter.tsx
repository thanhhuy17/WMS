import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, SignUp } from "../screens";
import { Typography } from "antd";

const { Title } = Typography;

const AuthRouter = () => {
  return (
    <div className="container">
      <div className="row">
        {/* className="d-none d-sm-block" */}
        <div className="col text-center flex-column my-auto d-none d-lg-block">
          <div className="mb-4">
            <img
              style={{ objectFit: "cover" }}
              src="https://firebasestorage.googleapis.com/v0/b/whms-81447.appspot.com/o/Logo.png?alt=media&token=b8115210-d12f-4450-81d9-929993d5f6a9"
              alt="HuyNguyen"
            />
          </div>

          <Title className="">WHMS</Title>
        </div>

        <div className="col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
