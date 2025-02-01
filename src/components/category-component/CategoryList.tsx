import React from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableCategoryItem from './SortableCategoryItem'
import { Categories } from '@/types/categories';

interface CategoryListProps {
  categories: Categories[];
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
  handleReorder: (updatedCategories: Categories[]) => void;
  toggleVisibility: (category: Categories) => void;
  toggleHeaderVisibility: (category: Categories) => void;
  handleDelete: (category: Categories) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  setEditModal,
  handleReorder,
  toggleVisibility,
  toggleHeaderVisibility,
  handleDelete,
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.cid === active.id);
      const newIndex = categories.findIndex((cat) => cat.cid === over.id);
      handleReorder(arrayMove(categories, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={categories.map((cat) => cat.cid)} strategy={verticalListSortingStrategy}>
        {categories.map((category) => (
          <SortableCategoryItem  handleDelete={handleDelete} toggleHeaderVisibility={toggleHeaderVisibility} toggleVisibility={toggleVisibility} key={category.cid} category={category} setEditModal={setEditModal} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default CategoryList;
