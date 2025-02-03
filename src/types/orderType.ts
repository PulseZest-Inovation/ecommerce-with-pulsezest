import { Timestamp } from "firebase/firestore";

export interface OrderType {
  id: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  createdAt: Timestamp;
  email: string;
  fullName: string;
  houseNumber: string;
  orderDetails: CartItem[];
  orderId: string;
  phoneNumber: string;
  state: string;
  status: "Pending" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Returned";
  [key: string]: any; // For additional details
}

export interface CartItem {
  id: string;
  productTitle: string;
  price: number;
  quantity: number;
  image: string;
  isReadyToWear?: boolean;
  readyToWearCharges?: number;
  isPrePlated?: boolean;
  prePlatedCharges?: number;
  [key: string]: any; // For additional details
}