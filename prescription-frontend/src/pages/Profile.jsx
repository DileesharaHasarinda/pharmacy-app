import { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Row,
  Col,
  Card,
  Layout,
} from "antd";
import userApi from "../api/useUserApi";
import moment from "moment";
import CommonHeader from "../components/CommonHeader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userApi.getUserProfile();
        setUser(userData);

        // Set initial form values
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          address: userData.address,
          contactNo: userData.contactNo,
          dateOfBirth: moment(userData.dateOfBirth),
        });
      } catch (error) {
        console.error(error);
        message.error("Error loading user data");
      }
    };

    fetchUserProfile();
  }, [form]);

  // Handle form submission
  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Prepare update data (exclude user type and password)
      const updateData = {
        name: values.name,
        address: values.address,
        contactNo: values.contactNo,
        dateOfBirth: values.dateOfBirth.toDate(),
      };

      const updatedUser = await userApi.updateUser(updateData);
      setUser(updatedUser);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CommonHeader />
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card title="User Profile" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              requiredMark="optional"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input disabled placeholder="Your email address" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address",
                    whitespace: true,
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter your full address"
                />
              </Form.Item>

              <Form.Item
                name="contactNo"
                label="Contact Number"
                rules={[
                  {
                    required: true,
                    message: "Please input your contact number",
                    whitespace: true,
                  },
                  {
                    pattern: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input placeholder="Enter your contact number" maxLength={15} />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please select your date of birth",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.isAfter(moment())) {
                        return Promise.reject(
                          new Error("Date of birth cannot be in the future")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select your date of birth"
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Profile;
