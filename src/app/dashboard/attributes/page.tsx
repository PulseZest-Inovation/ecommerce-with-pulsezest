'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Form, Input, Button, List, Space, Popconfirm, message } from 'antd';
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';

interface Attribute {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export default function Attributes() {
  const [form] = Form.useForm();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const router = useRouter(); 

  // Fetch attributes on component mount
  useEffect(() => {
    const fetchAttributes = async () => {
      const fetchedAttributes = await getAllDocsFromCollection<Attribute>('attributes');
      setAttributes(fetchedAttributes);
    };
    fetchAttributes();
  }, []);

  // Generate slug from attribute name
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Handle adding a new attribute
  const handleAddAttribute = async (values: { name: string }) => {
    const slug = generateSlug(values.name);
    const newAttribute: Attribute = {
      id: slug,
      name: values.name,
      slug,
      createdAt: new Date(),
    };

    const isSuccess = await setDocWithCustomId('attributes', slug, newAttribute);
    if (isSuccess) {
      setAttributes([...attributes, newAttribute]);
      message.success('Attribute added successfully!');
      form.resetFields();
    } else {
      message.error('Failed to add attribute. Please try again.');
    }
  };

  // Handle deleting an attribute
  const handleDelete = async (slug: string) => {
    const isSuccess = await deleteDocFromCollection('attributes', slug);
    if (isSuccess) {
      setAttributes(attributes.filter((attr) => attr.slug !== slug));
      message.success('Attribute deleted successfully!');
    } else {
      message.error('Failed to delete attribute. Please try again.');
    }
  };

  const handleNavigate = (slug: string) => {
    router.push(`attributes/${slug}`); // Navigate to the slug-based route
  };

  return (
    <div>
      <Row gutter={24}>
        {/* Left Column: Form */}
        <Col span={12}>
          <h2>Add Attribute</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddAttribute}
          >
            <Form.Item
              name="name"
              label="Attribute Name"
              rules={[{ required: true, message: 'Please enter an attribute name!' }]}
            >
              <Input placeholder="Enter attribute name" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Add Attribute
            </Button>
          </Form>
        </Col>

        {/* Right Column: Attribute List */}
        <Col span={12}>
          <h2>Added Attributes</h2>
          <List
            bordered
            dataSource={attributes}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    <strong>{item.name}</strong> ({item.slug})
                  </span>
                  <Space>
                    <Button type="text" 
                    onClick={() => handleNavigate(item.slug)}
                    icon={<SettingOutlined />} />
                    <Popconfirm
                      title="Are you sure to delete this attribute?"
                      onConfirm={() => handleDelete(item.slug)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
}
