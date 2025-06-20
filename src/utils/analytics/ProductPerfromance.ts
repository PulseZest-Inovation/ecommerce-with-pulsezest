import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Timestamp } from "firebase/firestore";
import { OrderType } from "@/types/orderType";
import { Product } from "@/types/ProductType";

// Fetch Products from the collection
const fetchProducts = async () => {
  return await getAllDocsFromCollection<Product>("products");
};

// Fetch Orders and Products to link them
const fetchOrdersWithProducts = async () => {
  const orders = await getAllDocsFromCollection<OrderType>("orders");
  const products = await fetchProducts();

  return { orders, products };
};

// Get Total Sales by Product
export const getTotalSalesByProduct = async () => {
  const { orders, products } = await fetchOrdersWithProducts();

  const productSales: Record<string, number> = {};

  orders.forEach((order) => {
    order.orderDetails.forEach((orderItem) => {
      const productId = orderItem.productId; // assuming each order item has a productId
      const orderTotal = orderItem.price * orderItem.quantity;

      if (productSales[productId]) {
        productSales[productId] += orderTotal;
      } else {
        productSales[productId] = orderTotal;
      }
    });
  });

  // Attach product details (title, price) to sales data
  return products.map((product) => ({
    productId: product.id,
    productTitle: product.productTitle,
    totalSales: productSales[product.id] || 0,
  }));
};

// Get Best-Selling Products
export const getBestSellingProducts = async () => {
  const totalSales = await getTotalSalesByProduct();
  return totalSales
    .sort((a, b) => b.totalSales - a.totalSales) // Sort by total sales descending
    .slice(0, 5); // Top 5 best-selling products
};

// Get Most Popular Products by Order Quantity
export const getMostPopularProducts = async () => {
  const { orders, products } = await fetchOrdersWithProducts();

  const productQuantities: Record<string, number> = {};

  orders.forEach((order) => {
    order.orderDetails.forEach((orderItem) => {
      const productId = orderItem.productId;

      if (productQuantities[productId]) {
        productQuantities[productId] += orderItem.quantity;
      } else {
        productQuantities[productId] = orderItem.quantity;
      }
    });
  });

  // Attach product details (title, quantity) to the quantities data
  return products.map((product) => ({
    productId: product.id,
    productTitle: product.productTitle,
    quantitySold: productQuantities[product.id] || 0,
  })).sort((a, b) => b.quantitySold - a.quantitySold); // Sort by quantity sold
};

// Get Product Stock Levels
export const getProductStockLevels = async () => {
  const products = await fetchProducts();

  return products.map((product) => ({
    productId: product.id,
    productTitle: product.productTitle,
    stockQuantity: product.stockQuantity,
  }));
};

// Get Out-of-Stock Products
export const getOutOfStockProducts = async () => {
  const stockLevels = await getProductStockLevels();
  return stockLevels.filter((product) => product.stockQuantity <= 0);
};

// Get Products with Low Stock
export const getLowStockProducts = async (threshold: number = 10) => {
  const stockLevels = await getProductStockLevels();
  return stockLevels.filter((product) => product.stockQuantity <= threshold);
};

// Get Average Order Value per Product
export const getAverageOrderValuePerProduct = async () => {
  const { orders, products } = await fetchOrdersWithProducts();

  const productRevenue: Record<string, number> = {};
  const productOrderCount: Record<string, number> = {};

  orders.forEach((order) => {
    order.orderDetails.forEach((orderItem) => {
      const productId = orderItem.productId;
      const orderTotal = orderItem.price * orderItem.quantity;

      if (productRevenue[productId]) {
        productRevenue[productId] += orderTotal;
        productOrderCount[productId] += 1;
      } else {
        productRevenue[productId] = orderTotal;
        productOrderCount[productId] = 1;
      }
    });
  });

  // Calculate average order value for each product
  return products.map((product) => ({
    productId: product.id,
    productTitle: product.productTitle,
    averageOrderValue: productOrderCount[product.id]
      ? productRevenue[product.id] / productOrderCount[product.id]
      : 0,
  }));
};

