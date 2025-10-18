"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select, Input } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";

const { Option } = Select;

interface Variation {
  color: string;
  size: string[];
  image: string | null;
  [key: string]: any;
}

interface Product {
  variations?: Variation[];
}

interface ProductVariationTabProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

interface ColorAttributeValue {
  id: string;
  value: string;
  colorCode: string;
}
interface SizeAttributeValue {
  id: string;
  value: string;
}

const ProductVariationTab: React.FC<ProductVariationTabProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [variations, setVariations] = useState<Variation[]>(
    formData.variations || [{ color: "", size: [], image: null }]
  );

  const [colorOptions, setColorOptions] = useState<ColorAttributeValue[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SizeAttributeValue[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(true);

  const attributeList = [
    "Price",
    "Shipping",
    "Return & Exchange",
    "Ready",
    "Rating",
    "Guide",
    "Product Stock",
    "Volume",
    "SKU",
    "Bag",
    "GST Rate",
    "HSN Code",
  ];

  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const colors = await getAllDocsFromCollection<ColorAttributeValue>(
          "attributes/color/values"
        );
        setColorOptions(colors);

        const sizes = await getAllDocsFromCollection<SizeAttributeValue>(
          "attributes/size/values"
        );
        setSizeOptions(sizes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setLoadingAttributes(false);
      }
    };
    fetchAttributes();
  }, []);

  const handleAddVariation = () => {
    const newVariation: Variation = { color: "", size: [], image: null };
    selectedAttributes.forEach((attr) => {
      newVariation[attr.toLowerCase().replace(/ & | /g, "_")] = "";
    });
    const updated = [...variations, newVariation];
    setVariations(updated);
    onFormDataChange("variations", updated);
  };

  const handleRemoveVariation = (index: number) => {
    const updated = variations.filter((_, i) => i !== index);
    setVariations(updated);
    onFormDataChange("variations", updated);
  };

  const handleVariationChange = (index: number, field: string, value: any) => {
    const updated = [...variations];
    updated[index][field] = value;
    setVariations(updated);
    onFormDataChange("variations", updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleVariationChange(index, "image", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 text-gray-700">
        Product Variations
      </h2>

      {/* Attribute selection */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Select Extra Attributes
        </label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select attributes like Price, Shipping, etc."
          value={selectedAttributes}
          onChange={setSelectedAttributes}
        >
          {attributeList.map((attr) => (
            <Option key={attr} value={attr}>
              {attr}
            </Option>
          ))}
        </Select>
      </div>

      {loadingAttributes ? (
        <p className="text-gray-500">Loading attributes...</p>
      ) : (
        variations.map((variation, index) => (
          <div
            key={index}
            className="p-5 border border-gray-300 rounded-xl bg-gray-50 space-y-4 relative hover:shadow-md transition-shadow"
          >
            {variations.length > 1 && (
              <button
                onClick={() => handleRemoveVariation(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
              >
                <DeleteOutlined />
              </button>
            )}

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Color
              </label>
              <select
                className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:ring focus:ring-green-200 focus:border-green-400 transition"
                value={variation.color}
                onChange={(e) => handleVariationChange(index, "color", e.target.value)}
              >
                <option value="">Select Color</option>
                {colorOptions.map((color) => (
                  <option key={color.id} value={color.value}>
                    {color.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Sizes
              </label>
              <Select
                mode="multiple"
                allowClear
                placeholder="Select Sizes"
                value={variation.size}
                onChange={(values) => handleVariationChange(index, "size", values)}
                className="w-full"
              >
                {sizeOptions.map((size) => (
                  <Option key={size.id} value={size.value}>
                    {size.value}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Dynamic Extra Attributes */}
            {selectedAttributes.map((attr) => {
              const fieldKey = attr.toLowerCase().replace(/ & | /g, "_");
              return (
                <div key={attr}>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    {attr}
                  </label>
                  <Input
                    placeholder={`Enter ${attr}`}
                    value={variation[fieldKey] || ""}
                    onChange={(e) =>
                      handleVariationChange(index, fieldKey, e.target.value)
                    }
                    className="bg-white border-gray-300 text-gray-800 focus:border-green-400 focus:ring focus:ring-green-100 transition"
                  />
                </div>
              );
            })}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="w-full text-gray-600 file:mr-3 file:py-2 file:px-4 
                  file:rounded-lg file:border-0 file:bg-green-600 file:text-white 
                  hover:file:bg-green-700 cursor-pointer transition"
              />
              {variation.image && (
                <div className="mt-3">
                  <img
                    src={variation.image}
                    alt="Variation Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Add Variation Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAddVariation}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
        >
          <PlusOutlined /> Add Variation
        </button>
      </div>
    </div>
  );
};

export default ProductVariationTab;
