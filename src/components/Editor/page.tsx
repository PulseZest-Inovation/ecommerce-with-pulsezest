import React, { useEffect, useState } from 'react';
import { Tabs, Input, Button, Alert, message } from 'antd';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import DOMPurify from 'dompurify'; // Install `dompurify` for safe HTML rendering

const { TabPane } = Tabs;
const { TextArea } = Input;

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
  const [activeTab, setActiveTab] = useState<string>('text');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getDataByDocName<DocumentData>('pages', id);

      if (!result) {
        // If no data found, create a new document with empty fields
        setData(null); // Set data to null to trigger showing the create button
      } else {
        setData(result);
        setFormData(result);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (data) {
      // Add the modifiedAt field with the current timestamp
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
    // Create the document with empty fields and a modifiedAt field
    const newData = { title: '', content: '', modifiedAt: new Date().toISOString(), id: id };
    await setDocWithCustomId('pages', id, newData);
    setData(newData);
    message.success('Page created successfully!');
  };

  const htmlPreview = DOMPurify.sanitize(formData.content || '');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Create a Page Now 👇🏻 click Create Page.</h2>
        <Button className='mt-2' type="primary" onClick={handleCreatePage} size="large">
          Create Page
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <div style={{ marginBottom: '16px' }}>
        <label>
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
      <Alert
        message="Tip"
        description="You can write HTML code in the content box. For example: <p>Hello, World!</p>"
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Text" key="text">
          <TextArea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            placeholder="Write your HTML code here. Example: <h1>Title</h1>"
          />
        </TabPane>
        <TabPane tab="HTML Preview" key="html">
          <div
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          />
        </TabPane>
      </Tabs>
      <Button type="primary" onClick={handleUpdate} style={{ marginTop: '16px' }}>
        Update
      </Button>
    </div>
  );
}
