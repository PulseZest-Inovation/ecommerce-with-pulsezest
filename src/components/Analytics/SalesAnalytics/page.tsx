"use client";
import React, { useState, useEffect } from "react";
import { getTotalRevenue, getBestSellingProducts, getSalesByDate } from "@/utils/analytics/salesAnalytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Flex, Spin, Card, Typography } from "antd";
import StatsCard from "../StatsCard";
import SalesAnalyticsFilter from "./SalesAnalyticsFilter";

// Define the type for the sales data
interface SalesData {
  date: string;
  totalRevenue: number;
  count: number;
}

const SalesAnalytics = () => {
  const [orderStatus, setOrderStatus] = useState<"Confirmed" | "Pending" | "Delivered" | "Processing" | undefined>("Confirmed");
  const [dateRange, setDateRange] = useState<"last7days" | "last30days" | "lastWeek" | "lastMonth" | "totalRevenue" | undefined>("totalRevenue");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [salesByDate, setSalesByDate] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [revenue, bestSelling, sales] = await Promise.all([
        dateRange === "totalRevenue" ? getTotalRevenue(orderStatus) : 0, // Handle "totalRevenue" separately
        getBestSellingProducts(),
        dateRange !== "totalRevenue" ? getSalesByDate(orderStatus, dateRange) : [], // Exclude sales by date if it's totalRevenue
      ]);

      setTotalRevenue(revenue);
      setBestSellingProducts(bestSelling);
      setSalesByDate(sales);
      setLoading(false);
    };

    fetchData();
  }, [orderStatus, dateRange]);

  if (loading) return <Spin size="large" />;

  const CustomTooltip = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;
    const trend = payload[0].payload;

    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
        <h4>{`Date: ${label}`}</h4>
        <p>{`Total Revenue: ₹${trend.totalRevenue.toFixed(2)}`}</p>
        <p>{`Orders Count: ${trend.count}`}</p>
      </div>
    );
  };

  return (
    <div>
      <SalesAnalyticsFilter
        orderStatus={orderStatus}
        setOrderStatus={setOrderStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <Flex gap={20} wrap="wrap">
        <StatsCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} />
      </Flex>

      <h3 style={{ marginTop: "20px" }}>Best Selling Products</h3>
      {bestSellingProducts.map((product: any) => (
        <Card key={product.productId} title={product.productTitle}>
          <Typography.Text>Sold: {product.count} units</Typography.Text>
        </Card>
      ))}

      {dateRange !== "totalRevenue" && (
        <>
          <h3 style={{ marginTop: "20px" }}>Sales by Date</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalRevenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;
