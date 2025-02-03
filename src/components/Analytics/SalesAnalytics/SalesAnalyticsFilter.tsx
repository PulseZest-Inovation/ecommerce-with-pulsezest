import React from "react";
import { Row, Col, Select, Typography, Space } from "antd";

interface SalesAnalyticsFilterProps {
  orderStatus: "Confirmed" | "Pending" | "Delivered" | "Processing" | undefined;
  setOrderStatus: React.Dispatch<React.SetStateAction<"Confirmed" | "Pending" | "Delivered" | "Processing" | undefined>>;
  dateRange: "last7days" | "last30days" | "lastWeek" | "lastMonth" | "totalRevenue" | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<"last7days" | "last30days" | "lastWeek" | "lastMonth" | "totalRevenue" | undefined>>;
}

const { Option } = Select;

const SalesAnalyticsFilter: React.FC<SalesAnalyticsFilterProps> = ({
  orderStatus,
  setOrderStatus,
  dateRange,
  setDateRange,
}) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
      <Col>
        <Space>
          <Typography.Text>Status:</Typography.Text>
          <Select
            value={orderStatus}
            onChange={(value) => setOrderStatus(value as "Confirmed" | "Pending" | "Delivered" | "Processing")}
            style={{ width: 150 }}
          >
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Processing">Processing</Option>
          </Select>
        </Space>
      </Col>

      <Col>
        <Space>
          <Typography.Text>Date Range:</Typography.Text>
          <Select
            value={dateRange}
            onChange={(value) => setDateRange(value as "last7days" | "last30days" | "lastWeek" | "lastMonth" | "totalRevenue")}
            style={{ width: 180 }}
          >
            <Option value="totalRevenue">Total Revenue</Option>
            <Option value="last7days">Last 7 Days</Option>
            <Option value="last30days">Last 30 Days</Option>
            <Option value="lastWeek">Last Week</Option>
            <Option value="lastMonth">Last Month</Option>
          </Select>
        </Space>
      </Col>
    </Row>
  );
};

export default SalesAnalyticsFilter;
