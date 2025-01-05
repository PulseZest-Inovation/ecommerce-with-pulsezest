import React, { useState, useEffect, useRef } from 'react';
import { Input, Spin } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { Product } from '@/types/Product';

interface SkuProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function SkuField({ formData, onFormDataChange }: SkuProps) {
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null); // Timer for debouncing

  // Validate SKU uniqueness
  const validateSku = async (sku: string) => {
    if (!sku) {
      setIsUnique(null); // Reset if field is empty
      return;
    }

    setLoading(true);
    const skus = await getAllDocsFromCollection<{ skuCode: string }>('sku'); // Replace with your collection name
    const skuExists = skus.some((doc) => doc.skuCode === sku);
    setIsUnique(!skuExists); // Set uniqueness state
    setLoading(false);
  };

  // Debounced SKU validation
  const handleSkuChange = (value: string) => {
    onFormDataChange('sku', value); // Update the form data

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current); // Clear the previous timer
    }

    debounceTimer.current = setTimeout(() => {
      validateSku(value); // Validate SKU after debounce delay
    }, 500); // Adjust debounce delay as needed
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">SKU</h3>
      <Input
        placeholder="Enter Product SKU CODE"
        value={formData.sku}
        onChange={(e) => handleSkuChange(e.target.value)}
        className={`mb-4 ${
          isUnique === null
            ? ''
            : isUnique
            ? 'border-green-500'
            : 'border-red-500'
        }`}
      />
      {loading && <Spin size="small" />}
      {isUnique === false && (
        <p className="text-red-500">SKU already exists. Please choose another.</p>
      )}
      {isUnique === true && (
        <p className="text-green-500">SKU is available.</p>
      )}
    </div>
  );
}
