import React from "react";
import { Card, Typography } from "antd";
import { OrderType } from "@/types/orderType";

interface OrderDetailsProps {
  order: OrderType;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="p-4">
      <Card className="shadow-lg">
        <div className="mb-6">
          {/* Highlighted Order ID */}
          <Typography.Title level={3} className="text-blue-600">
            <strong>Order ID:</strong> {order.orderId}
          </Typography.Title>
        </div>
        <div className="mb-4">
          <Typography.Text className="font-semibold">
            <strong>Customer Name:</strong> {order.fullName}
          </Typography.Text>
        </div>
        <div className="mb-4">
          <Typography.Text className="font-semibold">
            <strong>Email:</strong> {order.email}
          </Typography.Text>
        </div>
        <div className="mb-4">
          <Typography.Text className="font-semibold">
            <strong>Phone Number:</strong> {order.phoneNumber}
          </Typography.Text>
        </div>
        <div className="mb-4">
          <Typography.Text className="font-semibold">
            <strong>Address:</strong> {`${order.houseNumber}, ${order.apartment}, ${order.address}, ${order.city}, ${order.state}, ${order.country}`}
          </Typography.Text>
        </div>
        <div className="mb-4">
          <Typography.Text className="font-semibold">
            <strong>Order Status:</strong> {order.status}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text className="font-semibold">
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
