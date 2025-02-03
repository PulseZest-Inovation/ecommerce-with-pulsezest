import React from "react";
import { Card } from "antd";

interface StatsCardProps {
  title: string;
  value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <Card bordered style={{ textAlign: "center", width: 250 }}>
      <h3>{title}</h3>
      <h2 style={{ fontSize: "2rem", color: "#1890ff" }}>{value}</h2>
    </Card>
  );
};

export default StatsCard;
