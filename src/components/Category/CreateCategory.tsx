import React from 'react';
import { Form, Input, Select, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

type Props = {};

const { Option } = Select;

const CreateCategory = (props: Props) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log('Form Values:', values);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the category name!' }]}
        >
          <Input placeholder="Enter category name" className="rounded-md" />
        </Form.Item>

        {/* Slug Field */}
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Please enter the slug!' }]}
        >
          <Input placeholder="Enter slug" className="rounded-md" />
        </Form.Item>

        {/* Parent Field */}
        <Form.Item
          label="Parent"
          name="parent"
          rules={[{  message: 'Please select a parent category!' }]}
        >
          <Select placeholder="Select parent category" className="rounded-md">
            <Option value="none">None</Option>
            <Option value="parent1">Parent 1</Option>
            <Option value="parent2">Parent 2</Option>
          </Select>
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description!' }]}
        >
          <Input.TextArea placeholder="Enter description" className="rounded-md" rows={4} />
        </Form.Item>

        {/* Display Field */}
        <Form.Item
          label="Display"
          name="display"
          rules={[{ required: true, message: 'Please select a display option!' }]}
        >
          <Select placeholder="Select display option" className="rounded-md">
            <Option value="grid">Grid</Option>
            <Option value="list">List</Option>
          </Select>
        </Form.Item>

        {/* Image Field */}
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: 'Please upload an image!' }]}
        >
          <Upload name="image" listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategory;
