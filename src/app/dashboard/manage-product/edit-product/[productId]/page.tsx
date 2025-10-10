'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/Product';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import ProductWrapper from '@/components/Product/ProductWrapper/page';
import { useParams } from 'next/navigation';
import { Spin, Alert } from 'antd';

const EditProduct = () => {
  const params = useParams();
  const productId = params?.productId;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      setError('Product ID is missing.');
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const productDoc = productId?.toString() || '';
      const fetchedProduct = await getDataByDocName<Product>('products', productDoc);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Error fetching product. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
         <h5 className="text-xl bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-bold">{product.productTitle}</h5>
        <p className="font-mono text-sm text-gray-500">/{productId}</p>
      </div>
      <div className="mt-4 items-center">
        <ProductWrapper initialData={product} />
      </div>
    </div>
  );
};

export default EditProduct;
