import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import OrderSearch from "./OrderSearch";
import ExportOderDetails from "./DownloadOrder";
import OrderStatusFilter from "./OrderStatusFilter";  // Import the new component

const OrderTable = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>(""); 
  const [statusFilter, setStatusFilter] = useState<string | null>(null);  // The selected filter
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllDocsFromCollection<OrderType>("orders");

        // Sort orders by most recent date (descending)
        const sortedOrders = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders); // Initially, set filteredOrders to all orders
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

  useEffect(() => {
    // Reapply filtering logic when statusFilter changes
    if (statusFilter) {
      const filtered = orders.filter(order => order.status === statusFilter);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // No filter, show all orders
    }
  }, [statusFilter, orders]); // Run when statusFilter or orders change

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
      sorter: (a, b) => b.createdAt.seconds - a.createdAt.seconds,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderType["status"]) => (
        <Tag color={status === "Pending" ? "orange" : status === "Confirmed" ? "blue" : status === "Processing" ? "purple" : status === "Dispatched" ? "gold" : "green"}>
          {status}
        </Tag>
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
      <div className="flex justify-evenly">
        <Typography.Title level={2}>Orders</Typography.Title>

        <OrderSearch
          searchText={searchText}
          setSearchText={setSearchText}
          setFilteredOrders={setFilteredOrders}
          orders={orders}
        />

        <ExportOderDetails data={filteredOrders} filename="order_details.csv" />
      </div>

      {/* Use the new OrderStatusFilter component */}
      <OrderStatusFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orders={orders}
      />

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
