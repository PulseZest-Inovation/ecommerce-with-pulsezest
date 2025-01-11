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
    onFormDataChange("readyToWearCharges", e.target.value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Enable Ready to Wear Option?</h3>
      <Switch
        checked={formData.isReadyToWear || false}
        onChange={handleSwitchChange}
      />
      {formData.isReadyToWear && (
        <div className="mt-4">
          <label className="block mb-1 font-medium">Ready to Wear Charges</label>
          <Input
            type="number"
            value={formData.readyToWearCharges || ""}
            onChange={handleChargesChange}
            placeholder="Enter charges"
          />
        </div>
      )}
    </div>
  );
};

export default ReadyToWear;
