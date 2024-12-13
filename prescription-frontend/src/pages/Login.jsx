import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import userApi from "../api/useUserApi";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      await authApi.login(values);
      const user = await userApi.getUserProfile();
      localStorage.setItem("user", JSON.stringify(user));
      message.success("Login successful!");
      if (user.userType === "client") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      message.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "16px",
      }}
    >
      <Card
        title="Login"
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>

          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            <Typography.Text>
              {"Don't have an account? "}
              <Link to="/register">Register now</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
