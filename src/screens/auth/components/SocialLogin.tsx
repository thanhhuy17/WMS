import { Button, message } from "antd";
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase/firebaseConfig";
import handleAPI from "../../../apis/handleAPI";
import { addAuth } from "../../../redux/reducers/authReducer";
import { localDataNames } from "../../../constants/appInfos";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
// provider.setCustomParameters({
//   login_hint: "huymau170819999@gmail.com",
// });
interface Props{
  isRemember?: boolean
}
const SocialLogin = (props: Props) => {
  const {isRemember} = props
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  //LOGIN WITH GOOGLE
  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const user = result.user;

        if (user) {
          const dataWithGoogle = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL
          };
          // console.log("Check data send to backend: ", dataWithGoogle);
          const api = "/auth/google-login";
          try {
            const res: any = await handleAPI(api, dataWithGoogle, "post");
            message.success(res.message);
            // console.log("check data response from backend API: ", res);
            dispatch(addAuth(res.data));
            if (isRemember) {
              localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
            }
          } catch (error: any) {
            console.log(error);
            message.error(error.message);
          } finally {
            setIsLoading(false);
          }
        }
        // console.log("Check User Google: ", user);
      } else {
        console.log("Can not login with google");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        loading={isLoading}
        onClick={handleLoginWithGoogle}
        style={{ width: "100%" }}
        size="large"
        icon={
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/fluency/48/google-logo.png"
            alt="google-logo"
          />
        }
      >
        Google
      </Button>
    </>
  );
};

export default SocialLogin;
