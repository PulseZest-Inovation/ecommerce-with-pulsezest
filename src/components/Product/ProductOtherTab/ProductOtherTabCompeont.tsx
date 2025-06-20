import React from "react";
import Price from "./ProductOtherTabComponents/Price";
import Shipping from "./ProductOtherTabComponents/Shipping";
import { ProductType } from "@/types/Product";
import ProductStock from "./ProductOtherTabComponents/stock";
import GSTSelector from "./ProductOtherTabComponents/GSTSelector";
import HSN from "./ProductOtherTabComponents/HSN";
import SkuField from "./ProductOtherTabComponents/Sku";
import ReadyToWear from "./ProductOtherTabComponents/ReadyToWeart";
import ReturnAndExchange from "./ProductOtherTabComponents/ReturnAndExchange";
import Rating from "./ProductOtherTabComponents/Rating";
import Volume from "./ProductOtherTabComponents/Volume";
import ProductGuide from "./ProductOtherTabComponents/ProductGuide";

interface ProductContentRendererProps {
  selectedKey: string;
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

const ProductOtherTabComponents: React.FC<ProductContentRendererProps> = ({
  selectedKey,
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="w-full">
      {/* Dynamically render components based on the selectedKey */}
      {selectedKey === "price" && (
        <Price formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "shipping" && (
        <Shipping formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "returnAndExchange" && (
        <ReturnAndExchange
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      )}

{selectedKey === "guide" && (
        <ProductGuide
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      )}
         {selectedKey === "volume" && (
        <Volume
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      )}
        {selectedKey === "rating" && (
        <Rating
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      )}
      {selectedKey === "ready" && (
        <ReadyToWear formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "stock" && (
        <ProductStock formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "sku" && (
        <SkuField formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "GST" && (
        <GSTSelector formData={formData} onFormDataChange={onFormDataChange} />
      )}
      {selectedKey === "HSN" && (
        <HSN formData={formData} onFormDataChange={onFormDataChange} />
      )}
    </div>
  );
};

export default ProductOtherTabComponents;
