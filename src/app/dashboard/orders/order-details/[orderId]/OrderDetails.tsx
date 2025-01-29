"use client";
import React, { useState } from "react";
import { Card, Typography, Select, Button, message, Divider } from "antd";
import { OrderType } from "@/types/orderType";
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";

const { Title, Text } = Typography;

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

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  orderId,
  currentStatus,
}) => {
  const [status, setStatus] = useState<string>(order.status);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = { status };
      const success: boolean = await updateDocWithCustomId(
        "orders",
        orderId,
        updatedData
      );


      const updaetCustomerorderStatus: boolean = await updateDocWithCustomId(
        `customers/${order.customerId}/orders`,
        orderId,
        updatedData
      );


      if (success && updaetCustomerorderStatus) {
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
    <div className="p-4 sticky top-3">
      <Card className="shadow-md border border-gray-300 bg-white">
        {/* Order ID */}
        <div className="mb-4">
          <Title level={4} className="text-blue-600">
            Order ID: {order.orderId}
          </Title>
        </div>

        {/* Status Update Section */}
        <Card className="mb-6 shadow-sm border bg-blue-50">
          <Title level={5} className="text-blue-600">
            Update Order Status
          </Title>
          <Text className="block text-gray-600 mb-2">
            Current Status: <strong>{currentStatus}</strong>
          </Text>
          <div className="flex items-center gap-4">
            <Select
              value={status}
              onChange={handleStatusChange}
              className="w-[200px]"
              options={statusOptions.map((option) => ({
                label: option,
                value: option,
              }))}
            />
            <Button
              type="primary"
              loading={loading}
              onClick={handleStatusUpdate}
              disabled={status === currentStatus}
            >
              Update Status
            </Button>
          </div>
        </Card>

        {/* Order Details */}
        <div>
            {order.type && (
              <div>
               <Text className="block mb-2 text-green-500">
                <strong>Order Type:</strong>  {order.type}
              </Text>
              </div>
            )}
              
        
          {order.data?.data.paymentInstrument.accountType && (
            <Text className="block mb-2 text-gray-600">
              <strong>Account Type:</strong>{" "}
              {order.data.data.paymentInstrument.accountType}
            </Text>
          )}

          {order.data?.data.paymentInstrument.upiTransactionId && (
            <Text className="block mb-2 text-gray-600">
              <strong>UPI Transaction ID:</strong>{" "}
              {order.data.data.paymentInstrument.upiTransactionId}
            </Text>
          )}

          {order.data?.data.transactionId && (
            <Text className="block mb-2 text-gray-600">
              <strong>Transaction ID:</strong>{" "}
              {order.data.data.transactionId}
            </Text>
          )}

          {order.data?.data.paymentInstrument.type && (
            <Text className="block mb-2 text-gray-600">
              <strong>Payment Type:</strong>{" "}
              {order.data.data.paymentInstrument.type}
            </Text>
          )}
        </div>

        <Divider />

        {/* Customer Details */}
        {order.fullName && (
          <Text className="block mb-2">
            <strong>Customer Name:</strong> {order.fullName}
          </Text>
        )}
        {order.email && (
          <Text className="block mb-2">
            <strong>Email:</strong> {order.email}
          </Text>
        )}
        {order.phoneNumber && (
          <Text className="block mb-2">
            <strong>Phone Number:</strong> {order.phoneNumber}
          </Text>
        )}
        {order.houseNumber && order.address && order.city && (
          <Text className="block mb-2">
            <strong>Address:</strong>{" "}
            {`${order.houseNumber || ""}, ${order.apartment || ""}, ${
              order.address
            }, ${order.city}, ${order.state || ""}, ${order.country || ""}`}
          </Text>
        )}
        {order.createdAt?.seconds && (
          <Text className="block mb-2">
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
          </Text>
        )}
      </Card>
    </div>
  );
};

export default OrderDetails;
