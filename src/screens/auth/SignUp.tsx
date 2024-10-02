import { Button, Card, Checkbox, Form, Input, Space, Typography } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";

const { Title, Paragraph, Text } = Typography;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();

  const handleLogin = (values: { email: string; password: string }) => {
    console.log(values);
  };

  return (
    <div>
      <Card>
        <div className="text-center">
          <Title>Create an account</Title>
          <Paragraph type="secondary">
            {/* Welcome back! Please enter your details. */}
            Start your 30-day free trial.
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ required: true, message: "Enter your name!" }]}
          >
            <Input allowClear placeholder="Enter your name!" />
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
            rules={[{ required: true, message: "Enter your password!" }]}
          >
            <Input.Password
              maxLength={100}
              type="password"
              placeholder="Create a password!"
            />
          </Form.Item>
          <Form.Item
            name={"confirmPassword"}
            label={"Confirm Password"}
            rules={[{ required: true, message: "Enter your password!" }]}
          >
            <Input.Password
              maxLength={100}
              type="password"
              placeholder="Confirm Password!"
            />
          </Form.Item>
        </Form>

        <div className="row">
          <div className="col">
            <Text type="secondary">Must be at least 8 characters.</Text>
          </div>
        </div>

        <div className="mt-4 mb-3">
          <Button
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%" }}
            size="large"
          >
            Get started
          </Button>
        </div>
        <SocialLogin />
        <div className="mt-3 text-center">
          <Space>
            <Text type="secondary">Already have an account?</Text>
            <Link to={"/login"}>Login</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
