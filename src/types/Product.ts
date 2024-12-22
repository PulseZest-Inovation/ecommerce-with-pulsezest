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
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regularPrice: string;
    salePrice: string;
    dateOnSaleTo: Timestamp;
    price_html: string;
    onSale: boolean;
    purchaseSale: boolean;
    totalSales: number;
    manageStatus: boolean;
    stockQuantity: number;
    stockStatus: string;
    backdoers: string;
    backordersAllowrd: boolean;
    shipping_taxable: string;
    reviewsAllowed: boolean;
    averageRating: string;
    ratingCount: number;
    categories: string[];  // Array of strings (e.g., category names)
    tag: string[];         // Array of strings (e.g., tag names)
    image: string[];       // Array of image URLs or file paths
    variation: any[];      // Array of any type (for product variations, could be objects)
    attributes: any[];     // Array of attributes (could be objects with specific properties)
    menuOrder: number;
    metaData: any[];       // Array of metadata (could be objects)
}
