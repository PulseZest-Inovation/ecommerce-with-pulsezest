import ProductWrapper from '@/components/Product/page';
import React from 'react'

type Props = {}

const ViewProduct = (props: Props) => {
  return (
    <div> 
      {/* Pass the proudct in this to show the product */}
      <ProductWrapper/>
    </div>
  )
}

export default ViewProduct;