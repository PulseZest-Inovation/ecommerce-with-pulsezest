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
  const [editModal, setEditModal] = useState({ visible: false, category: null });
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleReorder = async (updatedCategories: Categories[]) => {
    setCategories(updatedCategories);
    setFilteredCategories(updatedCategories);

    try {
      const updates = updatedCategories.map((cat, index) =>
        updateDocFields('categories', cat.cid, { isPosition: index })
      );
      await Promise.all(updates);
      message.success('Category positions updated!');
    } catch (error) {
      message.error('Failed to update positions.');
    }
  };

  const toggleVisibility = async (category: Categories) => {
    try {
      await updateDocFields('categories', category.cid, { isVisible: !category.isVisible });
      message.success('Visibility updated!');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cid === category.cid ? { ...cat, isVisible: !category.isVisible } : cat
        )
      );
    } catch (error) {
      message.error('Failed to update visibility.');
    }
  };

  const toggleHeaderVisibility = async (category: Categories) => {
    try {
      await updateDocFields('categories', category.cid, { isHeaderVisible: !category.isHeaderVisible });
      message.success('Header visibility updated!');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cid === category.cid ? { ...cat, isHeaderVisible: !category.isHeaderVisible } : cat
        )
      );
    } catch (error) {
      message.error('Failed to update header visibility.');
    }
  };

  const handleDelete = async (category: Categories) => {
    if (category.image) await deleteImageFromFirebase(category.image);
    await deleteDocFromCollection('categories', category.cid);
    setCategories((prev) => prev.filter((cat) => cat.cid !== category.cid));
  };

  const handleEditSubmit = async (updatedData: Partial<Categories>, categoryId: string) => {
    try {
      await updateDocFields('categories', categoryId, updatedData);
      message.success('Category updated!');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cid === categoryId ? { ...cat, ...updatedData } : cat
        )
      );
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
