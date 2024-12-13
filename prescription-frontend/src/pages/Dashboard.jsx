import { useState } from "react";
import { Layout, Menu, Typography, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import UserManagement from "../components/UserManagement";
import DrugManagement from "../components/DrugManagement";
import PrescriptionManagement from "../components/PrescriptionManagement";
import QuotationManagement from "../components/QuotationManagement";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Logout handler
  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  // Dropdown menu for user actions
  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "user-management":
        // Handle user management click
        setActiveIndex(1);
        // Potentially render user management component or change view
        break;
      case "drug-management":
        // Handle drug management click
        setActiveIndex(2);
        break;
      case "prescription-management":
        // Handle prescription management click
        setActiveIndex(3);
        break;
      case "question-management":
        // Handle question management click
        setActiveIndex(4);
        break;
      default:
        break;
    }
  };

  // Side menu items
  const menuItems = [
    {
      key: "user-management",
      icon: <UserOutlined />,
      label: "User Management",
    },
    {
      key: "drug-management",
      icon: <MedicineBoxOutlined />,
      label: "Drug Management",
    },
    {
      key: "prescription-management",
      icon: <FileTextOutlined />,
      label: "Prescription Management",
    },
    {
      key: "question-management",
      icon: <QuestionCircleOutlined />,
      label: "Quotation Management",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "64px",
            backgroundColor: "#001529",
          }}
        >
          <Title
            level={3}
            style={{
              color: "white",
              margin: 0,
              textAlign: "center",
            }}
          >
            {collapsed ? "Admin" : "Admin Dashboard"}
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["user-management"]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: "0.2s" }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} />
            )}
          </div>

          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user.name || "Admin User"}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
          }}
        >
          {activeIndex === 1 && <UserManagement />}
          {activeIndex === 2 && <DrugManagement />}
          {activeIndex === 3 && <PrescriptionManagement />}
          {activeIndex === 4 && <QuotationManagement />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
