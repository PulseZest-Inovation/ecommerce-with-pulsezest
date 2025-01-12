'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { Product } from '@/types/Product';
import {Collapse} from 'antd';
import CategorySelector from './CategorySelector';
import ProductTagSelector from './TagsSelector';

interface ProductDetailsProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProductDetailTab({formData, onFormDataChange}: ProductDetailsProp) {
      const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  

      useEffect(() => {
        setSelectedCategories(formData.categories || []);
      }, [formData.categories]); 

 const renderExpandableDescriptions: any = () =>
    formData.description.map((section, index) => (
      <Collapse.Panel header={section.heading} key={index}>
        <Input.TextArea
          value={section.content}
          onChange={(e) =>
            handleExpandedDescriptionChange(index, e.target.value)
          }
          rows={4}
        />
      </Collapse.Panel>
    ));


    
    const handleCategoryChange = (categories: string[]) => {
      setSelectedCategories(categories);
      onFormDataChange("categories", categories);
    };

    const handleExpandedDescriptionChange = (index: number, value: string) => {
      const updatedDescriptions = [...formData.description];
      updatedDescriptions[index].content = value;
      onFormDataChange("description", updatedDescriptions); 
    };
   
  

  return (
    <div>
         <Input
            placeholder="Product Title"
            value={formData.productTitle}
            onChange={(e) => onFormDataChange("productTitle", e.target.value)}
            className="mb-4"
            required
          />
          <Input
            placeholder="Product Subtitle"
            value={formData.productSubtitle}
            onChange={(e) =>
                onFormDataChange("productSubtitle", e.target.value)
            }
            className="mb-4"
          />
          <Input.TextArea
            rows={2}
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={(e) =>
                onFormDataChange("shortDescription", e.target.value)
            }
            className="mb-4"
          />
           <Collapse  >{renderExpandableDescriptions()}</Collapse>


           <CategorySelector
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
              <ProductTagSelector
                selectedTags={formData.tags}
                onTagsChange={(tags) => onFormDataChange("tags", tags)}
                productId={formData.slug}
              />
    </div>
  )
}
