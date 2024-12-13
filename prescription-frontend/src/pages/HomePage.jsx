import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import CreatePrescription from "../components/CreatePrescription";
import DrugsList from "../components/DrugList";
import CommonHeader from "../components/CommonHeader";

const { Content } = Layout;

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CommonHeader />

      {/* Content Area */}
      <Content
        style={{
          padding: "24px",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <CreatePrescription />
          </Col>
          <Col span={12}>
            <DrugsList />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
