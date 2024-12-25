'use client'
import React from "react";
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
