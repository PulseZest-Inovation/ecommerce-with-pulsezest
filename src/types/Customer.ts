import { Timestamp } from "firebase/firestore";
import { Billing } from "./Billing";
import { Shippig } from "./Shipping";

export interface MetaData {
  key: string;
  value: string;
}

//   const metaDataInfo: MetaData[] = [
//   { key: "loyaltyPoints", value: "150" },
//   { key: "preferredContact", value: "email" },
// ];


export interface Customer {
    id: string
    fullName: string;
    phone: string;
    address: string;
    createdAt: Timestamp;
    dateModified: Timestamp;
    email: string;
    username: string;
    password: string;
    billing: Billing;
    shipping: Shippig;
    isPayingCustomer: boolean;
    avatarUrl: string;
    metaData: MetaData[];
  }
  