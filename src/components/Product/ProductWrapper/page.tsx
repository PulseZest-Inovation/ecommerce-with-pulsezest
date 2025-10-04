"use client";
import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Select } from "antd";
import { Product } from "@/types/Product";
import VariableProductType from "../VariableProudctType/VariableProductType";
import { handleSubmit } from "./ProductService";
import { Fab, SelectChangeEvent } from "@mui/material";
import { Attribute, fetchProductAttributes } from "./variationHelper";
import SimpleProduct from "../SimpleProductType/SimpleProduct";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { Option } = Select;

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
     tagForImage: '',
    videoUrl: "",
    variation: [],
    attributes: [],
    menuOrder: 0,
    metaData: [],
    description: [
      { heading: "Details", content: "" },
      { heading: "Description", content: "" },
      { heading: "Shipping", content: "" },
      { heading: "Return & Exchange", content: "" },
      { heading: "Manufacturing Information", content: "" },
      { heading: "Support", content: "" },
    ],
  });

  const [attributeData, setAttributeData] = useState<Attribute[]>([]);

  useEffect(() => {
    const loadAttributes = async () => {
      const fetchedAttributes = await fetchProductAttributes();
      setAttributeData(fetchedAttributes);
    };
    loadAttributes();
  }, []);

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "simple" | "variable";
    setFormData((prev) => ({ ...prev, type: newType }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        createdAt: initialData.createdAt || Timestamp.now(),
        ModifiedAt: initialData.ModifiedAt || Timestamp.now(),
        description: Array.isArray(initialData.description) ? initialData.description : prev.description,
      }));
    }
  }, [initialData]);

  return (
    <div className="p-4">
      {/* Product Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Product Type:</label>
        <Select
          value={formData.type}
          onChange={(value) => handleTypeChange({ target: { value } } as any)}
          style={{ width: "100%" }}
        >
          <Option value="simple">Simple</Option>
          <Option value="variable">Variable</Option>
        </Select>
      </div>

      {/* Conditional Rendering */}
      {formData.type === "simple" ? (
        <SimpleProduct
          formData={formData}
          onFormDataChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
          loading={loading}
          setLoading={setLoading}
          handleSubmit={() => handleSubmit(formData, setLoading, router)}
        />
      ) : (
        <VariableProductType
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
          handleSubmit={() => handleSubmit(formData, setLoading, router)}
          initialData={initialData}
        />
      )}

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <Fab className="bg-blue-600 text-white">
          <span className="text-2xl">+</span>
        </Fab>
      </div>
    </div>
  );
};

export default ProductWrapper;
