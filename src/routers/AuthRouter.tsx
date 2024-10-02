import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, SignUp } from "../screens";

const AuthRouter = () => {
  return (
    <div className="container">
      <div className="row">
        {/* className="d-none d-sm-block" */}
        <div className="col mx-auto my-auto">
          <img src="" alt="" />
          <h1>Image</h1>
        </div>
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
