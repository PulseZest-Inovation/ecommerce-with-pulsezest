"use client";
import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Tabs,  Button, message, } from "antd";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import ProductDetailTab from "./ProductDetailTab/page";
import ProdutOtherTab from "./ProductOtherTab/page";
import ProductGalleryTab from "./ProductGalleryTab/page";
import { ApplicationConfig } from "@/utils/ApplicationConfig";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [loading, setLoading] = useState<boolean>(false);
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

    isReadyToWear: false,
    readyToWearCharges: 0,

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
      { heading: "PRODUCT SPECIFICATION", content: "" },
      { heading: "SHIPPING INFORMATION", content: "" },
      { heading: "MORE INFORMATION", content: "" },
      { heading: "NEED HELP", content: "" },
    ],
  });

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

  const router = useRouter();

  const handleInputChange = (key: keyof Product, value: any) => {
    if (key === "productTitle" && !initialData) {
      const slug = generateSlug(value);
      setFormData((prev) => ({ ...prev, [key]: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!formData.productTitle) {
      message.error("Product Title is required!");
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    let currentSlug = formData.slug;

    if (!initialData) {
      // Only check for slug availability for new products
      const existingSlug = await checkSlugAvailability(currentSlug);
      if (existingSlug) {
        currentSlug = `${currentSlug}-${Date.now()}`;
      }
    }

    try {
      await setDocWithCustomId("products", currentSlug, {
        ...formData,
        slug: currentSlug, // Preserve the existing slug if editing
        id: currentSlug,
      });

      //saving the sku
      if (formData.sku) {
        await setDocWithCustomId("sku", formData.sku, {
          skuCode: formData.sku,
        });
      }

      message.success(
        initialData
          ? "Product Updated Successfully!"
          : "Product Added Successfully!"
      );

      router.push("/dashboard/manage-product/view-all-product");
    } catch (error) {
      message.error("Error adding/updating product.");
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (slug: string): Promise<string> => {
    try {
      const products = await getAllDocsFromCollection<Product>("products");
      const existingProduct = products.find((product) => product.slug === slug);
      return existingProduct ? existingProduct.slug : "";
    } catch (error) {
      console.error("Error checking slug availability:", error);
      throw new Error("Failed to verify slug availability.");
    }
  };

  const items = [
    {
      label: "Product Details",
      key: "1",
      children: (
        <ProductDetailTab
          formData={formData}
          onFormDataChange={handleInputChange}
        />
      ),
    },
    {
      label: "Other Fields",
      key: "2",
      children: (
        <ProdutOtherTab
          formData={formData}
          onFormDataChange={handleInputChange}
        />
      ),
    },
    {
      label: "Product Gallery",
      key: "3",
      children: (
        <ProductGalleryTab
          formData={formData}
          onFormDataChange={handleInputChange}
          slug={formData.slug}
        />
      ), // Component for Tab 3
    },
  ];

  const operations = (
    <div>
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={loading || !formData.productTitle}
        loading={loading}
      >
        Submit
      </Button>
    </div>
  );

  const handleCopySlug = () => {
    navigator.clipboard.writeText(formData.slug);
    message.success("Slug copied to clipboard!");
  };

  const handleNavigate = () => {
    const url = `${ApplicationConfig?.callback_url}/${formData.slug}`;
    window.open(url, '_blank');
  };

  
  return (
    <div>
 
      <div className="flex items-center space-x-2 mt-2">
        <p className="text-blue-300 font-mono" onClick={handleCopySlug}>
          {`${ApplicationConfig?.callback_url}${formData.slug}`}
        </p>
        <LinkOutlined 
          onClick={handleNavigate} 
          className="cursor-pointer text-blue-500" 
        />
      </div>
      <Tabs centered tabBarExtraContent={operations} items={items}/>
    </div>
  );
};

export default ProductWrapper;
