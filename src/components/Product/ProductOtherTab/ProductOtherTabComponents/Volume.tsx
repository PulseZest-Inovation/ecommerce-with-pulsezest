import { Product } from '@/types/Product';
import { Input } from 'antd';
import React from 'react';

interface VolumeProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function Volume({ formData, onFormDataChange }: VolumeProp) {
  // Calculate volume
  const calculateVolume = () => {
    const { height = 0, length = 0, breadth = 0 } = formData;
    return height * length * breadth;
  };

  return (
    <div className="p-4 space-y-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-center">Volume Calculator</h2>

      <div className="grid grid-cols-4 gap-4 items-center">
        <label className="col-span-1 text-right font-medium">Height:</label>
        <Input
          type="number"
          placeholder="Height"
          value={formData.height}
          onChange={(e) => onFormDataChange('height', parseFloat(e.target.value) || 0)}
          className="col-span-3 w-32"
        />

        <label className="col-span-1 text-right font-medium">Length:</label>
        <Input
          type="number"
          placeholder="Length"
          value={formData.length}
          onChange={(e) => onFormDataChange('length', parseFloat(e.target.value) || 0)}
          className="col-span-3 w-32"
        />

        <label className="col-span-1 text-right font-medium">Breadth:</label>
        <Input
          type="number"
          placeholder="Breadth"
          value={formData.breadth}
          onChange={(e) => onFormDataChange('breadth', parseFloat(e.target.value) || 0)}
          className="col-span-3 w-32"
        />

        <div className="col-span-4 text-center mt-2 text-lg font-semibold">
          Calculated Volume: {calculateVolume()} cubic units
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-center mt-4">
        <label className="col-span-1 text-right font-medium">Weight(kg):</label>
        <Input
          type="number"
          placeholder="Weight"
          value={formData.weight}
          onChange={(e) => onFormDataChange('weight', parseFloat(e.target.value) || 0)}
          className="col-span-3 w-32"
        />
      </div>
    </div>
  );
}
