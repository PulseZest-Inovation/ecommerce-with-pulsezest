"use client";
import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { Fab } from "@mui/material";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import ProductTabs from "./ProductTabs";
import { handleSubmit, fetchApplicationData } from "./ProductService";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<Product>({
    id: "",
    productTitle: "",
    productSubtitle: "",
    slug: "",
    permalink: "",
    type: "simple",
    status: "draft",
    featured: false,
    catalog_visibility: "visible",
    shortDescription: "",
    sku: "",
    price: "",
    regularPrice: "",
    salePrice: "",
    gstRate: "",
    guides: [],
    height: 0,
    length: 0,
    breadth: 0,
    weight: 0,
    isReadyToWear: false,
    readyToWearCharges: 0,
    isPrePlated: false,
    prePlatedCharges: 0,
    isReturn: true,
    returnPeriod: "Hassle-free 10 days return & exchange",
    isShippingCharge: false,
    deliveryTimePeriod: "2-7 days delivery within India",
    isCashOnDelivery: true,
    HSN: "",
    createdAt: Timestamp.now(),
    ModifiedAt: Timestamp.now(),
    dateOnSaleTo: null,
    dateOnSaleFrom: null,
    price_html: "",
    onSale: false,
    purchaseSale: false,
    totalSales: 0,
    manageStatus: false,
    stockQuantity: 0,
    stockStatus: "in-stock",
    backorders: false,
    backordersAllowed: false,
    shipping_taxable: "",
    reviewsAllowed: true,
    averageRating: "0",
    ratingCount: 0,
    categories: [],
    tags: [],
    featuredImage: "",
    galleryImages: [],
    videoUrl: "",
    variation: [],
    attributes: [],
    menuOrder: 0,
    metaData: [],
    description: [
      { heading: "Details", content: "" },
      { heading: "Description ", content: "" },
      { heading: "Shipping", content: "" },
      { heading: "Return & Exchange", content: "" },
      { heading: "Manufacturing Information ", content: "" },
      { heading: "Support", content: "" },
    ],
  });

  // Function to update a specific key in formData
  const handleFormDataChange = (key: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        createdAt: initialData.createdAt || Timestamp.now(),
        ModifiedAt: initialData.ModifiedAt || Timestamp.now(),
        description: Array.isArray(initialData.description)
          ? initialData.description
          : prev.description,
      }));
    }
  }, [initialData]);

  return (
    <div>
      <ProductTabs
        formData={formData}
        onFormDataChange={handleFormDataChange} // Use new function
        loading={loading}
        setLoading={setLoading}
        handleSubmit={() => handleSubmit(formData, setLoading, router)}
      />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <Fab className="bg-blue-500 text-white">
          <span className="text-xl">+</span>
        </Fab>
      </div>
    </div>
  );
};

export default ProductWrapper;
