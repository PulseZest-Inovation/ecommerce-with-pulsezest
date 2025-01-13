'use client'
import React from "react";
import MultipleCategoriesSelector from "@/components/Selector/MultipleCategorySelector";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategories, onCategoryChange }) => {
  return (
             
    
    <div className="mb-4 mt-3 w-full" >
      <h2 className="font-medium text-gray-700">Select Cateogires</h2>
      <MultipleCategoriesSelector
        value={selectedCategories}
        onChange={onCategoryChange}
      />
    </div>
  );
};

export default CategorySelector;