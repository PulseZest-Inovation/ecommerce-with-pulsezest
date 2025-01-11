'use client';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import {
  InstagramOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { updateDocFields } from '@/services/FirestoreData/postFirestoreData';


const { Title } = Typography;

const SocialMediaInput: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const collectionName = 'theme-settings';
  const docName = 'social-media';

  // Fetch data from Firestore and populate the form
  const fetchSocialMediaData = async () => {
    setLoading(true);
    try {
      const data = await getDataByDocName<Record<string, string>>(collectionName, docName);
      if (data) {
        form.setFieldsValue({ user: data });
      } else {
        message.warning('No data found for social media settings.');
      }
    } catch (error) {
      console.error('Error fetching social media data:', error);
      message.error('Failed to fetch social media data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle updates
  const onUpdate = async () => {
    setLoading(true);

    try {
      // Get sanitized form values
      const sanitizedData = Object.fromEntries(
        Object.entries(form.getFieldsValue().user || {}).map(([key, value]) => [key, value || null])
      );

      const success = await updateDocFields(collectionName, docName, sanitizedData);
      if (success) {
        message.success('Social media data updated successfully!');
      } else {
        message.error('Failed to update social media data.');
      }
    } catch (error) {
      console.error('Error updating social media data:', error);
      message.error('An error occurred while updating social media data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMediaData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Social Media Handles</Title>
      <Form
        form={form}
        name="social-media-form"
        style={{ maxWidth: 600 }}
        initialValues={{ user: {} }}
      >
        {/* Instagram */}
        <Form.Item
          name={['user', 'instagram']}
          label={
            <>
              <InstagramOutlined style={{ color: '#E1306C', marginRight: 8 }} />
              Instagram
            </>
          }
        >
          <Input addonBefore="https://" placeholder="Enter Instagram handle" />
        </Form.Item>

        {/* Twitter */}
        <Form.Item
          name={['user', 'twitter']}
          label={
            <>
              <TwitterOutlined style={{ color: '#1DA1F2', marginRight: 8 }} />
              Twitter
            </>
          }
        >
          <Input addonBefore="https://" placeholder="Enter Twitter handle" />
        </Form.Item>

        {/* LinkedIn */}
        <Form.Item
          name={['user', 'linkedin']}
          label={
            <>
              <LinkedinOutlined style={{ color: '#0077B5', marginRight: 8 }} />
              LinkedIn
            </>
          }
        >
          <Input addonBefore="https://" placeholder="Enter LinkedIn profile URL" />
        </Form.Item>

        {/* Facebook */}
        <Form.Item
          name={['user', 'facebook']}
          label={
            <>
              <FacebookOutlined style={{ color: '#1877F2', marginRight: 8 }} />
              Facebook
            </>
          }
        >
          <Input addonBefore="https://" placeholder="Enter Facebook profile URL" />
        </Form.Item>

        {/* YouTube */}
        <Form.Item
          name={['user', 'youtube']}
          label={
            <>
              <YoutubeOutlined style={{ color: '#FF0000', marginRight: 8 }} />
              YouTube
            </>
          }
        >
          <Input addonBefore="https://" placeholder="Enter YouTube channel link" />
        </Form.Item>

        {/* Update Button */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            onClick={onUpdate}
            loading={loading}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SocialMediaInput;
