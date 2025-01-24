import React from "react";
import { Card, Typography } from "antd";
import { CartItem } from "@/types/orderType";

interface OrderItemsProps {
  orderDetails: CartItem[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ orderDetails }) => {
  return (
    <div className="p-4">
      <Typography.Title level={3}>Order Items</Typography.Title>
      {orderDetails.map((item) => (
        <Card key={item.id} className="mb-4 shadow-lg">
          <div className="flex mb-4">
            {/* Item Image */}
            <img
              src={item.image}
              alt={item.name}
              className="max-w-[120px] rounded-md mr-4"
            />
            <div>
              {/* Item Name */}
              <Typography.Text className="text-lg font-semibold">
                <strong>Item Name:</strong> {item.name}
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
