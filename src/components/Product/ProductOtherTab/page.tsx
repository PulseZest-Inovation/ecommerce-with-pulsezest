'use client';
import React, { useState } from 'react';
import { Menu, Drawer, Button } from 'antd';
import { ProductOtherTabMenu } from './ProductOtherTabMeu';
import ProductOtherTabComponents from './ProductOtherTabCompeont';
import { ProductType } from '@/types/ProductType';
import { MenuOutlined } from '@ant-design/icons';

interface ProductOtherTabProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function ProdutOtherTab({ formData, onFormDataChange }: ProductOtherTabProp) {
  const [selectedKey, setSelectedKey] = useState<string>('price');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuToggle = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Mobile Toggle Button */}
      <Button
        className="md:hidden absolute top-0 left-2 z-10"
        type="text"
        icon={<MenuOutlined />}
        onClick={handleMenuToggle}
      />

      {/* Menu Section for Larger Screens */}
      <div className="w-full md:w-64 flex-shrink-0 bg-gray-50 shadow-md hidden md:block">
        <Menu
          onClick={(e) => setSelectedKey(e.key)}
          className="w-full"
          defaultSelectedKeys={['price']}
          mode="inline"
          items={ProductOtherTabMenu}
          style={{ fontSize: '14px', padding: '10px' }} // Adjust the font size for smaller screens
        />
      </div>

      {/* Drawer Menu for Mobile */}
      <Drawer
        title="Product Options"
        placement="left"
        visible={drawerVisible}
        onClose={handleMenuToggle}
        className="md:hidden"
        width={250}
      >
        <Menu
          onClick={(e) => setSelectedKey(e.key)}
          className="w-full"
          defaultSelectedKeys={['price']}
          mode="inline"
          items={ProductOtherTabMenu}
          style={{ fontSize: '14px', padding: '10px' }} // Adjust for mobile
        />
      </Drawer>

      {/* Content Section */}
      <div
        className="w-full flex-grow bg-white shadow-sm overflow-auto"
        style={{
          minHeight: 'calc(100vh - 64px)', // Adjust for header height if applicable
        }}
      > 
       <div className="mx-auto w-full max-w-5xl mt-7"> {/* Added container for centering */}
          <ProductOtherTabComponents
            selectedKey={selectedKey}
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        </div>
      </div>
    </div>
  );
}
