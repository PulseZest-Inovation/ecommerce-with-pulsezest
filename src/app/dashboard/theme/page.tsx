'use client'
import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

// Define the menu items
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: 'Top Header' },
  { key: '2', icon: <DesktopOutlined />, label: 'Categories' },
  { key: '3', icon: <ContainerOutlined />, label: 'Image Carousel' },
];

type Props = {}

const ThemePage = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('1'); // Track selected menu item

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Handle menu item click to update the selected key
  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
  };

  // Conditionally render components based on selected menu item
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <div>Top Header Content</div>;
      case '2':
        return <div>Categories Content</div>;
      case '3':
        return <div>Image Carousel Content</div>;
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className='flex'>
      <div >
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          onClick={handleMenuClick} // Set selected key on menu item click
          selectedKeys={[selectedKey]} // Control selected key
          items={items}
        />
      </div>
      <div className='pl-5'>
        {renderContent()} {/* Render content based on selected menu item */}
      </div>
    </div>
  );
}

export default ThemePage;
