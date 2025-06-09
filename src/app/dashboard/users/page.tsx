'use client'
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Table, Modal } from "antd";
import { createUserWithEmailAndPassword, deleteUser, getAuth } from "firebase/auth";
import { auth } from "@/config/firbeaseConfig";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { deleteDocFromCollection } from "@/services/FirestoreData/deleteFirestoreData";
import { UserType } from "@/types/User";
const { Option } = Select;

const USER_ROLES = [
  { label: "Administrator", value: "administrator" },
  { label: "Product Manager", value: "product-manager" },
  { label: "Analytics", value: "analytics" },
  { label: "Order Manager", value: "order-manager" },
  { label: "Customer Support", value: "customer-support" },
  { label: "Marketing", value: "marketing" },
  { label: "Viewer", value: "viewer" },
];

export default function UsersPage() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllDocsFromCollection("users");
    const users: UserType[] = data.map((user: any) => ({
      id: user.id,
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      fullName: user.fullName || "",
      roleType: user.roleType || "",
      createdAt: user.createdAt,
      isDelete: true
    }));
    setUsers(users);
    setLoading(false);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editingUserId) {
        // Edit mode: update user in Firestore
        const userData = {
          email: values.email,
          phoneNumber: values.phoneNumber,
          fullName: values.fullName,
          roleType: values.roleType,
          createdAt: new Date(),
        };
        const isSuccess = await setDocWithCustomId("users", editingUserId, userData);
        if (isSuccess) {
          message.success("User updated successfully!");
          form.resetFields();
          setModalOpen(false);
          setEditingUserId(null);
          fetchUsers();
        } else {
          message.error("Failed to update user data.");
        }
      } else {
        // Create mode: create user in Firebase Auth and Firestore
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const applicationId = localStorage.getItem("securityKey") || "";
        const userId = userCredential.user.uid;
        const userData = {
          email: values.email,
          phoneNumber: values.phoneNumber,
          fullName: values.fullName,
          roleType: values.roleType,
          createdAt: new Date(),
          applicationId: applicationId,
          isDelete: true,
        };
        const isSuccess = await setDocWithCustomId("users", userId, userData);
        if (isSuccess) {
          message.success("User created successfully!");
          form.resetFields();
          setModalOpen(false);
          fetchUsers();
        } else {
          message.error("Failed to save user data.");
        }
      }
    } catch (error: any) {
      message.error(error.message || "Error creating/updating user.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUserId(user.id);
    setModalOpen(true);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roleType: user.roleType,
      password: "", // password not editable
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const handleDelete = async (user: UserType) => {
    if (user.isDelete === false) {
      message.warning("You are not allowed to delete this user.");
      return;
    }
    setLoading(true);
    try {
      const isDeleted = await deleteDocFromCollection("users", user.id);
      if (isDeleted) {
        try {
        if (auth.currentUser && auth.currentUser.uid === user.id) {
          await deleteUser(auth.currentUser);
        }
        // If you want to delete other users, use Firebase Admin SDK on the server.
      } catch (authErr) {
        console.warn("Could not delete user from Firebase Auth. Use Admin SDK for full deletion.", authErr);
      }
        message.success("User deleted successfully!");
        fetchUsers();
      } else {
        message.error("Failed to delete user.");
      }
    } catch (err) {
      message.error("Error deleting user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Users List</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditingUserId(null); }}>
          Add User
        </Button>
      </div>
      <Table
        dataSource={users}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "Full Name", dataIndex: "fullName" },
          { title: "Email", dataIndex: "email" },
          { title: "Phone", dataIndex: "phoneNumber" },
          { title: "Role", dataIndex: "roleType" },
          { title: "Created At", dataIndex: "createdAt", render: (val) => val?.toDate ? val.toDate().toLocaleString() : "" },
          {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: UserType) => (
              <>
                <Button type="link" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                {record.isDelete !== false && (
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: "Are you sure you want to delete this user?",
                        onOk: () => handleDelete(record),
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
              </>
            ),
          },
        ]}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUserId ? "Edit User" : "Add User"}
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input disabled={!!editingUserId} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>
          {!editingUserId && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="roleType"
            label="Role Type"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              {USER_ROLES.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {editingUserId ? "Update User" : "Create User"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}