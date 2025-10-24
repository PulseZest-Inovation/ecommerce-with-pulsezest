'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Product } from '@/types/Product';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import ProductWrapper from '@/components/Product/ProductWrapper/page';
import { useParams } from 'next/navigation';
import { Spin, Alert } from 'antd';

const EditProduct = () => {
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError('Product ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedProduct = await getDataByDocName<Product>('products', productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError(`Product not found for ID: ${productId}`);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error fetching product. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert
          message="Product Not Found"
          description={`No product details found for ID: ${productId}`}
          type="warning"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <p className="font-mono text-sm text-gray-500">/{productId}</p>
      </div>
      <div className="mt-4 items-center">
        <ProductWrapper initialData={product} />
      </div>
    </div>
  );
};

export default EditProduct;
