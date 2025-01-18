'use client'
import React, { useState } from 'react';
import { Menu } from 'antd';
import { ProductOtherTabMenu } from './ProductOtherTabMeu';
import ProductOtherTabComponents from './ProductOtherTabCompeont';
import { Product } from '@/types/Product';

interface ProductOtherTabProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProdutOtherTab({ formData, onFormDataChange }: ProductOtherTabProp) {
  const [selectedKey, setSelectedKey] = useState<string>('price');

  return (
    <div className="flex flex-col md:flex-row">
      {/* Menu Section */}
      <Menu
        onClick={(e) => setSelectedKey(e.key)}
        className="w-full md:w-64"
        defaultSelectedKeys={['price']}
        mode="inline"
        items={ProductOtherTabMenu}
      />
      {/* Content Section */}
      <div className="w-full md:w-[80%] mt-4 md:mt-0">
        <ProductOtherTabComponents
          selectedKey={selectedKey}
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </div>
    </div>
  );
}
