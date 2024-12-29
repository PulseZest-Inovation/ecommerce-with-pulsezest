'use client'

import React, { useEffect, useState } from 'react';
import { Collapse, Spin, Input, Button, Modal, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { updateDocFields } from '@/services/FirestoreData/postFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import { Categories } from '@/types/categories';



const ManageSubCategories = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    subCategory: Categories | null;
  }>({ visible: false, subCategory: null });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDocsFromCollection<Categories>('categories');
        const categoryMap: Record<string, Categories> = {};

        // Map categories by ID
        data.forEach((category) => {
          categoryMap[category.cid] = { ...category, children: [] };
        });

        // Organize into parent-child structure
        const nestedCategories: Categories[] = [];
        Object.values(categoryMap).forEach((category) => {
          if (category.parent === 'none') {
            nestedCategories.push(category);
          } else {
            const parent = categoryMap[category.parent];
            if (parent) {
              parent.children?.push(category);
            }
          }
        });

        setCategories(nestedCategories);
        setFilteredCategories(nestedCategories);
      } catch (error) {
        message.error('Failed to fetch categories.');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const lowerCaseValue = value.toLowerCase();
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(lowerCaseValue) ||
      category.children?.some((child) =>
        child.name.toLowerCase().includes(lowerCaseValue)
      )
    );

    setFilteredCategories(filtered);
  };

  const handleDeleteSubCategory = async (subCategory: Categories) => {
    Modal.confirm({
      title: 'Are you sure to delete this subcategory?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteDocFromCollection('categories', subCategory.cid);
          message.success('Subcategory deleted!');
          setCategories((prev) =>
            prev.map((cat) => ({
              ...cat,
              children: cat.children?.filter((child) => child.cid !== subCategory.cid),
            }))
          );
          setFilteredCategories((prev) =>
            prev.map((cat) => ({
              ...cat,
              children: cat.children?.filter((child) => child.cid !== subCategory.cid),
            }))
          );
        } catch (error) {
          message.error('Failed to delete subcategory.');
        }
      },
    });
  };

  const handleEditSubmit = async (values: Partial<Categories>) => {
    if (!editModal.subCategory) return;
    const { cid } = editModal.subCategory;

    try {
      await updateDocFields('categories', cid, values);
      message.success('Subcategory updated!');
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          children: cat.children?.map((child) =>
            child.cid === cid ? { ...child, ...values } : child
          ),
        }))
      );
      setFilteredCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          children: cat.children?.map((child) =>
            child.cid === cid ? { ...child, ...values } : child
          ),
        }))
      );
      setEditModal({ visible: false, subCategory: null });
    } catch (error) {
      message.error('Failed to update subcategory.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Categories and Subcategories</h2>
      
      {/* Search Input */}
      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {loading ? (
        <Spin tip="Loading categories..." />
      ) : (
        <Collapse>
          {filteredCategories.map((category) => (
            <Collapse.Panel header={category.name} key={category.cid}>
              {category.children?.length ? (
                <ul className="pl-4">
                  {category.children.map((subCategory) => (
                    <li key={subCategory.cid} className="mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={subCategory.image}
                            alt={subCategory.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              marginRight: '8px',
                              borderRadius: '4px',
                            }}
                          />
                          <div>
                            <strong>{subCategory.name}</strong>
                            <p className="text-sm text-gray-500">{subCategory.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            icon={<EditOutlined />}
                            onClick={() =>
                              setEditModal({ visible: true, subCategory })
                            }
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteSubCategory(subCategory)}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No subcategories available.</p>
              )}
            </Collapse.Panel>
          ))}
        </Collapse>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Subcategory"
        visible={editModal.visible}
        onCancel={() => setEditModal({ visible: false, subCategory: null })}
        footer={null}
      >
        {editModal.subCategory && (
          <Form
            layout="vertical"
            initialValues={{
              name: editModal.subCategory.name,
              description: editModal.subCategory.description,
            }}
            onFinish={handleEditSubmit}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManageSubCategories;
