'use client';
import React from "react";
import { Input, Switch, Divider } from "antd";
import { Product } from "@/types/Product";

interface ShippingProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const Shipping: React.FC<ShippingProps> = ({ formData, onFormDataChange }) => {
  return (
    <div className="lg:p-6 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Shipping Details</h3>

      {/* Delivery Time Period */}
      <div className="mb-6">
        <label
          htmlFor="deliveryTimePeriod"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Delivery Time Period
        </label>
        <Input
          type="text"
          placeholder="Enter Time Period"
          value={formData.deliveryTimePeriod}
          onChange={(e) =>
            onFormDataChange("deliveryTimePeriod", e.target.value)
          }
          className="w-full"
        />
      </div>

      <Divider />

      {/* Cash on Delivery */}
      <div className="mb-6">
        <label
          htmlFor="isCashOnDelivery"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Cash on Delivery
        </label>
        <div className="flex items-center">
          <Switch
            checked={formData.isCashOnDelivery}
            onChange={(checked) =>
              onFormDataChange("isCashOnDelivery", checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
            {formData.isCashOnDelivery
              ? "Enabled"
              : "Disabled"}
          </span>
        </div>
      </div>

      <Divider />

      {/* Shipping Charges */}
      <div className="mb-6">
        <label
          htmlFor="isShippingCharge"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Shipping Charges
        </label>
        <div className="flex items-center">
          <Switch
            checked={formData.isShippingCharge}
            onChange={(checked) =>
              onFormDataChange("isShippingCharge", checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
            {formData.isShippingCharge
              ? "Enabled"
              : "Disabled"}
          </span>
        </div>
      </div>

      {/* Conditionally Render Shipping Amount */}
      {formData.isShippingCharge && (
        <div className="mb-6">
          <label
            htmlFor="shipping_taxable"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Shipping Amount
          </label>
          <Input
            type="number"
            placeholder="Enter Shipping Amount"
            value={formData.shipping_taxable}
            onChange={(e) =>
              onFormDataChange("shipping_taxable", Number(e.target.value))
            }
            className="w-full"
          />
        </div>
      )}

      <Divider />
    </div>
  );
};

export default Shipping;
