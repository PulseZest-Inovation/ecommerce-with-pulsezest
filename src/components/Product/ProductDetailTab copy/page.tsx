import React from 'react'
import { Input } from 'antd';
import { Product } from '@/types/Product';
import {Collapse} from 'antd';
import CategorySelector from '@/components/Product-old/ProductCategorySelector';

interface ProductDetailsProp {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProductDetailTab({formData, onFormDataChange}: ProductDetailsProp) {
      const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  


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
      setFormData((prev) => ({ ...prev, categories }));
    };

    const handleExpandedDescriptionChange = (index: number, value: string) => {
      const updatedDescriptions = [...formData.description];
      updatedDescriptions[index].content = value;
      setFormData((prev) => ({ ...prev, description: updatedDescriptions }));
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
              <Tags
                selectedTags={formData.tags}
                onTagsChange={(tags) => handleInputChange("tags", tags)}
                productId={formData.slug}
              />
    </div>
  )
}
