import React, { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData'; // Update with the actual path

type Props = {};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent: string; // "none" for root categories
  description?: string;
  display?: string;
  imageUrl?: string;
  createdAt?: string;
  children?: CategoryItem[];
};

const FetchCategory = (props: Props) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all documents from the 'categories' collection
        const data = await getAllDocsFromCollection<CategoryItem>('categories');

        // Organize data into a parent-child structure
        const categoryMap: Record<string, CategoryItem> = {};
        data.forEach((category) => {
          categoryMap[category.id] = { ...category, children: [] };
        });

        const nestedCategories: CategoryItem[] = [];
        Object.values(categoryMap).forEach((category) => {
          if (category.parent === 'none') {
            // Add root-level categories
            nestedCategories.push(category);
          } else {
            // Add as a child to its parent
            const parent = categoryMap[category.parent];
            if (parent) {
              parent.children?.push(category);
            }
          }
        });

        setCategories(nestedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderMenu = (items: CategoryItem[]) => {
    return items.map((item) => {
      const itemContent = (
        <div className="flex items-center space-x-2">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-6 h-6 rounded-md"
            />
          )}
          <span>{item.name}</span>
        </div>
      );

      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.id} title={itemContent}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      }

      return <Menu.Item key={item.id}>{itemContent}</Menu.Item>;
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {loading ? (
        <Spin tip="Loading categories..." />
      ) : (
        <Menu mode="vertical" className="bg-white rounded-md shadow">
          {renderMenu(categories)}
        </Menu>
      )}
    </div>
  );
};

export default FetchCategory;
