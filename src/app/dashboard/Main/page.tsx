'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Tooltip } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, TruckOutlined, SyncOutlined, StarOutlined } from '@ant-design/icons';
import SummaryCard from '@/components/Dashbaord/Card/SummaryCard';
import ConfirmedOrderCard from '@/components/Dashbaord/Card/ConfirmedOrderCard';
import DashboardGraphs from '@/components/Dashbaord/Graph/DashboardGraph';
import CartView from '@/components/Dashbaord/CartView/page';
import { getTotalOrders, getOrderStatusCount, getTodaysOrders } from '@/utils/analytics/orderStatus';

const DashboardPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [confirmedOrders, setConfirmedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [todaysOrders, setTodaysOrders] = useState(0);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      const [total, pending, confirmed, delivered, processing] = await Promise.all([
        getTotalOrders(),
        getOrderStatusCount('Pending'),
        getOrderStatusCount('Confirmed'),
        getOrderStatusCount('Delivered'),
        getOrderStatusCount('Processing'),
      ]);

      const todayCount = await getTodaysOrders();

      setTotalOrders(total);
      setPendingOrders(pending);
      setConfirmedOrders(confirmed);
      setDeliveredOrders(delivered);
      setProcessingOrders(processing);
      setTodaysOrders(todayCount);
    };

    fetchOrderSummary();
  }, []);

  // Order Summary Data with Icons
  const orderSummary = [
    { title: 'Total Orders', value: totalOrders, icon: <ShoppingCartOutlined />, tooltip: 'Total number of orders received' },
    { title: "Today's Orders", value: todaysOrders, icon: <ClockCircleOutlined />, tooltip: 'Orders placed today' },
    { title: 'Pending Orders', value: pendingOrders, icon: <ClockCircleOutlined />, tooltip: 'Orders awaiting confirmation' },
    { title: 'Confirmed Orders', value: confirmedOrders, icon: <CheckCircleOutlined />, tooltip: 'Orders that are confirmed' },
    { title: 'Delivered Orders', value: deliveredOrders, icon: <TruckOutlined />, tooltip: 'Orders successfully delivered' },
    { title: 'Processing Orders', value: processingOrders, icon: <SyncOutlined spin />, tooltip: 'Orders currently being processed' },
  ];

  return (
    <div>
      {/* Section: Order Summary */}
      <Typography.Title level={4} className="mb-4">
        📦 Order Summary
      </Typography.Title>
      <Row gutter={[16, 16]} className="mb-8">
        {orderSummary.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Tooltip title={item.tooltip}>
              <SummaryCard title={item.title} value={item.value} icon={item.icon} />
            </Tooltip>
          </Col>
        ))}
      </Row>

      {/* Section: Repeat Orders */}
      <Typography.Title level={4} className="mb-4">
        🔁 Repeat Orders
      </Typography.Title>
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12}>
          <Tooltip title="Average orders per customer for delivered orders">
            <SummaryCard title="Avg. Order/Customer (Orders Delivered)" value="Null" icon={<ShoppingCartOutlined />} />
          </Tooltip>
        </Col>
        <Col xs={24} sm={12}>
          <Tooltip title="Average orders per customer for placed orders">
            <SummaryCard title="Avg. Order/Customer (Orders Placed)" value="Null" icon={<ShoppingCartOutlined />} />
          </Tooltip>
        </Col>
      </Row>

      {/* Right side: CartView */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col span={24}>
          <CartView />
        </Col>
      </Row>

      {/* Section: Customer Rating */}
      <Typography.Title level={4} className="mb-4">
        ⭐ Customer Rating
      </Typography.Title>
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12}>
          <Tooltip title="Customer ratings for the last 15 days">
            <SummaryCard title="Last 15 Days" value="0 ⭐" icon={<StarOutlined />} />
          </Tooltip>
        </Col>
        <Col xs={24} sm={12}>
          <Tooltip title="Overall lifetime customer ratings">
            <SummaryCard title="Lifetime Ratings" value="0 ⭐" icon={<StarOutlined />} />
          </Tooltip>
        </Col>
      </Row>

   
      {/* Show the Graphs */}
      <DashboardGraphs />
    </div>
  );
};

export default DashboardPage;
