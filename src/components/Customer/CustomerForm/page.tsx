'use client'
import React, { useState } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Switch, Upload, message } from "antd";
import { Timestamp } from "firebase/firestore";
// import { Billing } from "./Billing";  // Assuming these are already defined
// import { Shipping } from "./Shipping"; // Assuming these are already defined
import { MetaData } from "@/types/Customer";

const CustomerForm: React.FC = () => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [metaData, setMetaData] = useState<MetaData[]>([
    { key: "loyaltyPoints", value: "150" },
    { key: "preferredContact", value: "email" },
  ]);

  // Handle Avatar Upload
  const handleAvatarUpload = ({ file }: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      message.success("Avatar uploaded successfully!");
    };
    reader.readAsDataURL(file.originFileObj);
  };

  // Handle Form Submit
  const handleSubmit = (values: any) => {
    // Add Timestamp
    const customerData = {
      ...values,
      createdAt: Timestamp.now(),
      dateModified: Timestamp.now(),
      avatarUrl: avatarUrl,
      metaData: metaData,
    };
    console.log("Customer Data:", customerData);
    message.success("Customer added successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Customer</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          {/* Left Column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please input full name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input phone number!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input address!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input a username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Is Paying Customer"
              name="isPayingCustomer"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          {/* Right Column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Avatar"
              name="avatar"
            >
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarUpload}
              >
                <Button>Upload Avatar</Button>
              </Upload>
              {avatarUrl && <img src={avatarUrl} alt="Avatar" className="mt-2 w-24 h-24 rounded-full" />}
            </Form.Item>

            {/* Billing and Shipping */}
            {/* <Billing />
            <Shipping /> */}

            {/* Meta Data (Dynamic) */}
            <Form.Item label="Meta Data" name="metaData">
              <div>
                {metaData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    <Input
                      value={data.key}
                      onChange={(e) => {
                        const updatedMetaData = [...metaData];
                        updatedMetaData[index].key = e.target.value;
                        setMetaData(updatedMetaData);
                      }}
                      placeholder="Key"
                    />
                    <Input
                      value={data.value}
                      onChange={(e) => {
                        const updatedMetaData = [...metaData];
                        updatedMetaData[index].value = e.target.value;
                        setMetaData(updatedMetaData);
                      }}
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CustomerForm;
