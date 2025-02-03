"use client";
import React, { useState, useEffect } from "react";
import { getTotalOrders, getOrderStatusCount, getOrdersTrend } from "@/utils/analytics/orderStatus";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Flex, Spin } from "antd";
import { OrderType } from "@/types/orderType";
import StatsCard from "../StatsCard";

// Define the type for the order trend data
interface OrderTrend {
  date: string;
  count: number;
  orders: OrderType[]; // Include orders for each date
}

const OrderStatus = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [confirmedOrders, setConfirmedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [orderTrends, setOrderTrends] = useState<OrderTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [total, pending, confirmed, delivered, processing, trends] = await Promise.all([
        getTotalOrders(),
        getOrderStatusCount("Pending"),
        getOrderStatusCount("Confirmed"),
        getOrderStatusCount("Delivered"),
        getOrderStatusCount("Processing"),
        getOrdersTrend(),
      ]);
      
      setTotalOrders(total);
      setPendingOrders(pending);
      setConfirmedOrders(confirmed);
      setDeliveredOrders(delivered);
      setProcessingOrders(processing);
      setOrderTrends(trends);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Spin size="large" />;

  // Custom Tooltip content
  const CustomTooltip = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;
    const trend = payload[0].payload;

    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
        <h4>{`Date: ${label}`}</h4>
        <p>{`Total Orders: ${trend.count}`}</p>
        <h5>Order Details:</h5>
        <ul>
          {trend.orders.map((order: OrderType) => (
            <li key={order.orderId}>
              {order.fullName} - {order.status} - {order.orderDetails.length} items
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {/* Stats Cards */}
      <Flex gap={20} wrap="wrap">
        <StatsCard title="Total Orders" value={totalOrders} />
        <StatsCard title="Pending Orders" value={pendingOrders} />
        <StatsCard title="Confirmed Orders" value={confirmedOrders} />
        <StatsCard title="Delivered Orders" value={deliveredOrders} />
        <StatsCard title="Processing Orders" value={processingOrders} />
      </Flex>

      {/* Order Trends Graph */}
      <h3 style={{ marginTop: "20px" }}>Order Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={orderTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="count" stroke="#1890ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatus;
