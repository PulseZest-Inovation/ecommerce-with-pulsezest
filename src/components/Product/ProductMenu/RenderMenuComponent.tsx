import React from "react";
import Price from "../Price";
import Shipping from "../Shipping";
import LinkedProduct from "../LinkedProduct";
import { Product } from "@/types/Product";
import ProductStock from "../stock";

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
      default:
        return null;
    }
  };
  
  export default ProductContentRenderer; 