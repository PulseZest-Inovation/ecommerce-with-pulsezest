import React from 'react';
import { Button, Form, Input, Typography } from 'antd';
import {
  InstagramOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

// Form layout and validation messages
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};

const onFinish = (values) => {
  console.log(values);
};

const App = () => (
  <div style={{ padding: '20px' }}>
    <Title level={3}>Social Media Handles</Title>
    <Form
      {...layout}
      name="social-media-Handels"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
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
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter Instagram username" />
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
        rules={[{ type: 'email' }]}
      >
        <Input placeholder="Enter Twitter email" />
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
        <Input placeholder="Enter LinkedIn URL" />
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
        <Input placeholder="Enter Facebook profile URL" />
      </Form.Item>

      {/* Introduction */}
      <Form.Item name={['user', 'introduction']} label="Introduction">
        <Input.TextArea placeholder="Write a short introduction" />
      </Form.Item>

      {/* Save Button */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default App;
