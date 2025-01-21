import React, { useState, useEffect } from "react";
import { Typography, Select, Card, Button } from "antd";
import { Editor } from "@tinymce/tinymce-react"; // Assuming TinyMCE is used for HTML editing

const { Title } = Typography;
const { Option } = Select;

export default function EmailTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("OrderPlaced");
  const [htmlContent, setHtmlContent] = useState<string>("");

  const placeholders = {
    username: "John Doe",
    email: "johndoe@example.com",
    number: "+1234567890",
    address: "123 Main St, Springfield",
    orderDetails: "Order #12345: 2x Widgets, 1x Gadget",
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    setHtmlContent(""); // Reset the content when switching templates
  };

  const handleEditorChange = (content: string) => {
    setHtmlContent(content);
  };

  const renderPreview = () => {
    let previewContent = htmlContent;

    // Replace placeholders with actual values
    Object.keys(placeholders).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      previewContent = previewContent.replace(regex, placeholders[key as keyof typeof placeholders]);
    });

    return <div dangerouslySetInnerHTML={{ __html: previewContent }} />;
  };

  // Update the editor content when the template changes
  useEffect(() => {
    setHtmlContent("<p>Use placeholders like {{username}}, {{email}}, {{number}}, {{address}}, and {{orderDetails}}</p>");
  }, [selectedTemplate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title level={3} className="text-lg font-semibold text-center mb-4">
        Email Templates
      </Title>

      <Select
        value={selectedTemplate}
        onChange={handleTemplateChange}
        className="w-full mb-4"
        placeholder="Select a template"
      >
        <Option value="OrderPlaced">Order Placed</Option>
        <Option value="OrderPending">Order Pending</Option>
        <Option value="OrderProcessing">Order Processing</Option>
        <Option value="OrderConfirmed">Order Confirmed</Option>
        <Option value="OrderCancelled">Order Cancelled</Option>
      </Select>

      <Card className="mb-4">
        <p className="font-medium mb-2">
          Currently editing the <strong>{selectedTemplate}</strong> template.
        </p>
        <Editor
          apiKey="g43jhgrqm9nkxhhl6k0c617ht44aohpitdk5veyi6rf86i4u" // Replace with your TinyMCE API key
          initialValue="<p>Use placeholders like {{username}}, {{email}}, {{number}}, {{address}}, and {{orderDetails}}</p>"
          value={htmlContent}
          init={{
            height: 300,
            menubar: false,
            plugins: ["link", "lists", "code", "preview"],
            toolbar:
              "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code preview",
          }}
          onEditorChange={handleEditorChange}
        />
      </Card>

      <Button
        type="primary"
        className="mt-4"
        onClick={() => setHtmlContent("")} // Reset editor content on button click
      >
        Reset Content
      </Button>

      <Card className="mt-4">
        <Title level={4} className="mb-4">
          Preview:
        </Title>
        {renderPreview()}
      </Card>
    </div>
  );
}
