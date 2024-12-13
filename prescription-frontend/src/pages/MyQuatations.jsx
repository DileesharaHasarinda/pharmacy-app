import {
  Layout,
  Typography,
  Table,
  Card,
  message,
  Space,
  Button,
  Modal,
  Tag,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import CommonHeader from "../components/CommonHeader";
import { useEffect, useState } from "react";
import quotationsApi from "../api/quotationsApi";

const { Content } = Layout;
const { Title, Text } = Typography;

const MyQuatations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await quotationsApi.getAllQuotations();
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setQuotations(
          res.filter((q) => q.pharmacist._id === currentUser["_id"])
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        message.error("Error getting quotations");
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  // Handle viewing quotation details
  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setViewModalVisible(true);
  };

  // Columns for quotations table
  const columns = [
    {
      title: "Quotation ID",
      dataIndex: "_id",
      key: "id",
      render: (id) => id.slice(-6),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state) => <Tag>{state}</Tag>,
    },

    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost) => `LKR ${cost.toFixed(2)}`,
    },
    {
      title: "Drugs",
      dataIndex: "drugs",
      key: "drugs",
      render: (drugs) =>
        drugs.map((d) => `${d.drug.name} (${d.quantity})`).join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewQuotation(record)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const acceptQuatation = async () => {
    console.log(selectedQuotation._id);
    try {
      await quotationsApi.updateQuotationState(
        selectedQuotation._id,
        "approved"
      );
      setQuotations([]);
      const res = await quotationsApi.getAllQuotations();
      const currentUser = JSON.parse(localStorage.getItem("user"));
      setQuotations(res.filter((q) => q.pharmacist._id === currentUser["_id"]));
    } catch (error) {
      console.error(error);
      message.error("Error updating the state of quatation");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CommonHeader />

      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <Card>
          <Title level={2} style={{ marginBottom: 20 }}>
            My Quotations
          </Title>

          <Table
            columns={columns}
            dataSource={quotations}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            locale={{
              emptyText: "No quotations found",
            }}
          />
        </Card>

        {/* Quotation Details Modal */}
        <Modal
          title="Quotation Details"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button
              onClick={async () => {
                await acceptQuatation();
                setViewModalVisible(false);
                setSelectedQuotation();
              }}
              disabled={selectedQuotation?.state !== "pending"}
              key={"accept"}
              type="primary"
            >
              Accept Quatation
            </Button>,
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedQuotation && (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card>
                <Space direction="vertical">
                  <Text strong>Quotation ID: </Text>
                  <Text>{selectedQuotation._id}</Text>

                  <Text strong>Pharmacist: </Text>
                  <Text>{selectedQuotation.pharmacist.name}</Text>

                  <Text strong>Total Cost: </Text>
                  <Text>LKR {selectedQuotation.totalCost.toFixed(2)}</Text>
                </Space>
              </Card>
              <Card title="Drugs">
                <Table
                  columns={[
                    {
                      title: "Drug Name",
                      dataIndex: ["drug", "name"],
                      key: "drugName",
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Unit Price",
                      dataIndex: ["drug", "amount"],
                      key: "unitPrice",
                      render: (amount) => `LKR ${amount.toFixed(2)}`,
                    },
                    {
                      title: "Subtotal",
                      key: "subtotal",
                      render: (_, record) =>
                        `LKR ${(record.drug.amount * record.quantity).toFixed(
                          2
                        )}`,
                    },
                  ]}
                  dataSource={selectedQuotation.drugs}
                  pagination={false}
                  rowKey={(record) => record.drug._id}
                />
              </Card>{" "}
            </Space>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default MyQuatations;
