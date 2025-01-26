"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore"; // Import Firestore's real-time listener
import { db } from "@/utils/firbeaseConfig";
import { Typography, Spin, Row, Col, Steps } from "antd";
import { OrderType } from "@/types/orderType";
import OrderDetails from "./OrderDetails";
import OrderItems from "./OrderItems";

const { Step } = Steps;

export default function ViewOrderPage() {
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [securityKey, setSecurityKey] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the securityKey only on the client side
    const key = localStorage.getItem("securityKey");
    if (key) {
      setSecurityKey(key);
    }
  }, []);

  useEffect(() => {
    if (orderId && securityKey) {
      // Set up a Firestore real-time listener for the order document
      const orderDocRef = doc(db, "app_name", securityKey, "orders", orderId);
      const unsubscribe = onSnapshot(orderDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setOrder(docSnapshot.data() as OrderType);
        } else {
          setOrder(null);
        }
        setLoading(false);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [orderId, securityKey]);

  // Define the status steps in order
  const statusSteps = ["Pending", "Confirmed", "Processing", "Dispatched", "Delivered"];
  const currentStep = order ? statusSteps.indexOf(order.status) : 0;

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
    <div>
      {/* Order Status Timeline */}
      <div className="sticky top-0 z-10 rounded-md bg-white">
        <Steps current={currentStep} direction="horizontal">
          {statusSteps.map((status, index) => (
            <Step
              key={index}
              title={status}
              status={
                index < currentStep
                  ? "finish"
                  : index === currentStep
                  ? "process"
                  : "wait"
              }
              description={
                index === currentStep ? (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {order.status}
                  </span>
                ) : null
              }
            />
          ))}
        </Steps>
      </div>

      <Row gutter={[16, 16]} justify="center" className="mt-4">
        {/* Order Details */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <OrderDetails order={order}
            orderId={orderId} 
            currentStatus={order.status} 
          />
        </Col>

        {/* Order Items */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <OrderItems 
            orderDetails={order.orderDetails} 
          
          />
        </Col>
      </Row>
    </div>
  );
}
