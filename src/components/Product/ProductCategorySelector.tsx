'use client'
import React from "react";
import MultipleCategoriesSelector from "../Selector/MultipleCategorySelector";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategories, onCategoryChange }) => {
  return (
    <div className="mb-4 w-4/5 mt-3" >
      <h2 className="font-bold">Select Cateogires</h2>
      <MultipleCategoriesSelector
        value={selectedCategories}
        onChange={onCategoryChange}
      />
    </div>
  );
};

export default CategorySelector;
