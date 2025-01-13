import React from "react";
import Price from "./ProductOtherTabComponents/Price";
import Shipping from "./ProductOtherTabComponents/Shipping";
import { Product } from "@/types/Product";
import ProductStock from "./ProductOtherTabComponents/stock";
import GSTSelector from "./ProductOtherTabComponents/GSTSelector";
import HSN from "./ProductOtherTabComponents/HSN";
import SkuField from "./ProductOtherTabComponents/Sku";
import ReadyToWear from "./ProductOtherTabComponents/ReadyToWeart";

interface ProductContentRendererProps{
    selectedKey: string;
    formData: Product;
    onFormDataChange: (key: keyof Product, value: any) => void;
}




const ProductOtherTabComponents: React.FC<ProductContentRendererProps> = ({
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
        case "readyToWear":
          return (
            <ReadyToWear formData={formData} onFormDataChange={onFormDataChange} />
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
  
  export default ProductOtherTabComponents; 


  
 
 