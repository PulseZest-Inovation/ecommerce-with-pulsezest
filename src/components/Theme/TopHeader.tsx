'use client'
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData'
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData'
import { TopHeaderType } from '@/types/TopHeaderType'
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Switch, message } from 'antd'

type Props = {}

export default function TopHeader({}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [topHeaderData, setTopHeaderData] = useState<TopHeaderType | null>(null);

  const getTopHeaderData = async () => {
    try {
      const data = await getDataByDocName<TopHeaderType>('theme-settings', 'topHeader');
      setTopHeaderData(data);
      if (data) {
        form.setFieldsValue({
          ...data,
          isEnable: data.isEnable === 'true',
        });
      }
    } catch (error) {
      console.error('Failed to fetch top header data:', error);
    }
  };

  const saveTopHeaderData = async (values: TopHeaderType) => {
    try {
      setLoading(true);
      const success = await setDocWithCustomId('theme-settings', 'topHeader', {
        ...values,
        isEnable: values.isEnable ? 'true' : 'false',
      });
      if (success) {
        message.success('Top header data updated successfully!');
        setTopHeaderData(values);
      } else {
        message.error('Failed to update top header data!');
      }
    } catch (error) {
      console.error('Failed to save top header data:', error);
      message.error('An error occurred while saving the data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopHeaderData();
  }, []);

  return (
    <div>
      {topHeaderData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={saveTopHeaderData}
          initialValues={{
            ...topHeaderData,
            isEnable: topHeaderData.isEnable === 'true',
          }}
        >
          <Form.Item
            label="Link"
            name="link"
            // rules={[{ required: true, message: 'Please enter the link!' }]}
          >
            <Input placeholder="Enter link" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            // rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
          <Form.Item
            label="Text"
            name="text"
            // rules={[{ required: true, message: 'Please enter the text!' }]}
          >
            <Input placeholder="Enter text" />
          </Form.Item>
          <Form.Item label="Enable" name="isEnable" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
