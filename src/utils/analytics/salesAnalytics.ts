import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { OrderType } from "@/types/orderType";
import { startOfDay, endOfDay, subDays, subMonths } from "date-fns"; // Add date-fns for date manipulation
import { Product } from "@/types/ProductType";
import { Timestamp } from "firebase/firestore";

// Fetch all products
const fetchProducts = async () => {
  return await getAllDocsFromCollection<Product>("products");
};

// Calculate Total Revenue
export const getTotalRevenue = async (status?: "Pending" | "Confirmed" | "Delivered" | "Processing") => {
    const orders = await getAllDocsFromCollection<OrderType>("orders");
    
    // Filter orders based on status if provided
    const filteredOrders = status ? orders.filter(order => order.status === status) : orders;
    
    return filteredOrders.reduce((total, order) => {
      const orderTotal = order.orderDetails.reduce((sum, orderItem) => {
        const productPrice = orderItem.price; // Correctly referencing the 'price' field
        return sum + productPrice * orderItem.quantity;
      }, 0);
      return total + orderTotal;
    }, 0);
  };
  
  

// Get Best Selling Products (based on total sales)
export const getBestSellingProducts = async () => {
  const products = await fetchProducts(); // Fetch all products
  const orders = await getAllDocsFromCollection<OrderType>("orders"); // Fetch all orders
  
  // Initialize a map to store total quantity sold for each product
  const productSales: Record<string, number> = {};

  // Calculate total quantity sold for each product based on order details
  orders.forEach((order) => {
    order.orderDetails.forEach((orderItem) => {
      const productId = orderItem.productId;
      const quantitySold = orderItem.quantity;

      // Add to the total quantity sold for the product
      if (productSales[productId]) {
        productSales[productId] += quantitySold;
      } else {
        productSales[productId] = quantitySold;
      }
    });
  });

  // Add the total quantity sold to the products
  const productsWithSales = products.map((product) => {
    const productId = product.id; // Assuming the product has an `id` field
    const totalQuantitySold = productSales[productId] || 0; // Default to 0 if no sales data
    return { ...product, totalQuantitySold };
  });

  // Sort the products based on total quantity sold and return top 5
  const bestSelling = productsWithSales.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold).slice(0, 5);
  return bestSelling;
};



// Sales by Date
export const getSalesByDate = async (
    status?: "Pending" | "Confirmed" | "Delivered" | "Processing",
    dateRange?: "last7days" | "last30days" | "lastWeek" | "lastMonth"
  ) => {
    const orders = await getAllDocsFromCollection<OrderType>("orders");
    const salesData: Record<string, { totalRevenue: number; count: number }> = {};
  
    // Filter orders based on status if provided
    const filteredOrders = status ? orders.filter((order) => order.status === status) : orders;
  
    // Filter by date range if provided
    const now = new Date();
    let startDate: Date | null = null;
  
    if (dateRange === "last7days") {
      startDate = subDays(now, 7);
    } else if (dateRange === "last30days") {
      startDate = subDays(now, 30);
    } else if (dateRange === "lastWeek") {
      // The start of last week (Monday)
      startDate = subDays(now, now.getDay() + 7); // Adjust to last Monday
    } else if (dateRange === "lastMonth") {
      startDate = subMonths(now, 1);
    }
  
    // Filter orders based on the selected date range
    const filteredByDate = filteredOrders.filter((order) => {
      const orderDate =
        order.createdAt instanceof Timestamp
          ? order.createdAt.toDate()
          : new Date();
      return startDate ? orderDate >= startOfDay(startDate) && orderDate <= endOfDay(now) : true;
    });
  
    filteredByDate.forEach((order) => {
      const orderDate =
        order.createdAt instanceof Timestamp
          ? order.createdAt.toDate().toISOString().split("T")[0]
          : "";
      if (orderDate) {
        if (!salesData[orderDate]) {
          salesData[orderDate] = { totalRevenue: 0, count: 0 };
        }
        const orderRevenue = order.orderDetails.reduce((sum, product) => {
          const productPrice = parseFloat(product.salePrice); // Ensure price is treated as a number
          return sum + productPrice * product.quantity;
        }, 0);
        salesData[orderDate].totalRevenue += orderRevenue;
        salesData[orderDate].count += 1;
      }
    });
  
    return Object.entries(salesData).map(([date, { totalRevenue, count }]) => ({
      date,
      totalRevenue,
      count,
    }));
  };
  