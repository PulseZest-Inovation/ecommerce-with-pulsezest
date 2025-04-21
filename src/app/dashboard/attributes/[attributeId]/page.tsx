'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Row, Col, Form, Input, Button, List, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import { AttributeValueType } from '@/types/AttributeType/AttributeValueType';

export default function ManageAttribute() {
  const router = useRouter();
  const params = useParams(); // Get all route parameters
  const attributeId = params?.attributeId as string; // Ensure `attributeId` is correctly extracted as a string
  const [form] = Form.useForm();
  const [values, setValues] = useState<AttributeValueType[]>([]);

  // Fetch existing attribute values on mount
  useEffect(() => {
    if (attributeId) {
      const fetchValues = async () => {
        try {
          const fetchedValues = await getAllDocsFromCollection<AttributeValueType>(
            `attributes/${attributeId}/values`
          );
          setValues(fetchedValues);
        } catch (error) {
          message.error('Failed to fetch values. Please try again.');
        }
      };
      fetchValues();
    }
  }, [attributeId]);

  // Handle adding a new value
  const handleAddValue = async (formValues: { value: string }) => {
    if (!attributeId) {
      message.error('Attribute ID is missing!');
      return;
    }

    const newValue: AttributeValueType = {
      id: Date.now().toString(),
      value: formValues.value,
      createdAt: new Date(),
    };

    try {
      const isSuccess = await setDocWithCustomId(
        `attributes/${attributeId}/values`,
        newValue.id,
        newValue
      );

      if (isSuccess) {
        setValues([...values, newValue]);
        message.success('Value added successfully!');
        form.resetFields();
      } else {
        throw new Error('Failed to add value.');
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(error.message || 'Failed to add value. Please try again.');
        } else {
          message.error('An unexpected error occurred. Please try again.');
        }
      }
  };

  // Handle deleting a value
  const handleDeleteValue = async (id: string) => {
    if (!attributeId) {
      message.error('Attribute ID is missing!');
      return;
    }

    try {
      const isSuccess = await deleteDocFromCollection(
        `attributes/${attributeId}/values`,
        id
      );

      if (isSuccess) {
        setValues(values.filter((val) => val.id !== id));
        message.success('Value deleted successfully!');
      } else {
        throw new Error('Failed to delete value.');
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(error.message || 'Failed to add value. Please try again.');
        } else {
          message.error('An unexpected error occurred. Please try again.');
        }
      }
  };

  return (
    <div>
      <h2>Manage Attribute: {attributeId || 'Loading...'}</h2>
      <Row gutter={24}>
        {/* Left Column: Form */}
        <Col span={12}>
          <h3>Add New Value</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddValue}
          >
            <Form.Item
              name="value"
              label="Value"
              rules={[{ required: true, message: 'Please enter a value!' }]}
            >
              <Input placeholder="Enter value (e.g., Red, Blue, Orange)" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Add Value
            </Button>
          </Form>
        </Col>

        {/* Right Column: List of Values */}
        <Col span={12}>
          <h3>Existing Values</h3>
          <List
            bordered
            dataSource={values}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{item.value}</span>
                  <Popconfirm
                    title="Are you sure to delete this value?"
                    onConfirm={() => handleDeleteValue(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
}
