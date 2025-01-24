'use client';
import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAllDocsFromCollection<Order>("orders");
      const pendingOrders = data.filter((order) => order.status === "Pending");
      setOrders(pendingOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

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
  ];

  return (
    <div>
      <Typography.Title level={2}>Pending Orders</Typography.Title>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
}
