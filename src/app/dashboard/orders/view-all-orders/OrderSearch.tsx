"use client";
import React from "react";
import { Input, Space } from "antd";
import { OrderType } from "@/types/orderType";

interface OrderSearchProps {
  searchText: string;
  setSearchText: (text: string) => void;
  setFilteredOrders: (orders: OrderType[]) => void;
  orders: OrderType[];
}

const OrderSearch: React.FC<OrderSearchProps> = ({ searchText, setSearchText, setFilteredOrders, orders }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = orders.filter((order) => {
      const orderId = order.orderId?.toLowerCase() || "";
      const phoneNumber = order.phoneNumber?.toLowerCase() || "";
      const email = order.email?.toLowerCase() || "";

      const orderDetailsMatch = order.orderDetails?.some((item) =>
        item.name?.toLowerCase().includes(value)
      );

      return (
        orderId.includes(value) ||
        phoneNumber.includes(value) ||
        email.includes(value) ||
        orderDetailsMatch
      );
    });

    setFilteredOrders(filtered);
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search by Order ID, Phone Number, Product Title, or Email"
        value={searchText}
        onChange={handleSearch}
        allowClear
        style={{ width: 400 }}
      />
    </Space>
  );
};

export default OrderSearch;
