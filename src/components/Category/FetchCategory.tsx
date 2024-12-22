import React from 'react';
import { Menu } from 'antd';

type Props = {};

type CategoryItem = {
  key: string;
  label: string;
  children?: CategoryItem[];
};

const categories: CategoryItem[] = [
  {
    key: '1',
    label: 'Electronics',
    children: [
      { key: '1-1', label: 'Mobile Phones' },
      { key: '1-2', label: 'Laptops' },
    ],
  },
  {
    key: '2',
    label: 'Clothing',
    children: [
      { key: '2-1', label: 'Men' },
      { key: '2-2', label: 'Women' },
    ],
  },
  {
    key: '3',
    label: 'Home Appliances',
    children: [
      { key: '3-1', label: 'Refrigerators' },
      { key: '3-2', label: 'Microwaves' },
    ],
  },
];

const FetchCategory = (props: Props) => {
  const renderMenu = (items: CategoryItem[]) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} title={item.label}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      }
      return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <Menu mode="vertical" className="bg-white rounded-md shadow">
        {renderMenu(categories)}
      </Menu>
    </div>
  );
};

export default FetchCategory;
