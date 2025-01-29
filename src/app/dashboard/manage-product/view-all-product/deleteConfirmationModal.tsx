import React from 'react';
import { Modal, Button, Image, message } from 'antd';
import { Product } from '@/types/Product';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';

interface DeleteConfirmationModalProps {
  visible: boolean;
  product: Product | null;
  onDeleteSuccess: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  product,
  onDeleteSuccess,
  onCancel,
}) => {

 const handleDelete = async () => {
  if (product) {
    const success = await deleteDocFromCollection('products', product.slug);
    if (success) {
      message.success(`Product ${product.slug} deleted successfully.`);
      console.log(`Product ${product.slug} deleted successfully.`);
      onDeleteSuccess();  // Re-fetch products in the parent component
      onCancel();  // Close the modal
    } else {
      console.error(`Failed to delete product ${product.slug}.`);
    }
  }
};


  return (
    <Modal
      title="Confirm Deletion"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          No
        </Button>,
        <Button key="submit" type="primary" danger onClick={handleDelete}>
          Yes
        </Button>,
      ]}
    >
      {product && (
        <div style={{ textAlign: 'center' }}>
          <Image
            src={product.featuredImage}
            alt={product.slug}
            width={100}
            style={{ marginBottom: 16 }}
          />
          <h3>Are you sure you want to delete this product?</h3>
          <p className='text-1xl font-bold'>
             {product.id}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default DeleteConfirmationModal;
