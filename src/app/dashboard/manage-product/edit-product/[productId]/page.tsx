'use client';
import React,{useEffect, useState} from 'react';
import { Product } from '@/types/Product';
import {getDataByDocName} from '@/services/FirestoreData/getFirestoreData'
import ProductWrapper from '@/components/Product/page';
import { useParams } from 'next/navigation';
import { Spin } from 'antd';

const EditProduct = () => {
  const params = useParams();
  const productId = params?.productId;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(()=>{
    fetchProduct();
  },[productId]);

  const fetchProduct = async()=>{
    if(!productId) return;
    try {
      const fetchProduct = await getDataByDocName<Product>('products', productId.toString());
      setProduct(fetchProduct);
    } catch (error) {
      console.log('Error fetching Product')
    } finally{
      setLoading(false);
    }
  }
 
  if (loading) {
    return <Spin/>;  
  }

  if (!product) {
    return <p>Product not found.{productId}</p>;  
  }

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <p className="font-mono">/{productId}</p>
      </div>
      <ProductWrapper initialData={product}/>
    </div>
  );
};

export default EditProduct;
