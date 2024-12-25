// components/Product/CategorySelector.tsx
import React from "react";
import { Select } from "antd";
import MultipleCategoriesSelector from "../Selector/MultipleCategorySelector";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategories, onCategoryChange }) => {
  return (
    <div className="mb-4">
      <MultipleCategoriesSelector
        value={selectedCategories}
        onChange={onCategoryChange}
      />
    </div>
  );
};

export default CategorySelector;
