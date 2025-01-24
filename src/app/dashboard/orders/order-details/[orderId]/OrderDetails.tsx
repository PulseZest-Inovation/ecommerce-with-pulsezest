"use client";
import React, { useState } from "react";
import { Card, Typography, Select, Button, message } from "antd"; // Added Button import
import { OrderType } from "@/types/orderType";
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";

interface OrderDetailsProps {
  order: OrderType;
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  "Pending",
  "Confirmed",
  "Processing",
  "Dispatched",
  "Delivered",
];

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, orderId, currentStatus }) => {
  const [status, setStatus] = useState<string>(order.status);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle status change in the select dropdown
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus); // Update the local state with the new status
  };

  // Handle status update to Firestore
  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = { status };
      const success = await updateDocWithCustomId("orders", orderId, updatedData);

      if (success) {
        message.success("Order status updated successfully!");
      } else {
        message.error("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("An error occurred while updating status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
    

      {/* Order Information Card */}
      <Card className="shadow-lg">
        {/* Highlighted Order ID */}
        <div className="mb-6">
          <Typography.Title level={3} className="text-blue-600">
            <strong>Order ID:</strong> {order.orderId}
          </Typography.Title>
        </div>

          {/* Status Update Section */}
      <Card className=" shadow-lg bg-blue-50 border border-blue-200">
        <Typography.Title level={5} className="text-blue-600 mb-2">
          Update Order Status
        </Typography.Title>
        <Typography.Text className="text-gray-700 mb-2 block">
          Current Status: <strong>{currentStatus}</strong>
        </Typography.Text>
        <div className="flex items-center gap-4">
          <Select
            value={status}
            onChange={handleStatusChange}
            className="w-[200px]"
            options={statusOptions.map((option) => ({ label: option, value: option }))}
          />
          <Button
            type="primary"
            loading={loading}
            onClick={handleStatusUpdate}
            disabled={status === currentStatus} // Disable if no change
          >
            Update Status
          </Button>
        </div>
      </Card>

        {/* Order Details */}
        <div className="pt-2">
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
            <strong>Order Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
