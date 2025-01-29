"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Input, Space, Card, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation"; // For navigation
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { OrderType } from "@/types/orderType";

export default function PendingOrdersDetails() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter(); // Router instance for navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllDocsFromCollection<OrderType>("orders");
        if (data) {
          const pendingOrders = data.filter((order) => order.status === "Pending");
          setOrders(pendingOrders);
          setFilteredOrders(pendingOrders);
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = orders.filter((order) => {
      const { orderId, phoneNumber, email } = order;
      // Convert all fields to strings and check for matching text
      return (
        (orderId?.toLowerCase().includes(value) || "") ||
        (phoneNumber?.toLowerCase().includes(value) || "") ||
        (email?.toLowerCase().includes(value) || "")
      );
    });

    setFilteredOrders(filtered);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`order-details/${orderId}`); // Navigate to the order detail page
  };

  const columns: ColumnsType<OrderType> = [
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

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    ); // Show loading state while data is being fetched
  }

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
