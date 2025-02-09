'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { TinyMice } from '@/config/TinyMiceConfig';
import { AppDataType } from '@/types/AppData';
import { getAppData } from '@/services/getApp';
import { setDataWithDocName } from '@/services/setFirestoreData';
import { serverTimestamp } from 'firebase/firestore';
import { getAllDocsFromCollection, getDataByDocName } from '@/services/FirestoreData/getFirestoreData';

interface TicketData {
  Subject: string;
  content: string;
  status: string;
  createdAt: any;
}

interface MessageData {
  sender: string;
  message: string;
  createdAt: any;
}

interface OpenTicketProps {
  ticketId: string | null;
}

export default function OpenTicket({ ticketId }: OpenTicketProps) {
  const [form] = Form.useForm();
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newReply, setNewReply] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);

  useEffect(() => {
    // Fetch application data
    const fetchAppData = async () => {
      try {
        const data = await getAppData<AppDataType>();
        if (data) {
          setAppData(data);
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

  useEffect(() => {
    if (ticketId) {
      setTicketLoading(true);
      const fetchTicket = async () => {
        try {
          const ticket = await getDataByDocName<TicketData>('tickets', ticketId);
          if (ticket) {
            form.setFieldsValue({ subject: ticket.Subject });
            setEditorContent(ticket.content);
          }

          // Fetch messages inside this ticket
          const messagesData = await getAllDocsFromCollection<MessageData>(`tickets/${ticketId}messages`);
          setMessages(messagesData || []);
        } catch (error) {
          console.error('Error fetching ticket:', error);
        } finally {
          setTicketLoading(false);
        }
      };

      fetchTicket();
    } else {
      form.resetFields();
      setEditorContent('');
      setMessages([]);
    }
  }, [ticketId, form]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const generateTicketId = () => `T-${Date.now().toString().slice(-6)}`;

  // ✅ Submit New Ticket
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const newTicketId = ticketId || generateTicketId();

      const ticketData: TicketData = {
        Subject: values.subject,
        content: editorContent,
        status: 'open',
        createdAt: serverTimestamp(),
      };

      await setDataWithDocName<TicketData>('tickets', newTicketId, ticketData);

      form.resetFields();
      setEditorContent('');
      setMessages([]);

      


      message.success('Ticket submitted successfully! We will reply soon.');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send Reply to Ticket
  const sendReply = async () => {
    if (!newReply.trim() || !ticketId) return;

    try {
      const messageData: MessageData = {
        sender: 'client',
        message: newReply,
        createdAt: serverTimestamp(),
      };

      await setDataWithDocName<MessageData>(`tickets/${ticketId}/messages`, Date.now().toString(),messageData);

      setMessages((prev) => [...prev, messageData]); // Update UI
      setNewReply(''); // Clear input
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error('Failed to send message.');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {ticketLoading ? (
        <Spin size="large" className="block mx-auto my-6" />
      ) : (
        <>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item label="Application Name" name="appName">
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

            <Form.Item label="Description">
              <Editor
                apiKey={TinyMice}
                init={{ height: 200, menubar: false }}
                onEditorChange={handleEditorChange}
                value={editorContent}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {ticketId ? 'Update Ticket' : 'Submit Ticket'}
              </Button>
            </Form.Item>
          </Form>

          {ticketId && (
            <>
              <h3 className="text-lg font-bold mt-6">Messages</h3>
              <div className="p-3 border rounded">
                {messages.map((msg, index) => (
                  <p key={index} className={`p-2 rounded ${msg.sender === 'client' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <strong>{msg.sender}:</strong> {msg.message}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Input value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="Type a reply..." />
                <Button type="primary" onClick={sendReply}>
                  Send
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
