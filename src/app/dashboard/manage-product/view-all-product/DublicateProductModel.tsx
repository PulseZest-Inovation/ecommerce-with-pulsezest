import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { Product } from '@/types/ProductType';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import slugify from 'slugify';
import { Timestamp } from 'firebase/firestore';

interface DuplicateProductModalProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
  onDuplicateSuccess: () => void;
}

const DuplicateProductModal: React.FC<DuplicateProductModalProps> = ({
  visible,
  product,
  onCancel,
  onDuplicateSuccess
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleDuplicate = async () => {
    if (!product || !newTitle.trim()) return;
  
    const newSlug = slugify(newTitle, { lower: true, strict: true });
  
    const duplicatedProduct: Product = {
      ...product,
      id: newSlug, 
      slug: newSlug,
      productTitle: newTitle,
      createdAt: Timestamp.now(), 
    };
  
    try {
      const success = await setDocWithCustomId<Product>('products', newSlug, duplicatedProduct);
      if (success) {
        onDuplicateSuccess();
        message.success("Dublicate Created")
        onCancel();
      }
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  return (
    <Modal
      title="Duplicate Product"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="duplicate" type="primary" onClick={handleDuplicate} disabled={!newTitle.trim()}>
          Duplicate
        </Button>,
      ]}
    >
      <p>Enter a new title for the duplicated product:</p>
      <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New Product Title" />
    </Modal>
  );
};

export default DuplicateProductModal;
