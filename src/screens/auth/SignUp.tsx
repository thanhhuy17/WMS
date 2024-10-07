import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";
import { localDataNames } from "../../constants/appInfos";

const { Title, Paragraph, Text } = Typography;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    // confirmPassword: string;
  }) => {
    const api = `/auth/register`;
    console.log("Gia tri dua qua server: ", values);
    setIsLoading(true);
    try {
      const res = await handleAPI(api, values, "post");
      if (res.data.data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data.data));
        dispatch(addAuth(res.data.data));
      }
      console.log("Phan hoi tu API: ", res.data.data);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <div className="text-center">
          <img
            width={"100px"}
            height={"100px"}
            src="https://firebasestorage.googleapis.com/v0/b/whms-81447.appspot.com/o/Logo2.png?alt=media&token=20160d42-27f1-4983-be07-d949cf994828"
            alt=""
          />
          <Title>Create an account</Title>
          <Paragraph type="secondary">
            {/* Welcome back! Please enter your details. */}
            Start your 30-day free trial.
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleRegister}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ required: true, message: "Enter your name!" }]}
          >
            <Input allowClear placeholder="Please Enter your name!" />
          </Form.Item>
          <Form.Item
            name={"email"}
            label={"Email"}
            rules={[{ required: true, message: "Enter your email!" }]}
          >
            <Input
              allowClear
              maxLength={100}
              type="email"
              placeholder="Enter your email!"
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            label={"Password"}
            rules={[
              { required: true, message: "Enter your password!" },
              () => ({
                validator: (_, value) => {
                  if (value.length < 8) {
                    return Promise.reject(
                      new Error(`Mật khẩu phải có ít nhất 8 ký tự!.`)
                    );
                  } else {
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              maxLength={100}
              type="password"
              placeholder="Create a password!"
            />
          </Form.Item>
          {/* <Form.Item
            name={"confirmPassword"}
            label={"Confirm Password"}
            rules={[
              { required: true, message: "Enter your password!" },

              () => ({
                validator: (_, value) => {
                  if (value.length < 8) {
                    return Promise.reject(
                      new Error(`Mật khẩu phải có ít nhất 8 ký tự!.`)
                    );
                  } else {
                  }
                  return Promise.resolve();
                },
              }),
              // So sánh 2 Password để Confirm
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu khác nhau, mời nhập lại.")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              maxLength={100}
              type="password"
              placeholder="Confirm Password!"
            />
          </Form.Item> */}
        </Form>

        <div className="row">
          <div className="col">
            <Text type="secondary">Must be at least 8 characters.</Text>
          </div>
        </div>

        <div className="mt-4 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%" }}
            size="large"
          >
            Sign Up
          </Button>
        </div>
        <SocialLogin />
        <div className="mt-3 text-center">
          <Space>
            <Text type="secondary">Already have an account?</Text>
            <Link to={"/"}>Login</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
