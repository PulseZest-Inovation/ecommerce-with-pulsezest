import React from 'react';
import { Modal } from 'antd';
import EditCategoryForm from './EditCategory';

const CategoryEditModal = ({ visible, category, onClose, onSubmit }: any) => (
  <Modal
    title="Edit Category"
    visible={visible}
    onCancel={onClose}
    footer={null}
  >
    {category && (
      <EditCategoryForm
        category={category}
        onSubmit={onSubmit}
      />
    )}
  </Modal>
);

export default CategoryEditModal;
