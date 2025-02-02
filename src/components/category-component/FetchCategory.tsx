'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Input, message } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { updateDocFields } from '@/services/FirestoreData/postFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import { deleteImageFromFirebase } from '@/services/FirebaseStorage/deleteImageToFirebase';
import { Categories } from '@/types/categories';
import CategoryList from './CategoryList';
import CategoryEditModal from './CategoryEditWithModel';

const FetchCategory = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editModal, setEditModal] = useState<{ visible: boolean; category: Categories | null }>({
    visible: false,
    category: null,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDocsFromCollection<Categories>('categories');
        const categoryMap: Record<string, Categories> = {};

        data.forEach((category) => {
          categoryMap[category.cid] = { ...category, children: [] };
        });

        const nestedCategories: Categories[] = [];
        Object.values(categoryMap).forEach((category) => {
          if (category.parent === 'none') {
            nestedCategories.push(category);
          } else {
            const parent = categoryMap[category.parent];
            if (parent) parent.children?.push(category);
          }
        });

        setCategories(nestedCategories);
        setFilteredCategories(nestedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleReorder = async (updatedCategories: Categories[]) => {
    setCategories(updatedCategories);
    setFilteredCategories(updatedCategories);

    try {
      await Promise.all(
        updatedCategories.map((cat, index) =>
          updateDocFields('categories', cat.cid, { isPosition: index })
        )
      );
      message.success('Category positions updated!');
    } catch (error) {
      message.error('Failed to update positions.');
    }
  };
  const toggleVisibility = async (category: Categories) => {
    try {
      const updatedCategory = { ...category, isVisible: !category.isVisible };
      await updateDocFields('categories', category.cid, { isVisible: updatedCategory.isVisible });
  
      setCategories(prev =>
        prev.map(cat => (cat.cid === category.cid ? updatedCategory : cat))
      );
      setFilteredCategories(prev =>
        prev.map(cat => (cat.cid === category.cid ? updatedCategory : cat))
      );
  
      message.success('Visibility updated!');
    } catch (error) {
      message.error('Failed to update visibility.');
    }
  };
  
  const toggleHeaderVisibility = async (category: Categories) => {
    try {
      const updatedCategory = { ...category, isHeaderVisible: !category.isHeaderVisible };
      await updateDocFields('categories', category.cid, { isHeaderVisible: updatedCategory.isHeaderVisible });
  
      setCategories(prev =>
        prev.map(cat => (cat.cid === category.cid ? updatedCategory : cat))
      );
      setFilteredCategories(prev =>
        prev.map(cat => (cat.cid === category.cid ? updatedCategory : cat))
      );
  
      message.success('Header visibility updated!');
    } catch (error) {
      message.error('Failed to update header visibility.');
    }
  };
  

  const handleDelete = async (category: Categories) => {
    try {
      if (category.image) await deleteImageFromFirebase(category.image);
      await deleteDocFromCollection('categories', category.cid);
      const updatedCategories = categories.filter((cat) => cat.cid !== category.cid);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      message.success('Category deleted successfully.');
    } catch (error) {
      message.error('Failed to delete category.');
    }
  };

  const handleEditSubmit = async (updatedData: Partial<Categories>, categoryId: string) => {
    try {
      await updateDocFields('categories', categoryId, updatedData);
      message.success('Category updated!');

      const updatedCategories = categories.map((cat) =>
        cat.cid === categoryId ? { ...cat, ...updatedData } : cat
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      setEditModal({ visible: false, category: null });
    } catch (error) {
      message.error('Failed to update category.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {loading ? (
        <Spin tip="Loading categories..." />
      ) : (
        <div className="bg-white rounded-md shadow">
          <CategoryList
            categories={filteredCategories}
            setCategories={setCategories}
            setEditModal={setEditModal}
            handleReorder={handleReorder}
            toggleVisibility={toggleVisibility}
            toggleHeaderVisibility={toggleHeaderVisibility}
            handleDelete={handleDelete}
          />
        </div>
      )}

      <CategoryEditModal
        visible={editModal.visible}
        category={editModal.category}
        onClose={() => setEditModal({ visible: false, category: null })}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default FetchCategory;
