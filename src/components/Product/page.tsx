import React, { useState, useEffect } from "react";
import { Col, Row, Input, Button, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Product } from "@/types/Product";
import MultipleCategoriesSelector from "../Selector/MultipleCategorySelector";
import { Timestamp } from "firebase/firestore";

// Import your Firebase functions
import { UploadImageToFirebase, UploadMultipleImagesToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";
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
    galleryImages: [], // Initialize as empty array
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

  // Upload featured image
  const handleFeaturedUpload = async ({ file }: any) => {
    const docId = formData.slug;
    try {
      const uploadedUrl = await UploadImageToFirebase(file, `products/${docId}/featuredImage`);
      if (uploadedUrl) {
        handleInputChange("featuredImage", uploadedUrl);
        message.success("Featured image uploaded successfully!");
      }
    } catch (error) {
      message.error("Error uploading featured image.");
    }
  };

 
// Upload gallery images one by one
const handleGalleryUpload = async ({ fileList }: any) => {
  const docId = formData.slug;
  const newGalleryImages: string[] = [...formData.galleryImages]; // Keep existing categories intact

  // Loop over each file in the fileList
  for (const file of fileList) {
    // Validate file type (check if it's an image)
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false; // Prevent upload
    }

    try {
      // Upload the single image using UploadImageToFirebase
      const uploadedUrl = await UploadImageToFirebase(file.originFileObj, `products/${docId}/galleryImages`);
      if (uploadedUrl) {
        // Push the uploaded URL into the categories array
        console.log("Gallery image upload", uploadedUrl);
        newGalleryImages.push(uploadedUrl);
      }
    } catch (error) {
      message.error("Error uploading gallery images.");
    }
  }

  // Update the form data with the new categories (which now include image URLs)
  handleInputChange("galleryImages", newGalleryImages);
  message.success("Gallery images uploaded successfully!");
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
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
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
          <MultipleCategoriesSelector
            value={selectedCategories}
            onChange={handleCategoryChange}
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
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFeaturedUpload}
            className="mb-4"
          >
            <Button icon={<PlusOutlined />}>Upload Featured Image</Button>
          </Upload>
          {formData.featuredImage && <img src={formData.featuredImage} alt="Featured" className="w-full mb-4" />}
          <Upload
            listType="picture-card"
            multiple
            beforeUpload={() => false}
            onChange={handleGalleryUpload}
            className="mb-4"
          >
            <div>
              <PlusOutlined />
              <div>Upload Gallery</div>
            </div>
          </Upload>
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
