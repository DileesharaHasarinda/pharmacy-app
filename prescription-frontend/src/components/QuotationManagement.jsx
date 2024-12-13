import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Space,
  InputNumber,
  Typography,
  Input,
  Descriptions,
  Card,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import quotationsApi from "../api/quotationsApi";
import drugsApi from "../api/drugsApi";
import userApi from "../api/useUserApi";
import prescriptionsApi from "../api/prescriptionsApi";

const { Title, Text } = Typography;
const { Option } = Select;

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Function to handle viewing quotation details
  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setViewModalVisible(true);
  };
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [quotationData, drugData, pharmacistData, prescrioptionData] =
          await Promise.all([
            quotationsApi.getAllQuotations(),
            drugsApi.getAllDrugs(),
            userApi.getAllUsers(),
            prescriptionsApi.getAllPrescriptions(),
          ]);

        setQuotations(quotationData);
        setDrugs(drugData);
        setPrescriptions(prescrioptionData);

        // Filter only pharmacists
        const pharmacistUsers = pharmacistData.filter(
          (user) => user.userType === "pharamcist"
        );
        setPharmacists(pharmacistUsers);
      } catch (error) {
        message.error("Failed to load initial data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle prescription selection
  const handlePrescriptionSelect = (prescriptionId) => {
    const prescription = prescriptions.find((p) => p._id === prescriptionId);
    setSelectedPrescription(prescription);

    // Pre-fill drugs from prescription
    const prescriptionDrugs = prescription.drugs.map((drugItem) => ({
      drug: drugItem.drug._id,
      quantity: drugItem.quantity,
    }));

    form.setFieldsValue({
      client: prescription.client._id,
      drugs: prescriptionDrugs,
    });
  };

  // Open modal for creating/editing quotation
  const handleOpenModal = (quotation = null) => {
    setIsEditing(!!quotation);
    setCurrentQuotation(quotation);
    setSelectedPrescription(null);

    if (quotation) {
      // Prepare form values for editing
      form.setFieldsValue({
        pharmacist: quotation.pharmacist._id,
        drugs: quotation.drugs.map((d) => ({
          drug: d.drug._id,
          quantity: d.quantity,
        })),
        totalCost: quotation.totalCost,
      });
    } else {
      // Reset form for new quotation
      form.resetFields();
    }

    setModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Calculate total cost
      const totalCost = values.drugs.reduce((total, item) => {
        const drug = drugs.find((d) => d._id === item.drug);
        return total + drug.amount * item.quantity;
      }, 0);

      const quotationData = {
        ...values,
        totalCost,
        prescription: selectedPrescription?._id,
      };

      if (isEditing && currentQuotation) {
        // Update existing quotation
        await quotationsApi.updateQuotation(
          currentQuotation._id,
          quotationData
        );
        message.success("Quotation updated successfully");
      } else {
        // Create new quotation

        await quotationsApi.createQuotation(quotationData);
        message.success("Quotation created successfully");
      }

      // Refresh quotations
      const updatedQuotations = await quotationsApi.getAllQuotations();
      setQuotations(updatedQuotations);

      // Close modal
      setModalVisible(false);
    } catch (error) {
      message.error(`Failed to ${isEditing ? "update" : "create"} quotation`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prescription selection modal columns
  const prescriptionColumns = [
    {
      title: "Prescription ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-6),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client) => client.name,
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
          {" "}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handlePrescriptionSelect(record._id)}
          >
            Select
          </Button>
        </Space>
      ),
    },
  ];
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await quotationsApi.deleteQuotation(id);
      message.success("Quotation deleted successfully");

      // Refresh quotations
      const updatedQuotations = await quotationsApi.getAllQuotations();
      setQuotations(updatedQuotations);
    } catch (error) {
      message.error("Failed to delete quotation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Quotation ID",
      dataIndex: "_id",
      key: "id",
      render: (id) => id.slice(-6),
    },
    {
      title: "Pharmacist",
      dataIndex: "pharmacist",
      key: "pharmacist",
      render: (pharmacist) => pharmacist.name,
    },
    {
      title: "Drugs",
      dataIndex: "drugs",
      key: "drugs",
      render: (drugs) => drugs.map((d) => `${d.drug.name} (${d.quantity})),`),
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost) => `LKR${cost.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        return (
          <Space>
            {" "}
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewQuotation(record)}
            />
            <Popconfirm
              title="Are you sure you want to delete this quotation?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Title level={2}>Quotation Management</Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleOpenModal()}
        style={{ marginBottom: 16 }}
      >
        Create Quotation
      </Button>

      <Table
        columns={columns}
        dataSource={quotations}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* Quotation Modal */}
      <Modal
        title={isEditing ? "Edit Quotation" : "Create Quotation"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {/* Prescription Selection Section */}
        {!selectedPrescription && (
          <Card title="Select Prescription" style={{ marginBottom: 16 }}>
            <Table
              columns={prescriptionColumns}
              dataSource={prescriptions}
              rowKey="_id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
              }}
            />
          </Card>
        )}

        {/* Selected Prescription Preview */}
        {selectedPrescription && (
          <Card
            title="Selected Prescription"
            extra={
              <Button onClick={() => setSelectedPrescription(null)}>
                Change Prescription
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Text strong>Client: </Text> {selectedPrescription.client.name}
            <br />
            <Text strong>Drugs: </Text>
            {selectedPrescription.drugs
              .map((d) => `${d.drug.name} (${d.quantity})`)
              .join(", ")}
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          {/* Hidden client field */}
          <Form.Item name="client" style={{ display: "none" }}>
            <Input />
          </Form.Item>

          {/* Pharmacist Selection */}
          <Form.Item
            name="pharmacist"
            label="Pharmacist"
            rules={[
              {
                required: true,
                message: "Please select a pharmacist",
              },
            ]}
          >
            <Select placeholder="Select Pharmacist">
              {pharmacists.map((pharmacist) => (
                <Option key={pharmacist._id} value={pharmacist._id}>
                  {pharmacist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Dynamic Drugs Input */}
          <Form.List
            name="drugs"
            rules={[
              {
                validator: async (_, drugs) => {
                  if (!drugs || drugs.length === 0) {
                    return Promise.reject(
                      new Error("At least one drug is required")
                    );
                  }
                  if (drugs.length > 10) {
                    return Promise.reject(
                      new Error("Maximum 10 drugs allowed")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "drug"]}
                      rules={[
                        {
                          required: true,
                          message: "Please select a drug",
                        },
                      ]}
                    >
                      <Select style={{ width: 200 }} placeholder="Select Drug">
                        {drugs.map((drug) => (
                          <Option key={drug._id} value={drug._id}>
                            {drug.name} (LKR{drug.amount})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Please input quantity",
                        },
                      ]}
                    >
                      <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>
                    <Button onClick={() => remove(name)}>Remove</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Drug
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Form Actions */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!selectedPrescription}
              >
                {isEditing ? "Update" : "Create"} Quotation
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Quotation Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedQuotation && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Quotation ID">
              {selectedQuotation._id.slice(-6)}
            </Descriptions.Item>
            <Descriptions.Item label="Pharmacist">
              {selectedQuotation.pharmacist?.name}
            </Descriptions.Item>

            <Descriptions.Item label="Total Cost">
              LKR {selectedQuotation.totalCost.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Drugs">
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
            </Descriptions.Item>
            {selectedQuotation.prescription && (
              <Descriptions.Item label="Prescription">
                Prescription ID: {selectedQuotation.prescription.slice(-6)}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default QuotationManagement;
