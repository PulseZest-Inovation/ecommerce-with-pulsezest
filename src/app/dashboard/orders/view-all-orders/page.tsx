"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Input, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";

export default function ViewAllOrderPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllDocsFromCollection<OrderType>("orders");
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (typeof window !== "undefined") {
      fetchOrders();
    }
  }, []);
  

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = orders.filter((order) => {
      const orderId = order.orderId?.toLowerCase() || "";
      const phoneNumber = order.phoneNumber?.toLowerCase() || "";
      const email = order.email?.toLowerCase() || "";

      const orderDetailsMatch = order.orderDetails?.some((item) =>
        item.name?.toLowerCase().includes(value)
      );

      return (
        orderId.includes(value) ||
        phoneNumber.includes(value) ||
        email.includes(value) ||
        orderDetailsMatch
      );
    });

    setFilteredOrders(filtered);
  };

  const statusColors: Record<OrderType["status"], string> = {
    Pending: "orange",
    Confirmed: "blue",
    Processing: "purple",
    Dispatched: "gold",
    Delivered: "green",
  };

  const columns: ColumnsType<OrderType> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
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
      title: "Address",
      key: "address",
      render: (_, record) =>
        `${record.houseNumber}, ${record.apartment}, ${record.address}, ${record.city}, ${record.state}, ${record.country}`,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Timestamp) =>
        new Date(createdAt.seconds * 1000).toLocaleDateString(),
      sorter: (a, b) => a.createdAt.seconds - b.createdAt.seconds,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderType["status"]) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Typography.Link onClick={() => router.push(`orders/order-details/${record.orderId}`)}>
          View Details
        </Typography.Link>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Orders</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Order ID, Phone Number, Product Title, or Email"
          value={searchText}
          onChange={handleSearch}
          allowClear
          style={{ width: 400 }}
        />
      </Space>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <Typography.Text strong>Order Details:</Typography.Text>
              <Table
                dataSource={record.orderDetails}
                pagination={false}
                rowKey="id"
                columns={[
                  {
                    title: "Item Name",
                    dataIndex: "productTitle",
                    key: "productTitle",
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `₹${price}`,
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                ]}
              />
            </div>
          ),
        }}
        pagination={{
          pageSize: 20,
        }}
      />
    </div>
  );
}
