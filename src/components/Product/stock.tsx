'use client'
import React from "react";
import { Input } from "antd";
import { Product } from "@/types/Product";

interface ProrductStockProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const ProductStock: React.FC<ProrductStockProps> = ({ formData, onFormDataChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Product Stock Details</h3>
      <Input
        type="number"
        placeholder="Enter Product Stock Quantity"
        value={formData.shipping_taxable}
        onChange={(e) => onFormDataChange("stockQuantity", e.target.value)}
        className="mb-4"
      />
    </div>
  );
};

export default ProductStock;
