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
import SearchConsole from "@/components/Analytics/GoogleSearchConsole/page";
import { GoogleSearchConsole } from "@/components/Icons/page";
import SessionProviderWrapper from "../setting/search-console/SessionProviderWrapper";

const Analytics = () => {
  const items = [

    {
      key: "0",
      label: (
        <span className="flex">
          <GoogleSearchConsole /> <p className="pl-2">Google Search Console</p>
        </span>
      ),
      children: <SessionProviderWrapper>
        <SearchConsole/>
      </SessionProviderWrapper>,
    },

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

  return <Tabs defaultActiveKey="0" items={items} />;
};

export default Analytics;
