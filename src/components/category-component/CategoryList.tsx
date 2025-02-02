import React from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableCategoryItem from './SortableCategoryItem';
import { Categories } from '@/types/categories';

interface CategoryListProps {
  categories: Categories[];
  setCategories: React.Dispatch<React.SetStateAction<Categories[]>>;
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
  handleReorder: (updatedCategories: Categories[]) => void;
  toggleVisibility: (category: Categories) => void;
  toggleHeaderVisibility: (category: Categories) => void;
  handleDelete: (category: Categories) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  setCategories,
  setEditModal,
  handleReorder,
  toggleVisibility,
  toggleHeaderVisibility,
  handleDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((cat) => cat.cid === active.id);
    const newIndex = categories.findIndex((cat) => cat.cid === over.id);

    const reorderedCategories = arrayMove(categories, oldIndex, newIndex).map(
      (cat, index) => ({
        ...cat,
        isPosition: index, // Update `isPosition`
      })
    );

    setCategories(reorderedCategories); // Update state
    handleReorder(reorderedCategories); // Callback for parent
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((cat) => cat.cid)}
        strategy={verticalListSortingStrategy}
      >
        {categories.map((category) => (
          <SortableCategoryItem
            key={category.cid}
            category={category}
            setEditModal={setEditModal}
            toggleVisibility={toggleVisibility}
            toggleHeaderVisibility={toggleHeaderVisibility}
            handleDelete={handleDelete}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default CategoryList;
