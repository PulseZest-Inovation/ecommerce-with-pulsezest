'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Collapse } from 'antd';
import { ProductType } from '@/types/Product';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

import 'react-quill/dist/quill.snow.css'; // Import Quill styles

interface CollapseExpandDescriptionProps {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function CollapseExpandDescription({
  formData,
  onFormDataChange,
}: CollapseExpandDescriptionProps) {
  const handleExpandedDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = formData.description.map((section, idx) =>
      idx === index ? { ...section, content: value } : section
    );
    onFormDataChange('description', updatedDescriptions);
  };

  const renderExpandableDescriptions = () =>
    formData.description.map((section, index) => (
      <Collapse.Panel header={section.heading} key={`description-${index}`}>
        {ReactQuill && (
          <ReactQuill
            value={section.content}
            onChange={(value) => handleExpandedDescriptionChange(index, value)}
            theme="snow"
            modules={modules}
            formats={formats}
            className="quill-editor" // Apply Tailwind classes
            placeholder="Write here..."
          />
        )}
      </Collapse.Panel>
    ));

  return (
    <div>
      <Collapse accordion>{renderExpandableDescriptions()}</Collapse>
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

