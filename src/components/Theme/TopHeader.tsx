'use client'
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData'
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData'
import { TopHeaderType } from '@/types/TopHeaderType'
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Switch, message, Row, Col, Divider } from 'antd'

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
    <div className="container mx-auto p-6">
     <Divider orientation="left" className='text-2xl'>Edit Top Header</Divider>
      <Row justify="end" className="mb-4">
        <Col>
          <Form.Item label="Enable" name="isEnable" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
    
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Link"
                name="link"
                rules={[{ required: true, message: 'Please enter the link!' }]}
              >
                <Input placeholder="Enter link" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Text"
                name="text"
              >
                <Input placeholder="Enter text" />
              </Form.Item>
            </Col>
             
          </Row>
          <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter the description!' }]}
              >
                <Input.TextArea placeholder="Enter description" rows={3} cols={2} style={{width: '600px'}}/>
              </Form.Item>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
