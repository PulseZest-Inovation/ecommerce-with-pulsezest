"use client";
import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { Fab, Select, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { Modal, message } from "antd"; // ✅ Ant Design Modal
import { Product } from "@/types/Product";
import ProductTabs from "./ProductTabs";
import { handleSubmit } from "./ProductService";
import { SelectChangeEvent } from "@mui/material";
import { Attribute, fetchProductAttributes } from "./variationHelper";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ State Management
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
    attributes: [], // ✅ Attributes ke liye state
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

  const [modalVisible, setModalVisible] = useState(false);
  const [attributeData, setAttributeData] = useState<Attribute[]>([]);

  // ✅ Fetch Attributes from Firebase
  useEffect(() => {
    const loadAttributes = async () => {
      const fetchedAttributes = await fetchProductAttributes();
      setAttributeData(fetchedAttributes);
    };
    loadAttributes();
  }, []);

  // ✅ Generate Possible Variations
  const generateVariations = () => {
    if (formData.type === "variable" && formData.attributes.length > 0) {
      const variations: { [key: string]: string }[] = [];
      const attributeValues = formData.attributes.map((attr) => attr.values);

      // Cartesian Product Logic
      const generateCombinations = (arr: string[][], index = 0, current: string[] = []) => {
        if (index === arr.length) {
          variations.push(
            current.reduce((acc, value, i) => {
              acc[formData.attributes[i].name] = value;
              return acc;
            }, {} as { [key: string]: string })
          );
          return;
        }
        for (let value of arr[index]) {
          generateCombinations(arr, index + 1, [...current, value]);
        }
      };

      generateCombinations(attributeValues);
      setFormData((prev) => ({ ...prev, variation: variations }));
      setModalVisible(true); // ✅ Show Modal
    }
  };

  // ✅ Handle Type Change
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "simple" | "variable";
    setFormData((prev) => ({ ...prev, type: newType }));

    if (newType === "variable") {
      generateVariations();
    }
  };

  // ✅ Handle Modal OK
  const handleModalOk = () => {
    setModalVisible(false);
    message.success(`Total ${formData.variation.length} variations added!`);
  };

  // ✅ Load Initial Data
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
    <div>
      {/* ✅ Product Type Selector */}
      <div className="mb-4">
        <label className="block font-medium">Product Type:</label>
        <Select value={formData.type} onChange={handleTypeChange} fullWidth>
          <MenuItem value="simple">Simple</MenuItem>
          <MenuItem value="variable">Variable</MenuItem>
        </Select>
      </div>

      {/* ✅ Product Tabs */}
      <ProductTabs
        formData={formData}
        onFormDataChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        loading={loading}
        setLoading={setLoading}
        handleSubmit={() => handleSubmit(formData, setLoading, router)}
      />

      {/* ✅ Ant Design Modal for Variations */}
      <Modal title="Variations Added" visible={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)}>
        <p>Total {formData.variation.length} variations added!</p>
      </Modal>

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
