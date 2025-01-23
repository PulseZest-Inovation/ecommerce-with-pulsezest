'use client'
import React, { useState } from 'react';
import { Input, Button, Row, Col, Card, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function PaymentSetting() {
  const [phonePeKey, setPhonePeKey] = useState('');
  const [saltKey, setSaltKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showPhonePeKey, setShowPhonePeKey] = useState(false);
  const [showSaltKey, setShowSaltKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = () => {
    // Handle submission logic
    message.success('Payment Settings Saved Successfully!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Card title="Payment Settings" bordered={false} style={{ padding: '20px' }}>
        <Row justify="center">
          <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="/phonepe.svg"
              alt="PhonePe Logo"
              width="150"
            />
            <div style={{ marginTop: '10px' }}>
              <Link href="https://www.phonepe.com/" target="_blank" rel="noopener noreferrer">
              <p className='text-blue-600'>  PhonePe Website</p>
              </Link>
            </div>
          </Col>
        </Row>

        <Space direction="vertical" style={{ width: '100%' }}>
          {/* PhonePe Key Input */}
          <div>
            <label>PhonePe Key:</label>
            <Input
              type={showPhonePeKey ? 'text' : 'password'}
              value={phonePeKey}
              onChange={(e) => setPhonePeKey(e.target.value)}
              prefix={<span style={{ fontWeight: 'bold' }}>🔑</span>}
              suffix={
                <span
                  onClick={() => setShowPhonePeKey(!showPhonePeKey)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPhonePeKey ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
            />
          </div>

          {/* Salt Key Input */}
          <div>
            <label>Salt Key:</label>
            <Input
              type={showSaltKey ? 'text' : 'password'}
              value={saltKey}
              onChange={(e) => setSaltKey(e.target.value)}
              prefix={<span style={{ fontWeight: 'bold' }}>🔑</span>}
              suffix={
                <span
                  onClick={() => setShowSaltKey(!showSaltKey)}
                  style={{ cursor: 'pointer' }}
                >
                  {showSaltKey ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
            />
          </div>

          {/* API Key Input */}
          <div>
            <label>API Key:</label>
            <Input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              prefix={<span style={{ fontWeight: 'bold' }}>🔑</span>}
              suffix={
                <span
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{ cursor: 'pointer' }}
                >
                  {showApiKey ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: '20px' }}
            block
          >
            Save Payment Settings
          </Button>
        </Space>
      </Card>
    </div>
  );
}
