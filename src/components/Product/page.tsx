import React, { useState, useEffect } from "react";
import { Col, Row, Input, Button, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Product } from "@/types/Product";
import { Timestamp } from "firebase/firestore";
import "tailwindcss/tailwind.css";

const { Option } = Select;

interface ProductWrapperProps {
  initialData?: Product; // Pass initial data if available
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
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

  // Update formData when initialData is provided or changed
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        createdAt: initialData.createdAt || Timestamp.now(),
        ModifiedAt: initialData.ModifiedAt || Timestamp.now(),
      });
    }
  }, [initialData]);

  const handleInputChange = (key: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFeaturedUpload = ({ file }: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleInputChange("featuredImage", reader.result as string);
      message.success("Featured image uploaded successfully!");
    };
    reader.readAsDataURL(file.originFileObj);
  };

  const handleGalleryUpload = ({ fileList }: any) => {
    const newImages: string[] = [];
    fileList.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        if (newImages.length === fileList.length) {
          handleInputChange("galleryImages", newImages);
          message.success("Gallery images uploaded successfully!");
        }
      };
      reader.readAsDataURL(file.originFileObj);
    });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    message.success("Product Added Successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      <Row gutter={16}>
        {/* Left Column */}
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

        {/* Right Column */}
        <Col xs={24} md={10}>
          <Input
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            className="mb-4"
          />
          <Select
            mode="multiple"
            placeholder="Select Categories"
            value={formData.categories}
            onChange={(value) => handleInputChange("categories", value)}
            className="mb-4 w-full"
          >
            <Option value="electronics">Electronics</Option>
            <Option value="fashion">Fashion</Option>
          </Select>
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
          {formData.featuredImage && (
            <img src={formData.featuredImage} alt="Featured" className="w-full mb-4" />
          )}
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
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductWrapper;
