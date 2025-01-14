'use client';
import React from "react";
import { Input } from "antd";
import { Product } from "@/types/Product";

interface ProductStockProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const ProductStock: React.FC<ProductStockProps> = ({ formData, onFormDataChange }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Stock Details</h3>
      
      {/* Stock Input */}
      <div>
        <label
          htmlFor="stockQuantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Stock Quantity
        </label>
        <Input
          type="number"
          placeholder="Enter Product Stock Quantity"
          value={formData.stockQuantity}
          onChange={(e) => onFormDataChange("stockQuantity", Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-2">
          Enter the total number of items available in stock.
        </p>
      </div>
    </div>
  );
};

export default ProductStock;
