"use client";
import React from "react";
import { Tabs } from "antd";
import {
  BarChartOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  UserOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import OrderStatus from "@/components/Analytics/OrderStatus/Page";
import SalesAnalytics from "@/components/Analytics/SalesAnalytics/page";
import CustomerInsights from "@/components/Analytics/CustomerInsights/page";
import ProductPerformance from "@/components/Analytics/ProductPerformance/page";
import MetaDashboard from "@/components/Analytics/MetaDashboard/page";

const Analytics = () => {
  const items = [
    {
      key: "1",
      label: (
        <span>
          <ShoppingCartOutlined /> Order Status
        </span>
      ),
      children: <OrderStatus />,
    },
    {
      key: "2",
      label: (
        <span>
          <BarChartOutlined /> Sales Analytics
        </span>
      ),
      children: <SalesAnalytics />,
    },
    {
      key: "3",
      label: (
        <span>
          <UserOutlined /> Customer Insights
        </span>
      ),
      children: <CustomerInsights />,
    },
    {
      key: "4",
      label: (
        <span>
          <LineChartOutlined /> Product Performance
        </span>
      ),
      children: <ProductPerformance />,
    },
    {
      key: "5",
      label: (
        <span>
          <ClockCircleOutlined /> Time-Based Reports
        </span>
      ),
      children: (
        <p>Time-Based Reports will be displayed here. Currently, we are working on it...</p>
      ),
    },
    {
      key: "6",
      label: (
        <span>
          <GlobalOutlined /> Meta Dashboard
        </span>
      ),
      children: <MetaDashboard />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default Analytics;
