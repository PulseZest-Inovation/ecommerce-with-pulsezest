"use client";
import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

type VariationDetailFormProps = {
  formData: any;
  onFormDataChange: (key: string, value: any) => void;
  isManual?: boolean; // 🔹 new
  attributeData?: any[];  // 🔹 new
};

const VariationDetailForm: React.FC<VariationDetailFormProps> = ({
  formData,
  onFormDataChange,
  isManual = false,
  attributeData = [],

}) => {
  const safeVariation = formData || {};

  //  Extract color/size dropdown options from Firestore attributes
  const colorAttr = attributeData.find((attr) => attr.name.toLowerCase() === "color");
  const sizeAttr = attributeData.find((attr) => attr.name.toLowerCase() === "size");

  const colorOptions = colorAttr?.values?.map((v: any) => v.value) || [];
  const sizeOptions = sizeAttr?.values?.map((v: any) => v.value) || [];


  return (
    <div className="space-y-3">
      {/* Only show read-only attributes when NOT manual */}
      {!isManual && (
        <div className="flex gap-4 flex-wrap">
          {Object.entries(safeVariation).map(([key, value]) => {
            if (["price", "stock", "color", "size", "weight"].includes(key)) return null;
            return (
              <div key={key} className="text-sm">
                <span className="font-semibold">{key}:</span> {value}
              </div>
            );
          })}
        </div>
      )}

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <Input
          type="number"
          value={safeVariation.price || ""}
          onChange={(e) => onFormDataChange("price", e.target.value)}
          placeholder="Enter price"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <Input
          type="number"
          value={safeVariation.stock || ""}
          onChange={(e) => onFormDataChange("stock", e.target.value)}
          placeholder="Enter stock"
        />
      </div>

      {/* Color (Dropdown if manual) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        {isManual ? (
          <Select mode="multiple"
            placeholder="Select color"
            value={safeVariation.color || undefined}
            onChange={(value) => onFormDataChange("color", value)}
            className="w-full"
          >
            {colorOptions.map((color) => (
              <Option key={color} value={color}>
                {color}
              </Option>
            ))}
          </Select>
        ) : (
          <Input
            type="text"
            value={safeVariation.color || ""}
            onChange={(e) => onFormDataChange("color", e.target.value)}
            placeholder="Enter color"
          />
        )}
      </div>

      {/* Size (Dropdown if manual) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
        {isManual ? (
          <Select mode="multiple"
            placeholder="Select size"
            value={safeVariation.size || undefined}
            onChange={(value) => onFormDataChange("size", value)}
            className="w-full"
          >
            {sizeOptions.map((size) => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        ) : (
          <Input
            type="text"
            value={safeVariation.size || ""}
            onChange={(e) => onFormDataChange("size", e.target.value)}
            placeholder="Enter size"
          />
        )}
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Weight</label>
        <Input
          value={safeVariation.weight || ""}
          onChange={(e) => onFormDataChange("weight", e.target.value)}
          placeholder="Enter weight"
        />
      </div>
    </div>
  );
};

export default VariationDetailForm;
