import React from 'react';
import { Switch, Button, InputNumber } from 'antd';
import { Categories } from '@/types/categories';

type EditModalState = {
  visible: boolean;
  category: Categories | null;
};

interface CategoryListProps {
  categories: Categories[];
  toggleVisibility: (category: Categories) => void;
  toggleHeaderVisibility: (category: Categories) => void; // New Prop
  setEditModal: React.Dispatch<React.SetStateAction<EditModalState>>;
  handleDelete: (category: Categories) => void;
  handleEditSubmit : (updateData: Partial<Categories>, categoryId:string)=> void;  //add 
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  toggleVisibility,
  toggleHeaderVisibility, // New Prop
  setEditModal,
  handleDelete,
  handleEditSubmit, //use new prop
}) => {
  return categories.map((category) => (
    <div
      key={category.cid}
      className="flex justify-between items-center p-2 bg-white border-b last:border-b-0"
    >
      <div>{category.name}</div>
      <div className="flex space-x-4">
        <Switch
          checked={category.isVisible}
          onChange={() => toggleVisibility(category)}
          checkedChildren="Visible"
          unCheckedChildren="Hidden"
        />
        <Switch
          checked={category.isHeaderVisible} // New Field
          onChange={() => toggleHeaderVisibility(category)} // New Handler
          checkedChildren="Header Visible"
          unCheckedChildren="Header Hidden"
        />
        <InputNumber //add 
          min={1}
          value={category.isPosition}
          onChange={(value) => {
            if(value){
              handleEditSubmit({isPosition:value}, category.cid)
            }
          }}
          style={{width: 70}}
          onKeyDown={(e) => e.preventDefault()}
        />
        <Button size="small" onClick={() => setEditModal({ visible: true, category })}>
          Edit
        </Button>
        <Button size="small" danger onClick={() => handleDelete(category)}>
          Delete
        </Button>
      </div>
    </div>
  ));
};

export default CategoryList;