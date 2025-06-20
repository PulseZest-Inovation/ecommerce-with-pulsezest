import React from 'react';
import { ProductType } from '@/types/Product';
import { Select } from 'antd';

interface GSTSelectorProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function GSTSelector({ formData, onFormDataChange }: GSTSelectorProp) {
  return (
    <div className="lg:p-6 bg-white shadow-md rounded-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add GST TAX Value</h3>
      
      <div>
        <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700 mb-2">
          Select a GST Rate
        </label>
        <Select
          id="gstRate"
          showSearch
          placeholder="Select a GST Rate"
          optionFilterProp="label"
          value={formData.gstRate}
          onChange={(value) => onFormDataChange('gstRate', value)}
          style={{ width: '100%' }}
          options={[
            { value: '0', label: '0%' },
            { value: '0.1', label: '0.1%' },
            { value: '0.25', label: '0.25%' },
            { value: '3', label: '3%' },
            { value: '5', label: '5%' },
            { value: '12', label: '12%' },
            { value: '18', label: '18%' },
            { value: '28', label: '28%' },
          ]}
        />
      </div>
    </div>
  );
}
