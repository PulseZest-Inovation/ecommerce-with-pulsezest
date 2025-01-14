'use client';

import { Product } from '@/types/Product';
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

interface ProductShortDescriptionProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProductShortDescription({
  formData,
  onFormDataChange,
}: ProductShortDescriptionProps) {
  const handleDescriptionChange = (value: string) => {
    onFormDataChange('shortDescription', value);
  };

  return (
    <div className='mt-4'>
      <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-1">
        Product Short Description
      </label>
      
      {ReactQuill && (
        <ReactQuill
          value={formData.shortDescription}
          onChange={handleDescriptionChange}
          theme="snow"
          modules={modules}
          formats={formats}
          className="quill-editor mb-4 w-full"
          placeholder="Write short description here..."
        />
      )}
    </div>
  );
}

// Custom Quill modules
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['blockquote', 'code-block'],
    ['image'],
  ],
};

// Custom formats to ensure Tailwind classes are applied
const formats = [
  'header',
  'font',
  'list',
  'bullet',
  'align',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'link',
  'blockquote',
  'code-block',
  'image',
];
