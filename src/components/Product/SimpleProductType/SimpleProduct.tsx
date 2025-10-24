import React from "react";
import { Tabs, Button, Tooltip } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import ProductDetailTab from "../ProductDetailTab/page";
import ProductOtherTab from "../ProductOtherTab/page";
import ProductGalleryTab from "../ProductGalleryTab/page";
import ProductVariationTab from "../ProductVariationTab/page";
import { Product } from "@/types/Product";

interface SimpleProductProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const SimpleProduct: React.FC<SimpleProductProps> = ({
  formData,
  onFormDataChange,
  loading,
  handleSubmit,
}) => {
  const items = [
    {
      label: "Product Details",
      key: "1",
      children: (
        <ProductDetailTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      ),
    },
    {
      label: "Other Fields",
      key: "2",
      children: (
        <ProductOtherTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      ),
    },
    {
      label: "Product Gallery",
      key: "3",
      children: (
        <ProductGalleryTab
          formData={formData}
          onFormDataChange={onFormDataChange}
          slug={formData.slug}
        />
      ),
    },
  {
    label: "Product Variation", // ✅ Fixed and type-safe
    key: "4",
    children: (
      <ProductVariationTab
        formData={formData as any}
        onFormDataChange={onFormDataChange as (
          key: keyof Product,
          value: any
        ) => void}
      />
    ),
  },
  ];

  const operations = (
    <Tooltip title={!formData.productTitle ? "Please enter Product Title" : ""}>
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={loading || !formData.productTitle}
        loading={loading}
      >
        Submit
      </Button>
    </Tooltip>
  );

  return (
    <Tabs
      centered
      tabBarExtraContent={{
        left: operations,
        right: (
          <LinkOutlined className="cursor-pointer text-blue-500 text-lg" />
        ),
      }}
      items={items}
      type="card"
      animated
      className="custom-tabs"
    />
  );
};

export default SimpleProduct;
