// components/OrderStatusFilter.tsx
import React from "react";
import { Select, Space, Typography, Card, Row, Col } from "antd";
import { OrderType } from "@/types/orderType";

const { Option } = Select;

interface OrderStatusFilterProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  orders: OrderType[];
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ statusFilter, setStatusFilter, orders }) => {
  const statusColors: Record<OrderType["status"], string> = {
    Pending: "orange",
    Confirmed: "blue",
    Processing: "purple",
    Dispatched: "gold",
    Delivered: "green",
    AcceptedRefund:"red",
    AcceptReturned: 'red',
    Refunded: 'red',
    RejectedRefund: 'red',
    RejectReturned: 'red',
    RequestRefund: 'red',
    RequestReturned: 'red',
    Returned: 'red'
  };

  const handleStatusChange = (value: string | null) => {
    setStatusFilter(value);
  };

  // Filter orders based on the selected status
  const filteredOrders = statusFilter ? orders.filter(order => order.status === statusFilter) : orders;
  const totalFiltered = filteredOrders.length;

  return (
    <Space style={{ marginBottom: 16 }} className="flex justify-evenly">
      {/* Filter Dropdown */}
      <Select
        placeholder="Filter by Status"
        style={{ width: 200 }}
        allowClear
        value={statusFilter}
        onChange={handleStatusChange}
      >
        {Object.keys(statusColors).map((status) => (
          <Option key={status} value={status}>
            {status}
          </Option>
        ))}
      </Select>

      {/* Display Total Filtered Orders in a Horizontal Card */}
      {statusFilter && (
        <Card
          style={{
            width: 300,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 20,
            padding: '10px',
          }}
        >
          <Row gutter={16}>
            <Col>
              <Typography.Text strong>Total {statusFilter} Orders:</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {totalFiltered}
              </Typography.Title>
            </Col>
          </Row>
        </Card>
      )}
    </Space>
  );
};

export default OrderStatusFilter;
