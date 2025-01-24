"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Input, Space, Card, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation"; // For navigation
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  createdAt: Timestamp;
  email: string;
  fullName: string;
  houseNumber: string;
  orderDetails: CartItem[];
  orderId: string;
  phoneNumber: string;
  state: string;
  status: string; // "Pending", "Confirmed", etc.
}

export default function PendingOrdersDetails() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter(); // Router instance for navigation

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAllDocsFromCollection<Order>("orders");
      const pendingOrders = data.filter((order) => order.status === "Pending");
      setOrders(pendingOrders);
      setFilteredOrders(pendingOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(value) ||
        order.phoneNumber.toLowerCase().includes(value) ||
        order.email.toLowerCase().includes(value)
    );

    setFilteredOrders(filtered);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`); // Navigate to the order detail page
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Timestamp) =>
        new Date(createdAt.seconds * 1000).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors: { [key: string]: string } = {
          Pending: "orange",
          Confirmed: "blue",
          Processing: "purple",
          Dispatched: "cyan",
          Delivered: "green",
        };
        return (
          <span
            style={{
              color: statusColors[status] || "gray",
              fontWeight: "bold",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "View Order",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewOrder(record.orderId)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-evenly">
           {/* Search Field */}
      <Space className="flex-col" style={{ marginBottom: 16 }}>
      <Typography.Title level={2}>Pending Orders</Typography.Title>

        <Input
          placeholder="Search by Order ID, Phone Number, or Email"
          value={searchText}
          onChange={handleSearch}
          allowClear
          style={{ width: 400 }}
        />
      </Space>

        {/* Pending Orders Count Card */}
        <Card
          style={{
            width: 300,
            marginBottom: 16,
            backgroundColor: "#fafafa",
            textAlign: "center",
          }}
        >
          <Typography.Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Total Pending Orders
          </Typography.Text>
          <Typography.Title level={3}>{orders.length}</Typography.Title>
        </Card>
      </div>

   

      {/* Pending Orders Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}
