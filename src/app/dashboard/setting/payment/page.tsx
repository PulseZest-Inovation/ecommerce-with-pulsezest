'use client'
import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Card, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import Link from 'next/link';
import Image from 'next/image';

export default function PaymentSetting() {
  const [phonePeKey, setPhonePeKey] = useState('');
  const [showPhonePeKey, setShowPhonePeKey] = useState(false);

  // Fetch existing secret key when component mounts
  useEffect(() => {
    const fetchPhonePeKey = async () => {
      const data = await getDataByDocName<{secretKey: string}>('settings', 'payment');
      if (data && data.secretKey) {
        setPhonePeKey(data.secretKey);
      }
    };
    fetchPhonePeKey();
  }, []);

  const handleSubmit = async () => {
    const success = await setDocWithCustomId('settings', 'payment', { secretKey: phonePeKey });
    if (success) {
      message.success('Payment Settings Saved Successfully!');
    } else {
      message.error('Failed to save Payment Settings!');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Card title="Payment Settings" bordered={false} style={{ padding: '20px' }}>
        <Row justify="center">
          <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className='flex space-x-1 justify-center items-center'>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fphone-business.ico?alt=media&token=8b9a7093-5510-461b-9a3f-3b7bb646c277"
              alt="PhonePe Logo"
              width={40}
              height={40}
            />
            <h1 className='text-green-600 font-bold text-2xl text-center'>PhonePe</h1>
            </div>
           
            <div style={{ marginTop: '10px' }}>
              <Link href="https://business.phonepe.com/" target="_blank" rel="noopener noreferrer" className='text-blue-600'>
                View PhonePe Dashboard
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
