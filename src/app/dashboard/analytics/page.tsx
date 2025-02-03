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
        <p>Sales Analytics will be displayed here.</p>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <UserOutlined /> Customer Insights
          </span>
        }
        key="3"
      >
        <p>Customer Insights will be displayed here.</p>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <LineChartOutlined /> Product Performance
          </span>
        }
        key="4"
      >
        <p>Product Performance Analytics will be displayed here.</p>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <span>
            <ClockCircleOutlined /> Time-Based Reports
          </span>
        }
        key="5"
      >
        <p>Time-Based Reports will be displayed here.</p>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Analytics;
