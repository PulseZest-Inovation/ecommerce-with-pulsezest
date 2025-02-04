import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { startOfDay, endOfDay, subDays, subMonths } from "date-fns";

// Define types
interface OrderType {
  id: string;
  orderDetails: { price: number; quantity: number }[];
  createdAt: Timestamp;
}

interface Customer {
  id: string;
  createdAt: Timestamp;
}

// Fetch all customers and their orders once
const fetchCustomersWithOrders = async () => {
  const customers = await getAllDocsFromCollection<Customer>("customers");
  const customerOrders: Record<string, OrderType[]> = {};

  await Promise.all(
    customers.map(async (customer) => {
      const orders = await getAllDocsFromCollection<OrderType>(`customers/${customer.id}/orders`);
      customerOrders[customer.id] = orders;
    })
  );

  return { customers, customerOrders };
};

// Get Total Customers Count
export const getTotalCustomers = async () => {
  const { customers } = await fetchCustomersWithOrders();
  return customers.length;
};

// Get Top Customers by Orders
export const getTopCustomersByOrders = async () => {
  const { customerOrders } = await fetchCustomersWithOrders();
  return Object.entries(customerOrders)
    .map(([customerId, orders]) => ({
      customerId,
      orderCount: orders.length,
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);
};

// Get Customer Lifetime Value (CLV)
export const getCustomerLifetimeValue = async () => {
  const { customerOrders } = await fetchCustomersWithOrders();
  const customerRevenue: Record<string, number> = {};

  Object.entries(customerOrders).forEach(([customerId, orders]) => {
    customerRevenue[customerId] = orders.reduce((total, order) => {
      const orderTotal = order.orderDetails.reduce(
        (sum, orderItem) => sum + orderItem.price * orderItem.quantity,
        0
      );
      return total + orderTotal;
    }, 0);
  });

  return customerRevenue;
};

// Get Repeat Customers Count
export const getRepeatCustomers = async () => {
  const { customerOrders } = await fetchCustomersWithOrders();
  return Object.values(customerOrders).filter((orders) => orders.length > 1).length;
};

// Get New Customers Over Time
export const getNewCustomersByDate = async (dateRange: "last7days" | "last30days" | "lastMonth") => {
  const { customers } = await fetchCustomersWithOrders();
  let startDate: Date | null = null;
  const now = new Date();

  if (dateRange === "last7days") startDate = subDays(now, 7);
  else if (dateRange === "last30days") startDate = subDays(now, 30);
  else if (dateRange === "lastMonth") startDate = subMonths(now, 1);

  return customers.filter((customer) => {
    const createdAt = customer.createdAt instanceof Timestamp ? customer.createdAt.toDate() : new Date();
    return startDate ? createdAt >= startOfDay(startDate) && createdAt <= endOfDay(now) : true;
  }).length;
};

// Get Customer Order Frequency
export const getCustomerOrderFrequency = async () => {
  const { customers, customerOrders } = await fetchCustomersWithOrders();
  const totalOrders = Object.values(customerOrders).reduce((sum, orders) => sum + orders.length, 0);
  return customers.length > 0 ? totalOrders / customers.length : 0;
};
