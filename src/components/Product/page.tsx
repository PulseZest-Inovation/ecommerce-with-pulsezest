'use client';
import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Menu, message, Card, Collapse } from "antd";
import type { MenuProps } from 'antd';
import { Product } from "@/types/Product";
import GalleryUpload from "./GalleryUpload";
import FeaturedImageUpload from "./FeatureImageUpload";
import CategorySelector from "./ProductCategorySelector";
import Price from "./Price";
import { Timestamp } from "firebase/firestore";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LinkIcon from '@mui/icons-material/Link';
import Shipping from "./Shipping";
import LinkedProduct from "./LinkedProduct";
import Tags from "./Tags";

const items: MenuProps['items'] = [
  {
    key: 'price',
    label: 'Price',
    icon: <CurrencyRupeeIcon />
  },
  {
    key: 'shipping',
    label: 'Shipping',
    icon: <LocalShippingIcon />
  },
  {
    key: 'linkedProduct',
    label: 'Linked Product',
    icon: <LinkIcon />
  },
];

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [selectedKey, setSelectedKey] = useState<string>('price');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: "",
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
    videoUrl: '',
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

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  // Handle form data changes
  const handleInputChange = (key: keyof Product, value: any) => {
    if (key === "id") {
      const generatedSlug = generateSlug(value);
      setFormData((prev) => ({ ...prev, [key]: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Handle category change
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    handleInputChange("categories", categories);
  };

  // Update categories based on images
  const updateCategoriesFromImages = (galleryImages: string[]) => {
    if (galleryImages.length > 0) {
      setSelectedCategories((prev) => {
        return prev.includes("ImageCategory") ? prev : [...prev, "ImageCategory"];
      });
    } else {
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== "ImageCategory")
      );
    }
    handleInputChange("categories", selectedCategories);
  };

  const checkSlugAvailability = async (slug: string): Promise<string> => {
    try {
      const products = await getAllDocsFromCollection<Product>("products");
      const existingProduct = products.find((product) => product.slug === slug);
      return existingProduct ? existingProduct.slug : ""; // Return existing slug or empty string
    } catch (error) {
      console.error("Error checking slug availability:", error);
      throw new Error("Failed to verify slug availability. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.id) {
      message.error("Product name is required!");
      return;
    }

    let currentSlug = formData.slug;

    // If editing, use the existing slug without modification
    if (!initialData) {
      // Check if slug is available only when creating a new product
      const existingSlug = await checkSlugAvailability(currentSlug);
      if (existingSlug) {
        // If the slug is already used, modify it by appending a timestamp
        const timestamp = Date.now(); // Get current timestamp
        currentSlug = `${currentSlug}-${timestamp}`; // Append timestamp to slug
        message.warning("Slug already in use. Modifying slug to: " + currentSlug);
      }
    }

    try {
      const docId = currentSlug;
      // Update the product using the existing slug for edits
      await setDocWithCustomId("products", docId, { ...formData, slug: currentSlug });
      message.success(initialData ? "Product Updated Successfully!" : "Product Added Successfully!");
    } catch (error) {
      message.error("Error adding/updating product.");
    }
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
      setSelectedCategories(initialData.categories || []);
    }
  }, [initialData]);

  const handleExpandedDescriptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedDescriptions = [...prev.description];
      updatedDescriptions[index].content = value;
      return { ...prev, description: updatedDescriptions };
    });
  };

  // Render expandable descriptions
  const renderExpandableDescriptions = () => {
    return (
      <Collapse>
        {formData.description.map((section, index) => (
          <Collapse.Panel header={section.heading} key={index}>
            <Input.TextArea
              value={section.content}
              onChange={(e) => handleExpandedDescriptionChange(index, e.target.value)}
              rows={4}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'price':
        return <Price formData={formData} onFormDataChange={handleInputChange} />;
      case 'shipping':
        return <Shipping formData={formData} onFormDataChange={handleInputChange} />;
      case 'linkedProduct':
        return <LinkedProduct />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between my-2">
        <p className="text-sta font-mono text-blue-400">/{formData.slug}</p>
        <Button type="primary" onClick={handleSubmit} disabled={!formData.id}>
          Submit
        </Button>
      </div>

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

          <h1 className="pl-2 font-bold text-1xl">More Descriptions</h1>

          {renderExpandableDescriptions()}

          <div style={{ display: 'flex' }}>
            <Menu
              onClick={onClick}
              style={{ width: 256 }}
              defaultSelectedKeys={['price']}
              mode="inline"
              items={items}
            />
            <div style={{ marginLeft: 20, flex: 1 }}>
              {renderContent()}
            </div>
          </div>
        </Col>

        <Col xs={24} md={10}>
          <Card className="mt-2 hover:shadow-lg hover:scale-105 transition-transform duration-200">
            <FeaturedImageUpload
              featuredImage={formData.featuredImage}
              onFeaturedImageChange={(url) => handleInputChange("featuredImage", url)}
              slug={formData.slug}
            />
          </Card>

          <Card className="mt-2 hover:shadow-lg hover:scale-105 transition-transform duration-200">
            <GalleryUpload
              galleryImages={formData.galleryImages}
              onGalleryChange={(newGalleryImages) => {
                handleInputChange("galleryImages", newGalleryImages);
                updateCategoriesFromImages(newGalleryImages);
              }}
              slug={formData.slug}
            />
          </Card>

          <label htmlFor="Select Category"></label>
          <CategorySelector
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Tags
            selectedTags={formData.tags}
            onTagsChange={(value) => handleInputChange("tags", value)}
            productId={formData.slug}
          />
        </Col>

      </Row>
    </div>
  );
};

export default ProductWrapper;