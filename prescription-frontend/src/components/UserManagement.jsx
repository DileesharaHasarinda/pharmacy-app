import { useState, useEffect } from "react";
import { Table, Typography, message, Tag } from "antd";

import userApi from "../api/useUserApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users effect
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userApi.getAllUsers();
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch users");
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (userType) => (
        <Tag color={userType === "client" ? "blue" : "green"}>
          {userType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <div>
      <Typography.Title level={2} style={{ marginBottom: 16 }}>
        User Management
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
      />
    </div>
  );
};

export default UserManagement;
