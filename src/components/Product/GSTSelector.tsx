import React from 'react';
import { Product } from '@/types/Product';
import { Select } from 'antd';

interface GSTSelectorProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function GSTSelector({ formData, onFormDataChange }: GSTSelectorProp) {
  return (
    <div className='py-2 pl-2' >
        <h1 className='mb-3 text-1xl font-bold'>Add GST TAX Value</h1>
      <Select
        showSearch
        placeholder="Select a GST RATE"
        optionFilterProp="label"
        value={formData.gstRate} // Assuming `gstRate` exists in Product type
        onChange={(value) => onFormDataChange('gstRate', value)} // Update formData on selection
        style={{ width: '200px' }}
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
  );
}
