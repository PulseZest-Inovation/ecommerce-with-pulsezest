import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  slug: string;
  permalink: string;
  createdAt: Timestamp;
  ModifiedAt: Timestamp;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: { heading: string; content: string }[];
  shortDescription: string;
  sku: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  dateOnSaleTo: Timestamp | null;
  dateOnSaleFrom: Timestamp | null;
  price_html: string;
  onSale: boolean;
  purchaseSale: boolean;
  totalSales: number;
  manageStatus: boolean;
  stockQuantity: number;
  stockStatus: string;
  backorders: boolean; // Fixed spelling issue
  backordersAllowed: boolean; // Fixed spelling issue
  shipping_taxable: string;
  reviewsAllowed: boolean;
  averageRating: string;
  ratingCount: number;
  categories: string[];
  tags: string[];
  featuredImage: string;
  galleryImages: string[];
  variation: any[];
  attributes: any[];
  menuOrder: number;
  metaData: any[];
}
