"use client";
import React, { useState, useEffect } from "react";
import { Input, Collapse } from "antd";
import { ProductType } from "@/types/ProductType";
import CollapseExpandDescription from "../SimpleProductDetailTab/CollapseExpandDescription";
import ProductShortDescription from "../SimpleProductDetailTab/ProductShortDescription";

interface ParticularVariationDetailTabsProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function ParticularVariationDetailTab({
  formData,
  onFormDataChange,
}: ParticularVariationDetailTabsProp) {
useEffect(() => {
  console.log("Form Data Updatedddd:", formData);
}, [formData]);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <label
        htmlFor="product Specification"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Product Specification
      </label>

      <CollapseExpandDescription
        formData={formData}
        onFormDataChange={onFormDataChange}
      />


      <ProductShortDescription formData={formData} onFormDataChange={onFormDataChange}></ProductShortDescription>   

    </div>
  );
}
