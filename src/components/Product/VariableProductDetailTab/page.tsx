"use client";
import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { ProductType } from "@/types/ProductType"; // Adjust path as needed
import CategorySelector from "../SimpleProductDetailTab/CategorySelector";
import ProductTagSelector from "../SimpleProductDetailTab/TagsSelector";

interface VariableProductDetailsProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

const VariableProductDetailTab: React.FC<VariableProductDetailsProp> = ({
  formData,
  onFormDataChange,
}) => {
     const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
      useEffect(() => {
        setSelectedCategories(formData.categories || []);
      }, [formData.categories]);
    
      const handleCategoryChange = (categories: string[]) => {
        setSelectedCategories(categories);
        onFormDataChange("categories", categories);
      };
    
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Title</label>
        <Input
          value={formData.productTitle || ""}
          onChange={e => onFormDataChange("productTitle", e.target.value)}
          placeholder="Enter Product title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Subtitle</label>
        <Input
          value={formData.productSubtitle || ""}
          onChange={e => onFormDataChange("productSubtitle", e.target.value)}
          placeholder="Enter Product Subtitle"
        />
      </div>
        <CategorySelector
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />
      <ProductTagSelector
        selectedTags={formData.tags}
        onTagsChange={(tags) => onFormDataChange("tags", tags)}
        productId={formData.slug}
      />
        
      {/* Add more fields as needed for your variation */}
    </div>
  );
};

export default VariableProductDetailTab;