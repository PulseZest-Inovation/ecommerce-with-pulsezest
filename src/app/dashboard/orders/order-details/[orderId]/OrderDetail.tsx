"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Select, Button, message, Divider } from "antd";
import { OrderType } from "@/types/orderType";
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";
import { getAppData } from "@/services/getApp";
import { AppDataType } from "@/types/AppData";
import { EmailType } from "@/types/EmailType";
import { fetchEmailDetails } from "@/utils/getEmailSetting";
import { handleConfirmedStatusUpdate } from "@/utils/shiprocket/createOrder";

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
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailDetails, setEmailDetails] = useState<EmailType | null>(null);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = { status };
  
      // Check if the status is being updated to "Confirmed"
      if (status === "Confirmed" && currentStatus !== "Confirmed") {
        const success = await handleConfirmedStatusUpdate(order);  // Call the order creation
        if (!success) {
          throw new Error("Failed to create Shiprocket order");  // If creation fails, throw error
        }
        // Proceed to update status only if the order creation was successful
        setStatus("Confirmed");
      }
  
      const success = await updateDocWithCustomId(
        "orders",
        orderId,
        updatedData
      );
  
      const updateCustomerOrderStatus = await updateDocWithCustomId(
        `customers/${order.customerId}/orders`,
        orderId,
        updatedData
      );
  
      const emailRequestBody = {
        orderDetails: {
          orderId,
          customerEmail: order.email,
          totalAmount: order.totalAmount,
          cartItems: order.orderDetails,
          fullName: order.fullName,
          phoneNumber: order.phoneNumber,
          address: order.address,
        },
        emailDetails: emailDetails,
        emailType: status, // Ensure email type logic matches
      };
  
      const emailResponse = await fetch(
        `http://localhost:3001/api/send-email`, // Adjust with the correct URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailRequestBody),
        }
      );
  
      console.log(await emailResponse.json());
  
      if (success && updateCustomerOrderStatus && emailResponse.ok) {
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
  
  

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const appKey = localStorage.getItem("securityKey");
        if (!appKey) {
          console.error("No security key found in localStorage!");
          return;
        }
        const appData = await getAppData<AppDataType>("app_name", appKey);
        setAppData(appData);
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };

    const fetchEmailData = async () => {
      try {
        const emailData = await fetchEmailDetails();
        setEmailDetails(emailData);
      } catch (error) {
        console.error("Error fetching email details:", error);
      }
    };

    fetchAppData();
    fetchEmailData();
  }, []);

  return (
    <div className="p-4 sticky top-3">
      <Button onClick={() => handleConfirmedStatusUpdate(order)}>
        Click me
      </Button>

      <Card className="shadow-md border border-gray-300 bg-white">
        {/* Order ID */}
        <div className="mb-4">
          <Title level={4} className="text-blue-600">
            Order ID: {order.orderId}
          </Title>
        </div>

        {/* Status Update Section */}
        <Card className="mb-6 shadow-sm border bg-blue-50">
          <Title level={5} className="text-blue-600">Update Order Status</Title>
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
            <Text className="block mb-2 text-green-500">
              <strong>Order Type:</strong> {order.type}
            </Text>
          )}

          {order.data?.data.paymentInstrument?.accountType && (
            <Text className="block mb-2 text-gray-600">
              <strong>Account Type:</strong>{" "}
              {order.data.data.paymentInstrument.accountType}
            </Text>
          )}

          {order.data?.data.paymentInstrument?.upiTransactionId && (
            <Text className="block mb-2 text-gray-600">
              <strong>UPI Transaction ID:</strong>{" "}
              {order.data.data.paymentInstrument.upiTransactionId}
            </Text>
          )}

          {order.data?.data.transactionId && (
            <Text className="block mb-2 text-gray-600">
              <strong>Transaction ID:</strong> {order.data.data.transactionId}
            </Text>
          )}

          {order.data?.data.paymentInstrument?.type && (
            <Text className="block mb-2 text-gray-600">
              <strong>Payment Type:</strong> {order.data.data.paymentInstrument.type}
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
