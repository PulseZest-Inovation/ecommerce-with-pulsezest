import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { FooterType } from '@/types/themeTypes/FooterType';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterType | null>(null);

  // Fetch the existing footer data on component mount
  useEffect(() => {
    const fetchFooterData = async () => {
      const data = await getDataByDocName<FooterType>('theme-settings', 'footer');
      if (data) {
        setFooterData(data);
      }
    };

    fetchFooterData();
  }, []);

  // Handle form submission to save data
  const handleSubmit = async (values: FooterType) => {
    const success = await setDocWithCustomId('theme-settings', 'footer', values);
    if (success) {
      message.success('Footer data updated successfully');
    } else {
      message.error('Error updating footer data');
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold'>Footer</h2>

      {footerData ? (
        <div>
  
          <Form
            initialValues={footerData}
            onFinish={handleSubmit}
            layout="horizontal"
          >
            <Form.Item

              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input the address!' }]}
            >
              <Input.TextArea
                    placeholder="Enter the address"
                    rows={3} // You can adjust the number of rows as needed
                />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[{ required: true, message: 'Please input the contact number!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="WhatsApp Number"
              name="whatsappNumber"
              rules={[{ required: true, message: 'Please input the WhatsApp number!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Footer
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <p>Loading footer data...</p>
      )}
    </div>
  );
}
