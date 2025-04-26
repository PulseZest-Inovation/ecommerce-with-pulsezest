'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Form, Input, Button, List, Popconfirm, message } from 'antd';
import { ColorPicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import { AttributeValueType } from '@/types/AttributeType/AttributeValueType';

interface ColorAttributeValueType extends AttributeValueType {
  colorCode: string; // Add colorCode property
}

export default function ColorAttributes() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [values, setValues] = useState<ColorAttributeValueType[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  const attributeId = 'color'; // Always using 'color'

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const fetchedValues = await getAllDocsFromCollection<ColorAttributeValueType>(
          `attributes/${attributeId}/values`
        );
        setValues(fetchedValues);
      } catch (error) {
        message.error('Failed to fetch color values. Please try again.');
      }
    };
    fetchValues();
  }, []);

  const handleAddValue = async (formValues: { value: string }) => {
    const newValue: ColorAttributeValueType = {
      id: Date.now().toString(),
      value: formValues.value,
      colorCode: selectedColor,
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
        message.success('Color added successfully!');
        form.resetFields();
        setSelectedColor('#000000'); // Reset color picker after adding
      } else {
        throw new Error('Failed to add color value.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to add color value. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleDeleteValue = async (id: string) => {
    try {
      const isSuccess = await deleteDocFromCollection(
        `attributes/${attributeId}/values`,
        id
      );

      if (isSuccess) {
        setValues(values.filter((val) => val.id !== id));
        message.success('Color value deleted successfully!');
      } else {
        throw new Error('Failed to delete color value.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to delete color value. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Manage Color Attributes</h2>
      <Row gutter={24}>
        <Col span={12}>
          <h3>Add New Color</h3>
          <Form form={form} layout="vertical" onFinish={handleAddValue}>
            <Form.Item
              name="value"
              label="Color Name"
              rules={[{ required: true, message: 'Please enter a color name!' }]}
            >
              <Input placeholder="Enter color name (e.g., Red, Blue, Green)" />
            </Form.Item>
            <Form.Item label="Pick Color">
              <ColorPicker
                value={selectedColor}
                onChange={(color) => setSelectedColor(color.toHexString())}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Add Color
            </Button>
          </Form>
        </Col>

        <Col span={12}>
          <h3>Existing Colors</h3>
          <List
            bordered
            dataSource={values}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: item.colorCode,
                        border: '1px solid #ccc',
                      }}
                    />
                    <div>
                      <div><strong>{item.value}</strong></div>
                      <div style={{ fontSize: 12, color: '#888' }}>{item.colorCode}</div>
                    </div>
                  </div>
                  <Popconfirm
                    title="Are you sure to delete this color?"
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
