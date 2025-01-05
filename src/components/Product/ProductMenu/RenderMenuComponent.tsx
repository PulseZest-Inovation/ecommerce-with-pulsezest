import React from "react";
import Price from "../Price";
import Shipping from "../Shipping";
import LinkedProduct from "../LinkedProduct";
import { Product } from "@/types/Product";
import ProductStock from "../stock";
import GSTSelector from "../GSTSelector";
import HSN from "../HSN";
import SkuField from "../Sku";

interface ProductContentRendererProps{
    selectedKey: string;
    formData: Product;
    onFormDataChange: (key: keyof Product, value: any) => void;
}




const ProductContentRenderer: React.FC<ProductContentRendererProps> = ({
    selectedKey,
    formData,
    onFormDataChange,
  }) => {
    switch (selectedKey) {
      case "price":
        return <Price formData={formData} onFormDataChange={onFormDataChange} />;
      case "shipping":
        return (
          <Shipping formData={formData} onFormDataChange={onFormDataChange} />
        );
      case "stock":
        return <ProductStock formData={formData} onFormDataChange={onFormDataChange} />;
      case "sku":
        return (
          <SkuField formData={formData} onFormDataChange={onFormDataChange}/>
        )  
       case "GST":
        return <GSTSelector formData={formData} onFormDataChange={onFormDataChange}/>;
        case "HSN":
          return <HSN formData={formData} onFormDataChange={onFormDataChange}/> 
      default:
        return null;
    }
  };
  
  export default ProductContentRenderer; 


  
 
 