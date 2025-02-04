'use client'
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Tooltip } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { getTotalRevenue, getBestSellingProducts, getSalesByDate } from "@/utils/analytics/salesAnalytics";
import { getTotalCustomers, getRepeatCustomers } from "@/utils/analytics/CustomerInsights";
import { getTotalOrders, getOrderStatusCount, getTodaysOrders, getOrdersTrend } from "@/utils/analytics/orderStatus"; // Import the order analytics functions

interface BestSellingProduct {
  name: string;
  totalQuantitySold: number;
}

interface SalesData {
  date: string;
  totalRevenue: number;
}

interface OrderTrendData {
  date: string;
  count: number;
}

export default function DashboardPage() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [repeatCustomers, setRepeatCustomers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [todaysOrders, setTodaysOrders] = useState<number>(0);
  const [orderTrends, setOrderTrends] = useState<OrderTrendData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics data
        const revenue = await getTotalRevenue();
        setTotalRevenue(revenue);

        const bestSellingProducts = await getBestSellingProducts();
        setBestSelling(
          bestSellingProducts.map((product) => ({
            name: product.productTitle, // Mapping productTitle to name
            totalQuantitySold: product.totalQuantitySold,
          }))
        );

        const sales = await getSalesByDate("Delivered", "last7days");
        setSalesData(sales);

        setTotalCustomers(await getTotalCustomers());
        setRepeatCustomers(await getRepeatCustomers());

        // Fetch order data
        setTotalOrders(await getTotalOrders());
        setPendingOrders(await getOrderStatusCount("Pending"));
        setTodaysOrders(await getTodaysOrders());
        setOrderTrends(await getOrdersTrend());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">

<Row gutter={[16, 16]} >
        <Col span={8}>
          <Card>
            <Tooltip title="The total number of orders placed in your store">
              <Statistic title="Total Orders" value={totalOrders} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="The number of orders that are still pending">
              <Statistic title="Pending Orders" value={pendingOrders} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="The number of orders placed today">
              <Statistic title="Today's Orders" value={todaysOrders} />
            </Tooltip>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={8}>
          <Card>
            <Tooltip title="Total revenue from all orders">
              <Statistic title="Total Revenue" value={totalRevenue} prefix="₹" />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="The total number of customers who have made a purchase">
              <Statistic title="Total Customers" value={totalCustomers} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="The number of customers who made repeat purchases">
              <Statistic title="Repeat Customers" value={repeatCustomers} />
            </Tooltip>
          </Card>
        </Col>
      </Row>

    

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Best Selling Products">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bestSelling}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="totalQuantitySold" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Sales in the Last 7 Days">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="totalRevenue" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Order Trends (Last 7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#ff4d4f" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

    </div>
  );
}
