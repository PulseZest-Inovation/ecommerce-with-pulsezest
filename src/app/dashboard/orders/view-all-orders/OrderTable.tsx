"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, Select, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import OrderSearch from "./OrderSearch";

const { Option } = Select;

const OrderTable = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllDocsFromCollection<OrderType>("orders");

        // Sort orders by most recent date (descending)
        const sortedOrders = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
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

  const statusColors: Record<OrderType["status"], string> = {
    Pending: "orange",
    Confirmed: "blue",
    Processing: "purple",
    Dispatched: "gold",
    Delivered: "green",
  };

  const handleStatusFilter = (value: string | null) => {
    setStatusFilter(value);
    if (value) {
      setFilteredOrders(orders.filter(order => order.status === value));
    } else {
      setFilteredOrders(orders);
    }
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
      sorter: (a, b) => b.createdAt.seconds - a.createdAt.seconds, // Ensuring sorting remains correct
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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={2}>Orders</Typography.Title>

      {/* Search and Filter Options */}
      <Space style={{ marginBottom: 16 }}>
        <OrderSearch
          searchText={searchText}
          setSearchText={setSearchText}
          setFilteredOrders={setFilteredOrders}
          orders={orders}
        />

        {/* Order Status Filter */}
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
          onChange={handleStatusFilter}
          value={statusFilter}
        >
          {Object.keys(statusColors).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Space>

      {/* Orders Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
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
};

export default OrderTable;
