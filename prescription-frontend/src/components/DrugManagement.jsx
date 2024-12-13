import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  message,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import drugsApi from "../api/drugsApi";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const DrugManagement = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDrug, setCurrentDrug] = useState(null);
  const [form] = Form.useForm();

  // Fetch drugs effect
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true);
        const fetchedDrugs = await drugsApi.getAllDrugs();
        setDrugs(fetchedDrugs);
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch drugs");
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  // Open modal for creating drug
  const handleCreate = () => {
    form.resetFields();
    setIsEditing(false);
    setCurrentDrug(null);
    setIsModalVisible(true);
  };

  // Open modal for editing drug
  const handleEdit = (drug) => {
    setIsEditing(true);
    setCurrentDrug(drug);
    form.setFieldsValue({
      ...drug,
      expirationDate: drug.expirationDate ? moment(drug.expirationDate) : null,
    });
    setIsModalVisible(true);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (values) => {
    try {
      // Prepare drug data
      const drugData = {
        ...values,
        expirationDate: values.expirationDate
          ? values.expirationDate.format("YYYY-MM-DD")
          : null,
      };

      if (isEditing && currentDrug) {
        // Update existing drug
        const updatedDrug = await drugsApi.updateDrug(
          currentDrug._id,
          drugData
        );
        setDrugs(
          drugs.map((drug) => (drug.id === currentDrug.id ? updatedDrug : drug))
        );
        message.success("Drug updated successfully");
      } else {
        // Create new drug
        const newDrug = await drugsApi.createDrug(drugData);
        setDrugs([...drugs, newDrug]);
        message.success("Drug created successfully");
      }

      // Close modal
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Failed to save drug");
    }
  };

  // Handle drug deletion
  const handleDelete = async (drugId) => {
    try {
      await drugsApi.deleteDrug(drugId);
      setDrugs(drugs.filter((drug) => drug._id !== drugId));
      message.success("Drug deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete drug");
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price (LKR)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount}`,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable) => (
        <Tag color={isAvailable ? "green" : "red"}>
          {isAvailable ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "No description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 16 }}>
        Drug Management
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ float: "right" }}
        >
          Add New Drug
        </Button>
      </Title>

      <Table
        columns={columns}
        dataSource={drugs}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} drugs`,
        }}
      />

      <Modal
        title={isEditing ? "Edit Drug" : "Create New Drug"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Drug Name"
            rules={[{ required: true, message: "Please input drug name" }]}
          >
            <Input placeholder="Enter drug name" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Price"
            rules={[{ required: true, message: "Please input drug amount" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter amount"
            />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please select unit" }]}
          >
            <Select placeholder="Select unit">
              <Option value="mg">mg</Option>
              <Option value="ml">ml</Option>
              <Option value="g">g</Option>
              <Option value="tablet">Tablet</Option>
              <Option value="capsule">Capsule</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isAvailable"
            label="Availability"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Enter drug description (optional)"
            />
          </Form.Item>

          <Form.Item name="expirationDate" label="Expiration Date">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select expiration date (optional)"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditing ? "Update Drug" : "Create Drug"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DrugManagement;
