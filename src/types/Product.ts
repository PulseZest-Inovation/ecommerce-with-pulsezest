import { Timestamp } from "firebase/firestore";

export interface ProductType {
  id: string;
  productTitle: string;
  productSubtitle: string;
  slug: string;
  permalink: string;
  createdAt: Timestamp;
  ModifiedAt: Timestamp;

  // Dimensions and Weight
  height: number; // Product height in cm
  length: number; // Product length in cm
  breadth: number; // Product breadth in cm
  weight: number; // Product weight in kg

  // Pre-Plated and Ready-to-Wear
  isPrePlated: boolean;
  prePlatedCharges: number;
  isReadyToWear: boolean;
  readyToWearCharges: number;
  readyToWear?: {
    wrist: number;
    length: number;
    hip: number;
  };

  // Product Metadata
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;

  // Descriptions
  description: { heading: string; content: string }[];
  shortDescription: string;

  // Pricing
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

  // Return and Shipping Details
  isReturn: boolean;
  returnPeriod: string;
  isCashOnDelivery: boolean;
  isShippingCharge: boolean;
  shipping_taxable: string;
  deliveryTimePeriod: string;

  // Stock Details
  manageStatus: boolean;
  stockQuantity: number;
  stockStatus: string;
  backorders: boolean; // Fixed spelling issue
  backordersAllowed: boolean; // Fixed spelling issue
  reviewsAllowed: boolean;
  averageRating: string;
  ratingCount: number;

  // Additional Information
  categories: string[];
  videoUrl: string;
  tags: string[];
  gstRate: string;
  HSN: string;

  // Media
  featuredImage: string;
  galleryImages: string[];

  // Variations and Attributes
  variation: any[];
  attributes: any[];

  // Other Metadata
  menuOrder: number;
  metaData: any[];

  //guide.
  guides: { guideId: string; enabled: boolean }[];
}
