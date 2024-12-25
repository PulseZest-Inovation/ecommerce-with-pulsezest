'use client'
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Tags } from "@/types/Tags";

const TagForm: React.FC = () => {
  const [formData, setFormData] = useState<Tags>({
    id: "",  // You can ignore this field, as it will be managed externally
    name: "",
    slug: "",
    description: "",
    count: "0",
  });

  const handleInputChange = (key: keyof Tags, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Remove id before submission if you don't want to send it
    const { id, ...dataWithoutId } = formData;
    console.log("Form Data:", dataWithoutId);
    message.success("Tag Data Submitted Successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Tag</h2>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name">
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter Tag Name"
          />
        </Form.Item>

        <Form.Item label="Slug">
          <Input
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            placeholder="Enter Tag Slug"
          />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter Tag Description"
          />
        </Form.Item>

        <Form.Item label="Count">
          <Input
            value={formData.count}
            onChange={(e) => handleInputChange("count", e.target.value)}
            placeholder="Enter Tag Count"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TagForm;
