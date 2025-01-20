import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  productTitle: string;
  productSubtitle: string;
  slug: string;
  permalink: string;
  createdAt: Timestamp;
  ModifiedAt: Timestamp;

  isPrePlated: boolean;
  prePlatedCharges: number;
  isReadyToWear: boolean;
  readyToWearCharges: number;
  readyToWear?: {
    wrist: number;
    length: number;
    hip: number;
  };
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

  isReturn: boolean;
  returnPeriod: string;

  isCashOnDelivery: boolean;
  
  isShippingCharge: boolean;
  shipping_taxable: string;
  deliveryTimePeriod: string;


  manageStatus: boolean;
  stockQuantity: number;
  stockStatus: string;
  backorders: boolean; // Fixed spelling issue
  backordersAllowed: boolean; // Fixed spelling issue
  reviewsAllowed: boolean;
  averageRating: string;
  ratingCount: number;
  categories: string[];
  videoUrl: string;
  tags: string[];
  gstRate: string
  HSN: string;
  featuredImage: string;
  galleryImages: string[];
  variation: any[];
  attributes: any[];
  menuOrder: number;
  metaData: any[];
}
