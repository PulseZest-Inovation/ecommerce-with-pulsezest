"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Radio, Typography, message } from "antd";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { EmailType } from "@/types/EmailType";
const { Title } = Typography;

// Define the structure of email settings


export default function EmailSettingsComponent() {
  const [emailType, setEmailType] = useState<"custom" | "google">("custom");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    const settings = await getDataByDocName<EmailType>("settings", "email-setting");

    if (settings && settings.isEnabled) {
      setEmailType(settings.emailType);
      form.setFieldsValue(settings);
    } else {
      console.log("No email settings found.");
    }
  };

  const handleFormSubmit = async (values: EmailType) => {
    // Reset previous settings
    await setDocWithCustomId("settings", "email-setting", { isEnabled: false });

    const data: EmailType = {
      ...values,
      emailType,
      isEnabled: true, // Mark the current settings as enabled
    };

    const isSuccess = await setDocWithCustomId("settings", "email-setting", data);
    if (isSuccess) {
      message.success("Email settings saved successfully!");
    } else {
      message.error("Failed to save email settings. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>Email Settings</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item label="Select Email ✉️ Type:" name="emailType" initialValue="custom">
            <Radio.Group
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
            >
              <Radio value="custom">Custom Email</Radio>
              <Radio value="google">Google Email</Radio>
            </Radio.Group>
          </Form.Item>

          {emailType === "custom" && (
            <>
              <Form.Item
                label="SMTP Server"
                name="smtpServer"
                rules={[{ required: true, message: "Please enter the SMTP server!" }]}
              >
                <Input placeholder="Enter SMTP server" />
              </Form.Item>
              <Form.Item
                label="Port"
                name="port"
                rules={[{ required: true, message: "Please enter the port!" }]}
              >
                <Input placeholder="Enter port number" />
              </Form.Item>
              <Form.Item
                label="Custom Email Address"
                name="customEmail"
                rules={[
                  { required: true, message: "Please enter your email address!", type: "email" },
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password placeholder="Enter your email password" />
              </Form.Item>
            </>
          )}

          {emailType === "google" && (
            <>
              <Form.Item
                label="Google Email Address"
                name="googleEmail"
                rules={[
                  { required: true, message: "Please enter your Google email address!", type: "email" },
                ]}
              >
                <Input placeholder="Enter your Google email address" />
              </Form.Item>
              <Form.Item
                label="App Password"
                name="appPassword"
                rules={[{ required: true, message: "Please enter your app password!" }]}
              >
                <Input.Password placeholder="Enter your Google app password" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Email Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
