import ProductWrapper from '@/components/Product/page'
import React from 'react'

type Props = {}

export default function AddProduct({}: Props) {
  return (
    <div> 
           <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      <ProductWrapper />
    </div>
  )
}