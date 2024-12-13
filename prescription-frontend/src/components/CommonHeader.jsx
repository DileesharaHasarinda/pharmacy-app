import { Layout, Menu, Typography } from "antd";
import {
  MedicineBoxOutlined,
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const CommonHeader = () => {
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        localStorage.removeItem("token");
        navigate("/login");
        break;
      case "quatations":
        navigate("/quatations");
        break;
      default:
        break;
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#001529",
        padding: "0 20px",
      }}
    >
      <Link to={"/"}>
        <Title
          level={3}
          style={{
            color: "white",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <MedicineBoxOutlined />
          Pharmacy Management System
        </Title>
      </Link>

      <Menu
        theme="dark"
        mode="horizontal"
        onClick={({ key }) => handleMenuClick(key)}
        items={[
          {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
          },
          {
            key: "quatations",
            icon: <NotificationOutlined />,
            label: "Quatations",
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
          },
        ]}
        style={{
          minWidth: "600px",
          justifyContent: "flex-end",
        }}
      />
    </Header>
  );
};

export default CommonHeader;
