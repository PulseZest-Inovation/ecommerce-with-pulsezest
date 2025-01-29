import React, { useState, useEffect } from "react";
import { Typography, Select, Card, Button, message } from "antd";
import { Editor } from "@tinymce/tinymce-react"; // Assuming TinyMCE is used for HTML editing
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData"; // Your Firestore data fetching function

const { Title } = Typography;
const { Option } = Select;

interface EmailTemplates {
  OrderPlaced?: string;
  OrderPending?: string;
  OrderProcessing?: string;
  OrderConfirmed?: string;
  OrderCancelled?: string;
  [key: string]: string | undefined; // Allow dynamic keys if needed
}

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

  // Function to fetch the existing template data from Firestore
  const fetchTemplateContent = async (templateName: string) => {
    try {
      const data = await getDataByDocName<EmailTemplates>("settings", "email-setting");
      if (data && data[templateName]) {
        setHtmlContent(data[templateName]);
      } else {
        setHtmlContent("<p>Use placeholders like {{username}}, {{email}}, {{number}}, {{address}}, and {{orderDetails}}</p>");
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
      message.error("Error fetching template data.");
    }
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    fetchTemplateContent(value); // Fetch the selected template's content from Firestore
  };

  const handleEditorChange = (content: string) => {
    setHtmlContent(content); // Update the local state with editor content, but no save here
  };

  // Function to save the template content to Firestore
  const saveTemplateContent = async (content: string) => {
    try {
      const data = {
        [selectedTemplate]: content,
      };

      const success = await updateDocWithCustomId("settings", "email-setting", data);
      if (success) {
        message.success("Template saved successfully.");
      } else {
        message.error("Failed to save template.");
      }
    } catch (error) {
      console.error("Error saving template content:", error);
      message.error("Error saving template content.");
    }
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
    fetchTemplateContent(selectedTemplate); // Fetch content when the component mounts or template changes
  }, [selectedTemplate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title level={3} className="text-lg font-semibold text-center mb-4">
        Email Templates
      </Title>

    

      <Select
        value={selectedTemplate}
        onChange={handleTemplateChange}
        className="w-full"
        placeholder="Select a template"
      >
        <Option value="OrderPlaced">Order Placed</Option>
        <Option value="OrderPending">Order Pending</Option>
        <Option value="OrderProcessing">Order Processing</Option>
        <Option value="OrderConfirmed">Order Confirmed</Option>
        <Option value="OrderCancelled">Order Cancelled</Option>
      </Select>

     <div className="flex justify-evenly max-w-full p-2">
     <Button
        type="default"
        className="mt-4 bg-red-400"
        onClick={() => setHtmlContent("")} // Reset editor content on button click
      >
        Reset Content
      </Button>

      <Button
        type="primary"
        className="mt-4 ml-4"
        onClick={() => saveTemplateContent(htmlContent)} // Manually save the template content
      >
        Save Template
      </Button>
     </div>

      <Card className="mb-4">
        <p className="font-medium mb-2">
          Currently editing the <strong>{selectedTemplate}</strong> template.
        </p>
        <Editor
          apiKey="g43jhgrqm9nkxhhl6k0c617ht44aohpitdk5veyi6rf86i4u" // Replace with your TinyMCE API key
          initialValue="<p>Use placeholders like {{username}}, {{email}}, {{number}}, {{address}}, and {{orderDetails}}</p>"
          value={htmlContent}
          init={{
            height: 400,
            menubar: true,
            plugins: ["link", "lists", "code", "preview", ],
            toolbar:
              "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code preview",
          }}
          onEditorChange={handleEditorChange}
        />
      </Card>

   

      <Card className="mt-4">
        <Title level={4} className="mb-4">
          Preview:
        </Title>
        {renderPreview()}
      </Card>
    </div>
  );
}
