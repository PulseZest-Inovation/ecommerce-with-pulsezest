'use client';

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
  ticketId: string;
  subject: string;
  content: string;
  status: string;
  clientEmail?: string;
  eventType: 'ticket_created' | 'ticket_closed' | 'ticket_reply';
  appName?: string;
  createdAt: Timestamp;
  userId: string;
}

export default function OpenTicket() {
  const [form] = Form.useForm();
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [securityKey, setSecurityKey] = useState<string>('');

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
            subject: '',
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
    form.setFieldsValue({ description: content });
  };

  const generateTicketId = () => {
    return `T-${Date.now().toString().slice(-6)}`;
  };

  const onFinish = async (values: any) => {
    if (!values.subject) {
      message.error('Please enter a subject.');
      return;
    }

    if (!editorContent) {
      message.error('Please enter a description.');
      return;
    }

    setLoading(true);
    try {
      const ticketId = generateTicketId();
      const ticketData: TicketData = {
        ticketId: ticketId,
        subject: values.subject,
        content: editorContent,
        userId: securityKey,
        clientEmail: appData?.client_email,
        eventType: 'ticket_created',
        appName: appData?.app_name,
        status: 'open',
        createdAt: serverTimestamp() as Timestamp,
      };
    
      await setDataWithDocName<TicketData>('ticket', ticketId, ticketData);
      await setDocWithCustomId<TicketData>('ticket', ticketId, ticketData);
    
      const response = await fetch('/api/ticket/send-support-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
    
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to send support email.');
    
      message.success('Ticket submitted successfully! We will reply soon.');
      form.resetFields();
      setEditorContent('');
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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

        <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please enter subject' }]}>
          <Input placeholder="Enter subject" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}