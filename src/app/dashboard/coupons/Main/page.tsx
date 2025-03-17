"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Row, Col, Statistic, Tooltip, Button, Drawer } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { getTotalRevenue, getBestSellingProducts, getSalesByDate } from "@/utils/analytics/salesAnalytics";
import { getTotalCustomers, getRepeatCustomers } from "@/utils/analytics/CustomerInsights";
import { getTotalOrders, getOrderStatusCount, getTodaysOrders, getOrdersTrend } from "@/utils/analytics/orderStatus";
import CartView from "@/components/Dashbaord/CartView/page";
import { ShoppingCartOutlined } from "@mui/icons-material";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTotalRevenue(await getTotalRevenue());

        const bestSellingProducts = await getBestSellingProducts();
        setBestSelling(
          bestSellingProducts.map((product) => ({
            name: product.productTitle,
            totalQuantitySold: product.totalQuantitySold,
          }))
        );

        setSalesData(await getSalesByDate("Delivered", "last7days"));
        setTotalCustomers(await getTotalCustomers());
        setRepeatCustomers(await getRepeatCustomers());
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
    <div className="p-6 relative">
      {/* Cart Button in Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400 rounded-full opacity-50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => setOpen(true)}
          className="bg-blue-600 p-3 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        />
      </div>

      {/* Order Statistics */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Tooltip title="Total number of orders placed in your store">
              <Statistic title="Total Orders" value={totalOrders} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="Number of orders that are still pending">
              <Statistic title="Pending Orders" value={pendingOrders} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="Orders placed today">
              <Statistic title="Today's Orders" value={todaysOrders} />
            </Tooltip>
          </Card>
        </Col>
      </Row>

      {/* Revenue & Customer Insights */}
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
            <Tooltip title="Total number of customers">
              <Statistic title="Total Customers" value={totalCustomers} />
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Tooltip title="Number of repeat customers">
              <Statistic title="Repeat Customers" value={repeatCustomers} />
            </Tooltip>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
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

      {/* Drawer for Cart View */}
      <Drawer
        title="Dashboard Menu"
        placement="right"
        width={450}
        onClose={() => setOpen(false)}
        open={open}
      >
        <CartView />
      </Drawer>
    </div>
  );
}
