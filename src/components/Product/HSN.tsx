import React from 'react'
import { Product } from '@/types/Product';
import { Input } from 'antd';

interface HNS{
      formData: Product;
      onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function HSN({formData, onFormDataChange}: HNS) {
  return (
    <div>
    <h3 className="text-lg font-semibold mb-2">HSN Number</h3>
    <Input
      type="number"
      placeholder="Enter HSN Number"
      value={formData.HSN}
      onChange={(e) => onFormDataChange("HSN", e.target.value)}
      className="mb-4"
    />
  </div>
  )
}
