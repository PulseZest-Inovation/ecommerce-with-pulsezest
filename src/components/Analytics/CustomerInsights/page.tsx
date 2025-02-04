import React, { useEffect, useState } from "react";
import { Tooltip, Spin } from "antd";
import { getTotalCustomers, getTopCustomersByOrders, getCustomerLifetimeValue, getRepeatCustomers, getNewCustomersByDate, getCustomerOrderFrequency } from "@/utils/analytics/CustomerInsights";
import StatsCard from "../StatsCard";

interface TopCustomer {
  customerId: string;
  orderCount: number;
}

interface CustomerStats {
  totalCustomers: number;
  repeatCustomers: number;
  orderFrequency: number;
  newCustomers: number;
  topCustomers: TopCustomer[];
  lifetimeValues: Record<string, number>;
}

export default function CustomerInsights() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    repeatCustomers: 0,
    orderFrequency: 0,
    newCustomers: 0,
    topCustomers: [],
    lifetimeValues: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const totalCustomers = await getTotalCustomers();
      const repeatCustomers = await getRepeatCustomers();
      const orderFrequency = await getCustomerOrderFrequency();
      const newCustomers = await getNewCustomersByDate("last30days");
      const topCustomers = await getTopCustomersByOrders();
      const lifetimeValues = await getCustomerLifetimeValue();

      setStats({
        totalCustomers,
        repeatCustomers,
        orderFrequency,
        newCustomers,
        topCustomers,
        lifetimeValues,
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Customer Insights</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          <Tooltip title="Total number of unique customers registered on the platform.">
            <StatsCard title="Total Customers" value={stats.totalCustomers} />
          </Tooltip>
          <Tooltip title="Number of customers who have made more than one purchase.">
            <StatsCard title="Repeat Customers" value={stats.repeatCustomers} />
          </Tooltip>
          <Tooltip title="Average number of orders placed per customer.">
            <StatsCard title="Avg. Order Frequency" value={stats.orderFrequency.toFixed(2)} />
          </Tooltip>
          <Tooltip title="Number of new customers who signed up in the last 30 days.">
            <StatsCard title="New Customers (Last 30 Days)" value={stats.newCustomers} />
          </Tooltip>
        </div>
      )}

      {!loading && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Customers by Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topCustomers.map((customer, index) => (
              <Tooltip key={index} title={`Customer ${customer.customerId} has placed ${customer.orderCount} orders.`}>
                <StatsCard title={`Customer ID: ${customer.customerId}`} value={`Orders: ${customer.orderCount}`} />
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
