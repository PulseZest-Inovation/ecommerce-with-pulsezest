import React from "react";
import { Card, Typography } from "antd";
import { CartItem } from "@/types/orderType";

interface OrderItemsProps {
  orderDetails: CartItem[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ orderDetails }) => {
  return (
    <div className="p-1">
      {orderDetails.map((item) => (
        <Card key={item.id} className="mb-4 shadow-lg">
          <div className="flex mb-4">
            {/* Item Image */}
            <img
              src={item.image}
              alt={item.productTitle}
              className="max-w-[120px] rounded-md mr-4"
            />
            <div>
              {/* Item Name */}
              <Typography.Text className="text-lg font-semibold">
                <strong>Item Name:</strong> {item.productTitle}
              </Typography.Text>
              <br />
              <Typography.Text className="text-lg font-semibold">
                <strong>Ready to Wear:</strong> {item.isReadyToWear ? "Yes" : "No"}
              </Typography.Text>
              <br />

              {/* Ready Data (if available) */}
              {item.isReadyToWear && item.readyData && item.readyData.length > 0 && (
                <div className="mt-2">
                  <Typography.Text className="text-md font-semibold">
                    <strong>Ready Data:</strong>
                  </Typography.Text>
                  {item.readyData.map((readyData, index) => (
                    <div key={index} className="ml-2">
                      <Typography.Text>🟢 Hip: {readyData.hip} cm</Typography.Text>
                      <br />
                      <Typography.Text>🟢 Length: {readyData.length} cm</Typography.Text>
                      <br />
                      <Typography.Text>🟢 Waist: {readyData.waist} cm</Typography.Text>
                      <br />
                    </div>
                  ))}
                </div>
              )}

              <Typography.Text className="text-lg font-semibold">
                <strong>Pre Plated:</strong> {item.isPrePlated ? "Yes" : "No"}
              </Typography.Text>
              <br />

              {/* Item Price */}
              <Typography.Text className="text-lg font-semibold">
                <strong>Price:</strong> ₹{item.price}
              </Typography.Text>
              <br />
              {/* Item Quantity */}
              <Typography.Text className="text-lg font-semibold">
                <strong>Quantity:</strong> {item.quantity}
              </Typography.Text>
              <br />
              {/* Total Price */}
              <Typography.Text className="text-lg font-semibold text-green-600">
                <strong>Total Price:</strong> ₹{item.price * item.quantity}
              </Typography.Text>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderItems;
