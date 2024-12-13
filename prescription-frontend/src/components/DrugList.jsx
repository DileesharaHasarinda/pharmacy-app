import { useState, useEffect } from "react";
import { Table, Card, message } from "antd";
import drugsApi from "../api/drugsApi"; // You'll need to create this

const DrugsList = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await drugsApi.getAllDrugs();
        setDrugs(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch drugs");
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
  ];

  return (
    <Card title="Available Drugs" style={{ minHeight: "80vh" }}>
      <Table
        columns={columns}
        dataSource={drugs}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </Card>
  );
};

export default DrugsList;
