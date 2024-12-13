import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Modal,
  Image,
  Tag,
  Button,
  Popconfirm,
  message,
  Space,
  Select,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import prescriptionsApi from "../api/prescriptionsApi";

const { Title } = Typography;
const { Option } = Select;

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await prescriptionsApi.getAllPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      message.error("Failed to fetch prescriptions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handle prescription status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await prescriptionsApi.updatePrescription(id, { status: newStatus });
      message.success("Prescription status updated");
      fetchPrescriptions(); // Refresh data
    } catch (error) {
      message.error("Failed to update prescription status");
      console.error(error);
    }
  };

  // Handle prescription deletion
  const handleDelete = async (id) => {
    try {
      await prescriptionsApi.deletePrescription(id);
      message.success("Prescription deleted successfully");
      fetchPrescriptions(); // Refresh data
    } catch (error) {
      message.error("Failed to delete prescription");
      console.error(error);
    }
  };

  // Show prescription images
  const showPrescriptionImages = (prescription) => {
    setSelectedPrescription(prescription);
    setSelectedImages(prescription.images);
    setImageModalVisible(true);
  };

  // Columns for the prescriptions table
  const columns = [
    {
      title: "Prescription ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-6),
    },
    {
      title: "Client Name",
      dataIndex: "client",
      key: "client",
      render: (client) => client.name,
    },
    {
      title: "Assigned Pharmacist",
      dataIndex: "assignedPharmacist",
      key: "assignedPharmacist",
      render: (pharmacist) => (pharmacist ? pharmacist.name : "Not Assigned"),
    },
    {
      title: "Drugs",
      dataIndex: "drugs",
      key: "drugs",
      render: (drugs) =>
        drugs.map((d) => `${d.drug.name} (${d.quantity})`).join(", "),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "open" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Images",
      key: "images",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => showPrescriptionImages(record)}
        >
          View Images
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select
            style={{ width: 120 }}
            placeholder="Update Status"
            onChange={(newStatus) => handleStatusUpdate(record._id, newStatus)}
            value={record.status}
          >
            <Option value="open">Open</Option>
            <Option value="closed">Closed</Option>
          </Select>

          <Popconfirm
            title="Are you sure you want to delete this prescription?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Prescription Management</Title>

      <Table
        columns={columns}
        dataSource={prescriptions}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* Image Modal */}
      <Modal
        title="Prescription Images"
        open={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
        width={800}
      >
        <Image.PreviewGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {selectedImages?.map((imageUrl, index) => (
              <Image
                key={index}
                width="100%"
                src={imageUrl}
                alt={`Prescription Image ${index + 1}`}
              />
            ))}
          </div>
        </Image.PreviewGroup>
      </Modal>
    </div>
  );
};

export default PrescriptionManagement;
