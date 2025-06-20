import React from "react";
import { Switch, Input, Tabs } from "antd";
import { ProductType } from "@/types/Product";

interface ReadyToWearProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

const ReadyToWear: React.FC<ReadyToWearProp> = ({
  formData,
  onFormDataChange,
}) => {
  const handleChargesChange = (
    key: keyof ProductType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Ensure the value is a number or empty string
    if (value === "" || !isNaN(Number(value))) {
      onFormDataChange(key, value === "" ? undefined : Number(value));
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Product Options
      </h3>

      <Tabs defaultActiveKey="readyToWear" centered>
        {/* Ready to Wear Tab */}
        <Tabs.TabPane tab="Ready to Wear" key="readyToWear">
          <div className="mb-6">
            <label
              htmlFor="isReadyToWear"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enable Ready to Wear Option
            </label>
            <div className="flex items-center">
              <Switch
                checked={formData.isReadyToWear}
                onChange={(checked) =>
                  onFormDataChange("isReadyToWear", checked)
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                {formData.isReadyToWear ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

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
                onChange={(e) => handleChargesChange("readyToWearCharges", e)}
                placeholder="Enter charges"
                className="w-full"
              />
            </div>
          )}
        </Tabs.TabPane>

        {/* Preplated Tab */}
        <Tabs.TabPane tab="Preplated" key="prePlated">
          <div className="mb-6">
            <label
              htmlFor="isPrePlated"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enable Preplated Option
            </label>
            <div className="flex items-center">
              <Switch
                checked={formData.isPrePlated}
                onChange={(checked) =>
                  onFormDataChange("isPrePlated", checked)
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                {formData.isPrePlated ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {formData.isPrePlated && (
            <div className="mb-6">
              <label
                htmlFor="prePlatedCharges"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preplated Charges
              </label>
              <Input
                type="number"
                value={formData.prePlatedCharges || ""}
                onChange={(e) => handleChargesChange("prePlatedCharges", e)}
                placeholder="Enter charges"
                className="w-full"
              />
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ReadyToWear;
