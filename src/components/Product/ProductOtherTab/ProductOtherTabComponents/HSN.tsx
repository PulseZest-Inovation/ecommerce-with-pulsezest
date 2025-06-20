import React from 'react';
import { ProductType } from '@/types/ProductType';
import { Input } from 'antd';

interface HNS {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function HSN({ formData, onFormDataChange }: HNS) {
  return (
    <div className="lg:p-6 bg-white shadow-md rounded-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">HSN Number</h3>
      
      <div>
        <label htmlFor="HSN" className="block text-sm font-medium text-gray-700 mb-2">
          Enter HSN Number
        </label>
        <Input
          id="HSN"
          type="number"
          placeholder="Enter HSN Number"
          value={formData.HSN}
          onChange={(e) => onFormDataChange('HSN', e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}
