import { Timestamp } from "firebase/firestore";
export interface CouponsType {
  id: string;
  code: string;
  couponTitle: string;
  couponSubtitle: string;
  amount: number; // Changed to `number`
  slug: string;
  createdAt: Timestamp;
  dateModifiedAt: Timestamp;
  discountType: 'percentage' | 'fixed'; // Strict typing
  description: string;
  // dateExpire: Timestamp;
  usageCount: number;
  productsId?: string[]; // Optional field
  excludeProductIds?: string[]; // Optional field
  usageLimit: number;
  usageLimitPerUser: number;
  freeShipping: boolean;
  productCategories?: string[];
  excludeSaleItems: boolean;
  minimumAmount: number; // Changed to `number`
  usedBy: string[]; 
  metaData: { key: string; value: any }[];
   applicableProducts?: string[];    // store product IDs
  applicableCategories?: string[];  // Better defined structure
}
