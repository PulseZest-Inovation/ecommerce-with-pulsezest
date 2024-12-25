'use client'
import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Select, message } from "antd";
import { Product } from "@/types/Product";
import GalleryUpload from "./galleryUpload";
import FeaturedImageUpload from "./FeatureImageUpload";
import CategorySelector from "./ProductCategorySelector";
import { Timestamp } from "firebase/firestore";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import "tailwindcss/tailwind.css";

const { Option } = Select;

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: "",
    slug: "",
    permalink: "",
    type: "simple",
    status: "draft",
    featured: false,
    catalog_visibility: "visible",
    description: "",
    shortDescription: "",
    sku: "",
    price: "",
    regularPrice: "",
    salePrice: "",
    createdAt: Timestamp.now(),
    ModifiedAt: Timestamp.now(),
    dateOnSaleTo: null,
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
    variation: [],
    attributes: [],
    menuOrder: 0,
    metaData: [],
  });

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle form data changes
  const handleInputChange = (key: keyof Product, value: any) => {
    if (key === "id") {
      const generatedSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [key]: value,
        slug: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Handle category change
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    handleInputChange("categories", categories); // Update formData with selected categories
  };

  // Submit product form data to Firestore
  const handleSubmit = async () => {
    if (!formData.id) {
      message.error("Product name is required!");
      return;
    }

    try {
      const docId = formData.slug;
      await setDocWithCustomId("products", docId, formData);
      message.success("Product Added Successfully!");
    } catch (error) {
      message.error("Error adding product.");
    }
  };

  // Update formData with initial data if available
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        createdAt: initialData.createdAt || Timestamp.now(),
        ModifiedAt: initialData.ModifiedAt || Timestamp.now(),
      });
      setSelectedCategories(initialData.categories || []);
    }
  }, [initialData]);

  return (
    <div className="container mx-auto p-4">
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Input
            placeholder="Product Name"
            value={formData.id}
            onChange={(e) => handleInputChange("id", e.target.value)}
            className="mb-4"
          />
          <Input.TextArea
            rows={2}
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={(e) => handleInputChange("shortDescription", e.target.value)}
            className="mb-4"
          />
          <Input.TextArea
            rows={4}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="mb-4"
          />
        </Col>

        <Col xs={24} md={10}>
          <Input
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            className="mb-4"
            disabled
          />
          <CategorySelector
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Select
            mode="multiple"
            placeholder="Select Tags"
            value={formData.tags}
            onChange={(value) => handleInputChange("tags", value)}
            className="mb-4 w-full"
          >
            <Option value="sale">Sale</Option>
            <Option value="new">New</Option>
          </Select>
          <FeaturedImageUpload
            featuredImage={formData.featuredImage}
            onFeaturedImageChange={(url) => handleInputChange("featuredImage", url)}
            slug={formData.slug}
          />
          <GalleryUpload
            galleryImages={formData.galleryImages}
            onGalleryChange={(newGalleryImages) => handleInputChange("galleryImages", newGalleryImages)}
            slug={formData.slug}
          />
        </Col>
      </Row>

      <div className="text-right">
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!formData.id}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductWrapper;
