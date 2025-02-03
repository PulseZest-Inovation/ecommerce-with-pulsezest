import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { OrderType } from "@/types/orderType";
import { Timestamp } from "firebase/firestore";


let cachedOrders: OrderType[] | null = null;

// Function to fetch orders once and cache them
const fetchOrders = async () => {
  if (!cachedOrders) {
    cachedOrders = await getAllDocsFromCollection<OrderType>("orders");
  }
  return cachedOrders;
};

// Get total orders
export const getTotalOrders = async () => {
  const orders = await fetchOrders();
  return orders.length;
};

// Get order count by status
export const getOrderStatusCount = async (status: string) => {
  try {
    const orders = await fetchOrders();
    return orders.filter((order) => order.status === status).length;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return 0;
  }
};

// Get order trends (group orders by date)
export const getOrdersTrend = async () => {
    try {
      const orders = await fetchOrders();
  
      const orderTrends: Record<string, { count: number; orders: OrderType[] }> = {}; // Store date-wise count and orders
  
      orders.forEach((order) => {
        if (order.createdAt instanceof Timestamp) {
          const orderDate = order.createdAt.toDate().toISOString().split("T")[0]; // Format as YYYY-MM-DD
          if (!orderTrends[orderDate]) {
            orderTrends[orderDate] = { count: 0, orders: [] };
          }
          orderTrends[orderDate].count += 1;
          orderTrends[orderDate].orders.push(order); // Store the order details
        }
      });
  
      return Object.entries(orderTrends).map(([date, { count, orders }]) => ({
        date,
        count,
        orders,
      }));
    } catch (error) {
      console.error("Error fetching order trends:", error);
      return [];
    }
  };
  
  