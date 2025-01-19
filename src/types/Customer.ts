import { Timestamp } from "firebase/firestore";
import { Billing } from "./Billing";
import { Shippig } from "./Shipping";
import { CartType } from "./CartType";

export interface MetaData {
  key: string;
  value: string;
}

//   const metaDataInfo: MetaData[] = [
//   { key: "loyaltyPoints", value: "150" },
//   { key: "preferredContact", value: "email" },
// ];


export interface CustomerType {
    id: string
    fullName: string;
    profileUrl: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    pin: string;
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
    cart: CartType[];
  }
  