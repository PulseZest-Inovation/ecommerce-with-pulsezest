'use client';
import React, { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  id: string;
};

type DocumentData = {
  title?: string;
  content?: string;
  modifiedAt?: any; // added modifiedAt timestamp field
  [key: string]: any;
};

export default function PostMaker({ id }: Props) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<DocumentData>({ title: '', content: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getDataByDocName<DocumentData>('pages', id);

      if (!result) {
        setData(null); // Set data to null to trigger showing the create button
      } else {
        setData(result);
        setFormData(result);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleUpdate = async () => {
    if (data) {
      const updatedData = {
        ...formData,
        modifiedAt: new Date().toISOString(), // Store the current timestamp
      };

      await setDocWithCustomId('pages', id, updatedData);
      setData(updatedData);
      message.success('Document updated successfully!');
    }
  };

  const handleCreatePage = async () => {
    const newData = { title: '', content: '', modifiedAt: new Date().toISOString(), id: id };
    await setDocWithCustomId('pages', id, newData);
    setData(newData);
    message.success('Page created successfully!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Create a Page Now 👇🏻 click Create Page.</h2>
        <Button className="mt-2" type="primary" onClick={handleCreatePage} size="large">
          Create Page
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <div className="mt-2">
        <label className="text-1xl font-thin">
          Title:
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={{ marginBottom: '8px' }}
          />
        </label>
      </div>
      <div className="flex justify-end mb-3">
        <Button type="primary" onClick={handleUpdate} className="hover:text-black">
          Update
        </Button>
      </div>
      {ReactQuill && (
        <ReactQuill
          value={formData.content || ''}
          onChange={handleContentChange}
          theme="snow"
          modules={modules}
          formats={formats}
          className="quill-editor"
          placeholder="Write your content here..."
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

// Custom formats
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

