import React from "react";
import Price from "../Price";
import Shipping from "../Shipping";
import LinkedProduct from "../LinkedProduct";
import { Product } from "@/types/Product";

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
      case "linkedProduct":
        return <LinkedProduct />;
      default:
        return null;
    }
  };
  
  export default ProductContentRenderer; 