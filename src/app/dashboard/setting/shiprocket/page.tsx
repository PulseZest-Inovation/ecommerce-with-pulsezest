'use client'
import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import Image from 'next/image';

export default function ShipRocketPage() {
  const [shipRocketToken, setShipRocketToken] = useState('');
  const [showShipRocketToken, setShowShipRocketToken] = useState(false);

  // Fetch existing ShipRocket token when component mounts
  useEffect(() => {
    const fetchShipRocketToken = async () => {
      const data = await getDataByDocName<{token: string}>('settings', 'shipping');
      if (data && data.token) {
        setShipRocketToken(data.token);
      }
    };
    fetchShipRocketToken();
  }, []);

  const handleSubmit = async () => {
    const success = await setDocWithCustomId('settings', 'shipping', { token: shipRocketToken });
    if (success) {
      message.success('ShipRocket Token Saved Successfully!');
    } else {
      message.error('Failed to save ShipRocket Token!');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Card title="Configure your ShipRocket integration below:" bordered={false} style={{ padding: '20px' }}>
        <div className=' flex justify-center items-center'>
            <Image
            alt='shiprocket'
            height={150}
            width={150}
            src= 'https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fshiprocket.png?alt=media&token=ce4ece46-bc64-487e-aa1f-d92810f510cd'
            ></Image>
        </div>
        
        <p></p>

        <Space direction="vertical" style={{ width: '100%' }}>
          {/* ShipRocket Token Input */}
          <div>
            <label>ShipRocket Token:</label>
            <Input
              type={showShipRocketToken ? 'text' : 'password'}
              value={shipRocketToken}
              onChange={(e) => setShipRocketToken(e.target.value)}
              prefix={<span style={{ fontWeight: 'bold' }}>🔑</span>}
              suffix={
                <span
                  onClick={() => setShowShipRocketToken(!showShipRocketToken)}
                  style={{ cursor: 'pointer' }}
                >
                  {showShipRocketToken ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
            Save ShipRocket Token
          </Button>
        </Space>
      </Card>
    </div>
  );
}
