import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Categories } from '@/types/categories';
import { Button, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';

interface SortableCategoryItemProps {
  category: Categories;
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
  toggleVisibility: (category: Categories) => void;
  toggleHeaderVisibility: (category: Categories) => void;
  handleDelete: (category: Categories) => void;
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({
  category,
  setEditModal,
  toggleVisibility,
  toggleHeaderVisibility,
  handleDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.cid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '5px',
    background: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='space-x-2'>
      <DragOutlined style={{ fontSize: '16px', marginRight: '10px' }} />

      <span style={{ flexGrow: 1, fontWeight: 'bold' }}>{category.name}</span>

      <Switch
        checked={category.isVisible}
        onChange={() => toggleVisibility(category)}
        style={{ marginRight: '10px' }}
        checkedChildren="Home Page"
        unCheckedChildren="Home Page"
      />
      <Switch
        checked={category.isHeaderVisible}
        onChange={() => toggleHeaderVisibility(category)}
        style={{ marginRight: '10px' }}
        checkedChildren="Header"
        unCheckedChildren="Header"
      />

      <Button icon={<EditOutlined />} onClick={() => setEditModal({ visible: true, category })} />
      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(category)} />
    </div>
  );
};

export default SortableCategoryItem;
