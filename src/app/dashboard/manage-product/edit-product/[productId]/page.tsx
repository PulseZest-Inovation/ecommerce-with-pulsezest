'use client';

import React from 'react';
import ProductWrapper from '@/components/Product/page';
import { useParams } from 'next/navigation';

const EditProduct = () => {
  const params = useParams();
  const productId = params?.productId;

  return (
    <div>
      <div className="flex">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <p className="font-mono">{productId}</p>
      </div>
      <ProductWrapper />
    </div>
  );
};

export default EditProduct;
