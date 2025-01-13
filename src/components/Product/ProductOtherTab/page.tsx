'use client'
import React from 'react'
import { useState } from 'react';
import { Menu } from 'antd'
import { ProductOtherTabMenu } from './ProductOtherTabMeu';
import ProductOtherTabComponents from './ProductOtherTabCompeont';
import { Product } from '@/types/Product';

interface ProductOtherTabProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProdutOtherTab({formData, onFormDataChange}: ProductOtherTabProp) {
      const [selectedKey, setSelectedKey] = useState<string>("price");
  
  return (
    <div className="flex " >
    <Menu
      onClick={(e) => setSelectedKey(e.key)}
      style={{ width: 256 }}
      defaultSelectedKeys={["price"]}
      mode="inline"
      items={ProductOtherTabMenu}
    />
    <div style={{width: '80%'}}>
    <ProductOtherTabComponents
      selectedKey={selectedKey}
      formData={formData}
      onFormDataChange={onFormDataChange}
    />
    </div>

  </div>
  )
}
