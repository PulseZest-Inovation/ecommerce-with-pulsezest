'use client'

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { TinyMice } from '@/config/TinyMiceConfig';
import { AppDataType } from '@/types/AppData';
import { getAppData } from '@/services/getApp';
import { setDataWithDocName } from '@/services/setFirestoreData';
import { serverTimestamp } from 'firebase/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';

interface TicketData {
  Subject: string,
  content: string,
  status: string,
  createdAt: Timestamp
}

export default function OpenTicket() {
  const [form] = Form.useForm();
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [securityKey, setSecurityKey]  = useState< string>(''); 
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const data = await getAppData<AppDataType>();
        if (data) {
          setAppData(data);
          setSecurityKey(data?.uid);
          form.setFieldsValue({
            appName: data.app_name,
            companyEmail: data.client_email,
            phoneNumber: data.client_phone,
          });
        }
      } catch (error) {
        console.error('Error fetching app data:', error);
      }
    };
    fetchAppData();
  }, [form]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const genrateTicketId = ()=>{
    return `T-${Date.now().toString().slice(-6)}`;
  }

  // ✅ Submit Handler
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const ticketId = genrateTicketId();

      const payload = {
        subject: values.subject,
        securityKey: securityKey, 
        clientEmail: appData?.client_email,
        appName: appData?.app_name,
        content: editorContent,
        status: 'open',
      };

      const TicketData: TicketData = {
        Subject: values.subject,
        content: editorContent,
        status: 'open',
        createdAt: serverTimestamp() as Timestamp
      }

      const status1 = await setDataWithDocName<TicketData>('ticket', ticketId, TicketData);
      const status2 = await setDocWithCustomId<TicketData>('ticket', ticketId,TicketData );

      const response = await fetch('/api/ticket/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && status1 && status2) {
        form.resetFields(); // Reset form after success
        setEditorContent(''); // Reset TinyMCE content
      } else {
        console.error(result.message || 'Failed to submit ticket.');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      message.success('Ticket submitted successfully!, We will replay it soon..');
    }
  };

  return (
    <div style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        
        {/* Row for Application Name, Email, and Phone Number */}
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item label="Application Name" name="appName" rules={[{ required: true, message: 'Please enter application name' }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label="Email" name="companyEmail">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Subject */}
        <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please enter subject' }]}>
          <Input placeholder="Enter subject" />
        </Form.Item>

        {/* TinyMCE Editor */}
        <Form.Item label="Description" name="description">
          <Editor
            apiKey={TinyMice}
            init={{
              height: 200,
              menubar: false,
              plugins: ['advlist autolink lists link image charmap print preview anchor'],
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
            }}
            onEditorChange={handleEditorChange}
            value={editorContent}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}