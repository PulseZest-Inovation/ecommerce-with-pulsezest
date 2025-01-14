import React from "react";
import { Switch, Input } from "antd";
import { Product } from "@/types/Product";

interface ReadyToWearProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const ReadyToWear: React.FC<ReadyToWearProp> = ({ formData, onFormDataChange }) => {
  const handleSwitchChange = (checked: boolean) => {
    onFormDataChange("isReadyToWear", checked);
    if (!checked) {
      onFormDataChange("readyToWearCharges", undefined); // Reset charges if disabled
    }
  };

  const handleChargesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the value is a number or empty string
    if (value === "" || !isNaN(Number(value))) {
      onFormDataChange("readyToWearCharges", value === "" ? undefined : Number(value));
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Ready to Wear Option
      </h3>

      {/* Enable/Disable Ready to Wear */}
      <div className="mb-6">
        <label
          htmlFor="isReadyToWear"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enable Ready to Wear Option
        </label>
        <div className="flex items-center">
          <Switch
            checked={formData.isReadyToWear || false}
            onChange={handleSwitchChange}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
            {formData.isReadyToWear ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Conditionally Render Ready to Wear Charges */}
      {formData.isReadyToWear && (
        <div className="mb-6">
          <label
            htmlFor="readyToWearCharges"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ready to Wear Charges
          </label>
          <Input
            type="number"
            value={formData.readyToWearCharges || ""}
            onChange={handleChargesChange}
            placeholder="Enter charges"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ReadyToWear;
