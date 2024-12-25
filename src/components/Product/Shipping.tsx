import React from "react";
import { Input } from "antd";
import { Product } from "@/types/Product";

interface ShippingProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const Shipping: React.FC<ShippingProps> = ({ formData, onFormDataChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
      <Input
        type="number"
        placeholder="Enter shipping amount"
        value={formData.shipping_taxable}
        onChange={(e) => onFormDataChange("shipping_taxable", e.target.value)}
        className="mb-4"
      />
    </div>
  );
};

export default Shipping;
