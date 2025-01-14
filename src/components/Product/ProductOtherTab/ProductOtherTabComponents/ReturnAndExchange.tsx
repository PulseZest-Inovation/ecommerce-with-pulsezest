import { Product } from "@/types/Product";
import React from "react";
import { Input, Switch, Divider } from "antd";

interface ReturnAndExchangeProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ReturnAndExchange({
  formData,
  onFormDataChange,
}: ReturnAndExchangeProps) {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Return and Exchange Policy
      </h3>

      {/* Enable/Disable Return Policy */}
      <div className="mb-6">
        <label
          htmlFor="isReturn"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enable/Disable Return Policy
        </label>
        <div className="flex items-center">
          <Switch
            checked={formData.isReturn}
            onChange={(checked) => onFormDataChange("isReturn", checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
            {formData.isReturn ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Conditionally Render Return Period */}
      {formData.isReturn && (
        <>
          <Divider />
          <div className="mb-6">
            <label
              htmlFor="returnPeriod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Return Period
            </label>
            <Input
              type="text"
              placeholder="Enter Return Period"
              value={formData.returnPeriod}
              onChange={(e) =>
                onFormDataChange("returnPeriod", e.target.value)
              }
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
