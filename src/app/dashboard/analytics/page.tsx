"use client";
import React from "react";
import { Tabs } from "antd";
import {
  BarChartOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import OrderStatus from "@/components/Analytics/OrderStatus/Page";
import SalesAnalytics from "@/components/Analytics/SalesAnalytics/page";
import CustomerInsights from "@/components/Analytics/CustomerInsights/page";
import ProductPerformance from "@/components/Analytics/ProductPerformance/page";

const Analytics = () => {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane
        tab={
          <span>
            <ShoppingCartOutlined /> Order Status
          </span>
        }
        key="1"
      >
         <OrderStatus/>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <BarChartOutlined /> Sales Analytics
          </span>
        }
        key="2"
      > 
                  <SalesAnalytics/>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <UserOutlined /> Customer Insights
          </span>
        }
        key="3"
      >
        <CustomerInsights/>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <LineChartOutlined /> Product Performance
          </span>
        }
        key="4"
      >
         <ProductPerformance/>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <ClockCircleOutlined /> Time-Based Reports
          </span>
        }
        key="5"
      >
        <p>Time-Based Reports will be displayed here. Currently we are working on it...</p>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Analytics;
