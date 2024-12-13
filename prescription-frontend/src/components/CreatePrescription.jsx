import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Space,
  InputNumber,
  Card,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig"; // Adjust the import path
import prescriptionsApi from "../api/prescriptionsApi"; // Adjust the import path
import drugsApi from "../api/drugsApi";

const { Option } = Select;

const CreatePrescription = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [drugs, setDrugs] = useState([]);

  // Handle file upload to Firebase
  const handleFileUpload = async (file) => {
    if (fileList.length >= 5) {
      message.error("Maximum 5 images allowed");
      return false;
    }

    try {
      setUploading(true);
      // Generate a unique filename
      const filename = `prescriptions/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filename);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update file list
      const newFileList = [
        ...fileList,
        {
          uid: snapshot.ref.name,
          name: file.name,
          status: "done",
          url: downloadURL,
        },
      ];
      setFileList(newFileList);
      setUploading(false);

      return false; // Prevent default upload behavior
    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
      setUploading(false);
      return false;
    }
  };

  // Remove file from list
  const handleFileRemove = (file) => {
    const index = fileList.findIndex((f) => f.uid === file.uid);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  // Submit prescription
  const onFinish = async (values) => {
    try {
      // Prepare prescription data
      const prescriptionData = {
        ...values,
        images: fileList.map((file) => file.url),
        drugs: values.drugs || [], // Ensure drugs array exists
      };

      // Create prescription
      await prescriptionsApi.createPrescription(prescriptionData);

      message.success("Prescription created successfully");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error(error);
      message.error(`Failed to create prescription:`);
    }
  };

  useEffect(() => {
    drugsApi
      .getAllDrugs()
      .then((drugs) => {
        setDrugs(drugs);
      })
      .catch((error) => {
        console.error(error);
        message.error("Error fetching drugs");
      });
  }, []);

  return (
    <Card style={{ minHeight: "80vh" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl mb-6 text-center">Create Prescription</h2>

        {/* Drugs Dynamic Fields */}
        <Form.List name="drugs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="mb-4" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "drug"]}
                    rules={[{ required: true, message: "Missing drug" }]}
                  >
                    <Select placeholder="Select Drug" style={{ width: 200 }}>
                      {drugs.map((drug) => (
                        <Option key={drug._id}>{drug.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Missing quantity" }]}
                  >
                    <InputNumber min={1} max={100} placeholder="Quantity" />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="text-red-500 cursor-pointer"
                      onClick={() => remove(name)}
                    />
                  ) : null}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  disabled={fields.length >= 10}
                >
                  Add Drug
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Image Upload */}
        <Form.Item label="Prescription Images">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleFileUpload}
            onRemove={handleFileRemove}
            multiple={false}
            accept="image/*"
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </Form.Item>

        {/* Optional Notes */}
        <Form.Item name="notes" label="Additional Notes">
          <Input.TextArea rows={4} placeholder="Enter any additional notes" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={uploading}>
            Create Prescription
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePrescription;
