import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  DatePicker,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      // Prepare registration data
      const registrationData = {
        ...values,
        userType: "client", // Hardcoded as per requirement
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
      };

      // Call registration API
      await authApi.register(registrationData);

      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Registration failed. Please try again.");
    }
  };

  // Custom validation for contact number
  const validateContactNo = (_, value) => {
    const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
    if (!value) {
      return Promise.reject(new Error("Please input your contact number!"));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Contact number must be 10 digits!"));
    }
    return Promise.resolve();
  };

  // Custom validation to ensure user is at least 18 years old
  const validateDateOfBirth = (_, value) => {
    // if (!value) {
    //   return Promise.reject(new Error("Please select your date of birth!"));
    // }
    // const age = moment().diff(value, "years");
    // console.log(age);
    // if (age < 18) {
    //   return Promise.reject(new Error("You must be at least 18 years old"));
    // }
    return Promise.resolve();
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
        title="Register"
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Form form={form} onFinish={handleRegister} layout="vertical">
          {/* Name Field */}
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
              {
                min: 2,
                message: "Name must be at least 2 characters long!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          {/* Email Field */}
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
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must include uppercase, lowercase, number, and special character",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          {/* Address Field */}
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
              {
                min: 5,
                message: "Address must be at least 5 characters long!",
              },
            ]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Address" />
          </Form.Item>

          {/* Contact Number Field */}
          <Form.Item
            name="contactNo"
            rules={[
              {
                validator: validateContactNo,
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Contact Number" />
          </Form.Item>

          {/* Date of Birth Field */}
          <Form.Item
            name="dateOfBirth"
            rules={[
              {
                validator: validateDateOfBirth,
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Date of Birth" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          {/* Login Link */}
          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            <Typography.Text>
              Already have an account? <Link to="/login">Login now</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
