"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Menu, message, Card, Collapse } from "antd";
import type { MenuProps } from "antd";
import { Product } from "@/types/Product";
import GalleryUpload from "./GalleryUpload";
import FeaturedImageUpload from "./FeatureImageUpload";
import CategorySelector from "./ProductCategorySelector";
import Tags from "./Tags";
import ProductContentRenderer from "./ProductMenu/RenderMenuComponent";
import VideoUpload from "./VideUpload";
import { items } from "./ProductMenu/MenuItem";
import { Timestamp } from "firebase/firestore";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [selectedKey, setSelectedKey] = useState<string>("price");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
      setSelectedCategories(initialData.categories || []);
    }
  }, [initialData]);

  const handleInputChange = (key: keyof Product, value: any) => {
    if (key === "productTitle") {
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

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setFormData((prev) => ({ ...prev, categories }));
  };

  const handleExpandedDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...formData.description];
    updatedDescriptions[index].content = value;
    setFormData((prev) => ({ ...prev, description: updatedDescriptions }));
  };

  const handleSubmit = async () => {
    if (!formData.productTitle) {
      message.error("Product Title is required!");
      return;
    }

    let currentSlug = formData.slug;

    if (!initialData) {
      const existingSlug = await checkSlugAvailability(currentSlug);
      if (existingSlug) {
        currentSlug = `${currentSlug}-${Date.now()}`;
        // message.warning(`Slug already in use. Using new slug: ${currentSlug}`);
      }
    }

    try {
      await setDocWithCustomId("products", currentSlug, {
        ...formData,
        slug: currentSlug,
        id: currentSlug,
      });
      message.success(
        initialData
          ? "Product Updated Successfully!"
          : "Product Added Successfully!"
      );
    } catch (error) {
      message.error("Error adding/updating product.");
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

  const renderExpandableDescriptions: any = () =>
    formData.description.map((section, index) => (
      <Collapse.Panel header={section.heading} key={index}>
        <Input.TextArea
          value={section.content}
          onChange={(e) =>
            handleExpandedDescriptionChange(index, e.target.value)
          }
          rows={4}
        />
      </Collapse.Panel>
    ));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between my-2">
        <p className="text-sta font-mono text-blue-400">/{formData.slug}</p>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!formData.productTitle}
        >
          Submit
        </Button>
      </div>
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Input
            placeholder="Product Title"
            value={formData.productTitle}
            onChange={(e) => handleInputChange("productTitle", e.target.value)}
            className="mb-4"
            required
          />
          <Input
            placeholder="Product Subtitle"
            value={formData.productSubtitle}
            onChange={(e) =>
              handleInputChange("productSubtitle", e.target.value)
            }
            className="mb-4"
          />
          <Input.TextArea
            rows={2}
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
            className="mb-4"
          />
          <Collapse>{renderExpandableDescriptions()}</Collapse>
          <div className="flex">
            <Menu
              onClick={(e) => setSelectedKey(e.key)}
              style={{ width: 256 }}
              defaultSelectedKeys={["price"]}
              mode="inline"
              items={items}
            />
            <ProductContentRenderer
              selectedKey={selectedKey}
              formData={formData}
              onFormDataChange={handleInputChange}
            />
          </div>

          <CategorySelector
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Tags
            selectedTags={formData.tags}
            onTagsChange={(tags) => handleInputChange("tags", tags)}
            productId={formData.slug}
          />
        </Col>
        <Col xs={24} md={10}>
          <Card className="mt-2">
            <FeaturedImageUpload
              featuredImage={formData.featuredImage}
              onFeaturedImageChange={(url) =>
                handleInputChange("featuredImage", url)
              }
              slug={formData.slug}
            />
          </Card>
          <Card className="mt-2">
            <GalleryUpload
              galleryImages={formData.galleryImages}
              onGalleryChange={(images) =>
                handleInputChange("galleryImages", images)
              }
              slug={formData.slug}
            />
          </Card>
          <Card className="mt-2">
            <VideoUpload
              videoUrl={formData.videoUrl}
              onVideoChange={(url) => handleInputChange("videoUrl", url)}
              slug={formData.slug}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductWrapper;
