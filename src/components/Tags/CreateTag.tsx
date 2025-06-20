'use client'
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Tags } from "@/types/Tags";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData"; 

const TagForm: React.FC = () => {
  const [formData, setFormData] = useState<Tags>({
    id: "", 
    name: "",
    slug: "",
    description: "",
    count: "0",
    tid: "", 
    isVisible:true,
  });

  const handleInputChange = (key: keyof Tags, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      if (key === "name") {
        const newSlug = generateSlug(value);
        newData.slug = newSlug;
        newData.tid = newSlug; 
      }
      return newData;
    });
  };

  const generateSlug = (name: string): string => {
    return name
      .trim()                     
      .replace(/\s+/g, '-')      
      .replace(/[^\w-]/g, '')     
      .toLowerCase();            
  };

  const handleSubmit = async () => {
    const { id, ...dataWithoutId } = formData;

    const uniqueId = formData.slug; 

    try {
      const success = await setDocWithCustomId('tags', uniqueId, {
        ...dataWithoutId,
      });

      if (success) {
        message.success("Tag Data Submitted Successfully!");
        setFormData({
          id: "",
          name: "",
          slug: "",
          description: "",
          count: "0",
          tid: "",
          isVisible: true,
        });
      } else {
        message.error("Failed to save tag data.");
      }
    } catch (error) {
      console.error('Error saving tag:', error);
      message.error("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Tag</h2>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" required>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter Tag Name"
          />
        </Form.Item>

        <Form.Item label="Slug" required>
          <Input
            value={formData.slug}
            placeholder="Generated Slug"
            readOnly 
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
            disabled
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
