"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firbeaseConfig";
import { Typography, Spin, Steps, Row, Col, Card } from "antd";
import { OrderType } from "@/types/orderType";
import OrderItems from "../../order-details/[orderId]/OrderItems";
import ReturnOrderDetails from "./ReturnOrderDetails";

const { Step } = Steps;
const { Title, Text } = Typography;

export default function ReturnOrderView() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [securityKey, setSecurityKey] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("securityKey");
    if (key) {
      setSecurityKey(key);
    }
  }, []);

  useEffect(() => {
    if (orderId && securityKey) {
      const orderDocRef = doc(db, "app_name", securityKey, "orders", orderId);
      const unsubscribe = onSnapshot(orderDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setOrder(docSnapshot.data() as OrderType);
        } else {
          setOrder(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [orderId, securityKey]);

  const returnSteps = [
    "RequestReturned",
    "AcceptReturned",
    "RejectReturned",
    "Returned",
    "RequestRefund",
    "AcceptedRefund",
    "RejectedRefund",
    "Refunded",
  ];

  const currentStep = order ? returnSteps.indexOf(order.status) : 0;

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
        <Typography.Text>
          No return order found for the given ID.
        </Typography.Text>
      </div>
    );
  }

  return (
    <div >
      {/* Return Status Timeline */}
      <Card className="mb-2 shadow-md border border-gray-300 bg-white ">
        <Steps current={currentStep} direction="horizontal" responsive>
          {returnSteps.map((status, index) => (
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
                  <span className="text-blue-600 font-bold">
                    {order.status}
                  </span>
                ) : null
              }
            />
          ))}
        </Steps>
      </Card>

      {/* Order Details and Return Info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <ReturnOrderDetails
            order={order}
            orderId={orderId || ""}
            currentStatus={order.status}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Card className="shadow-md border border-gray-300 bg-white">
            {order.productReturnVideo && (
              <div className="mb-4 flex ">
                <video controls className="w-[300px] h-[200px] rounded-md">
                  <source src={order.productReturnVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <Title level={4} className="mb-2 text-gray-800">
              Order Return Reasons:
            </Title>
            <Text className="text-gray-600">
              {order.returnReason || "No reason provided."}
            </Text>
              <OrderItems orderDetails={order.orderDetails} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
