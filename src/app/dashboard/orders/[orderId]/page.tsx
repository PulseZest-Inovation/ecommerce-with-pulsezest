"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { Typography, Spin, Row, Col } from "antd";
import { OrderType } from "@/types/orderType"; 
import OrderDetails from "./OrderDetails";
import OrderItems from "./OrderItems";

export default function ViewOrderPage() {
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        setLoading(true);
        const data = await getDataByDocName<OrderType>("orders", orderId);
        setOrder(data);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography.Text>No order found for the given ID.</Typography.Text>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Row gutter={[16, 16]} justify="center">
        {/* Order Details */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <OrderDetails order={order} />
        </Col>
        
        {/* Order Items */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <OrderItems orderDetails={order.orderDetails} />
        </Col>
      </Row>
    </div>
  );
}
