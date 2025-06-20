'use client';
import React, { useEffect, useState } from 'react';
import { ProductType } from '@/types/ProductType';
import { Select, Spin } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData'; // Adjust the path accordingly

const { Option } = Select;

interface MultipleProductSelectorProps {
  value?: ProductType[]; // Accepts an array of full Product objects
  onChange?: (value: ProductType[]) => void;
}

const MultipleProductSelector: React.FC<MultipleProductSelectorProps> = ({ value = [], onChange }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Firestore
        const fetchedProducts = await getAllDocsFromCollection<ProductType>('products');
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (selectedIds: string[]) => {
    const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
    onChange?.(selectedProducts); // Pass the full selected product objects
  };

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Select
      mode="multiple"
      value={value.map((v) => v.id)} // Pass only IDs for controlled behavior
      onChange={handleChange}
      placeholder="Select products"
      className="rounded-md"
      style={{ width: '100%' }}
    >
      {products.map((product) => (
        <Option key={product.id} value={product.id}>
          {product.productTitle || product.id} {/* Display product name or fallback to ID */}
        </Option>
      ))}
    </Select>
  );
};

export default MultipleProductSelector;
