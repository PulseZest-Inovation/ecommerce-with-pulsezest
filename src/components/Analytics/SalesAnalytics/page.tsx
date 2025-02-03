"use client";
import React, { useState, useEffect } from "react";
import { getTotalRevenue, getBestSellingProducts, getSalesByDate } from "@/utils/analytics/salesAnalytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Flex, Spin } from "antd";
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

  if (loading) return <div className="flex justify-center items-center">
    <Spin size="large" />
  </div>;

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



    <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Best Selling Products</h3>
        <div className="max-h-64 overflow-y-auto">
          {bestSellingProducts.map((product: any) => (
            <div
              key={product.id}
              className="p-4 border-b last:border-b-0 flex justify-between"
            >
              <span className="font-medium">{product.productTitle}</span>
              <span className="text-gray-600">{product.totalQuantitySold} units</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SalesAnalytics;
