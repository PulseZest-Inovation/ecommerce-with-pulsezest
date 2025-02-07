import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { updateDocWithCustomId } from '@/services/FirestoreData/updateFirestoreData';
import { Categories } from '@/types/categories';
import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import SortableItem from './SortableItem';
import { message } from 'antd';

export default function HomeTheme() {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllDocsFromCollection<Categories>('categories');
      if (data) {
        const filteredCategories = data
          .filter((category) => category.parent === 'none')
          .sort((a, b) => a.isPosition - b.isPosition);
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((cat) => cat.cid === active.id);
    const newIndex = categories.findIndex((cat) => cat.cid === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);

    try {
      for (let i = 0; i < newCategories.length; i++) {
        await updateDocWithCustomId('categories', newCategories[i].cid, { isPosition: i });
      }
      message.success('Category positions updated successfully!');
    } catch (error) {
      console.error('Error updating category positions:', error);
    }
  };

  return (
    <div className="p-4 w-full max-w-screen-lg mx-auto">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((cat) => cat.cid)} strategy={verticalListSortingStrategy}>
          {categories.map((category) => (
            <SortableItem key={category.cid} id={category.cid} name={category.name} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
