"use client";
import React, { useState, useEffect } from "react";
import { Input, Collapse } from "antd";
import { ProductType } from "@/types/ProductType";
import CategorySelector from "./CategorySelector";
import ProductTagSelector from "./TagsSelector";
import CollapseExpandDescription from "./CollapseExpandDescription";
import ProductShortDescription from "./ProductShortDescription";

interface ProductDetailsProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function ProductDetailTab({
  formData,
  onFormDataChange,
}: ProductDetailsProp) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategories(formData.categories || []);
  }, [formData.categories]);

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    onFormDataChange("categories", categories);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <label
        htmlFor="productTitle"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Product Title
      </label>
      <Input
        placeholder="Product Title"
        value={formData.productTitle}
        onChange={(e) => onFormDataChange("productTitle", e.target.value)}
        className="mb-4 w-full"
        required
      />

      <label
        htmlFor="productTitle"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Product Subtitle
      </label>
      <Input
        placeholder="Product Subtitle"
        value={formData.productSubtitle}
        onChange={(e) => onFormDataChange("productSubtitle", e.target.value)}
        className="mb-4 w-full"
      />


      <CategorySelector
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />
      <ProductTagSelector
        selectedTags={formData.tags}
        onTagsChange={(tags) => onFormDataChange("tags", tags)}
        productId={formData.slug}
      />

      <label
        htmlFor="productTitle"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Product Specification
      </label>

      <CollapseExpandDescription
        formData={formData}
        onFormDataChange={onFormDataChange}
      />


      <ProductShortDescription formData={formData} onFormDataChange={onFormDataChange}></ProductShortDescription>   

    </div>
  );
}
