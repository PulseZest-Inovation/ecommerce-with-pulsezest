import React,{useState} from "react";
import { Form, Input, Button, Upload, message, Modal, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadImageToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";
import { createDocWithAutoId, setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData"; // Update path as needed
import { Categories } from "@/types/Categories";
import CategoriesSelector from "../Selector/CategorySelector";

const CreateCategory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state for the spinner
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      setModalVisible(true); // Show the modal/loader
  
      const { image, ...otherValues } = values;
  
      // Upload image to Firebase and get the URL
      const imageFile = image?.[0]?.originFileObj;
      if (!imageFile) throw new Error("Image file is required!");
  
      const imageUrl = await UploadImageToFirebase(imageFile, "categories/images");
  
      // Add the image URL to form values
      const formData: Categories = {
        ...otherValues,
        image: imageUrl,
        count: 0, // Default count value
      };
  
      console.log(formData);
      // Save the form data to Firestore
      const docId = await createDocWithAutoId("categories", formData);
      if (docId) {
        // Add the cid without overwriting the existing document
        await setDocWithCustomId('categories', docId, { cid: docId });
        message.success("Category created successfully!");
        form.resetFields();
      } else {
        throw new Error("Failed to create category document!");
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Failed to create category!");
      } else {
        message.error("An unknown error occurred!");
      }
    } finally {
      setLoading(false);
      setModalVisible(false); // Hide the modal/loader
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>
         {/* Modal for displaying loader */}
         <Modal
        visible={modalVisible}
        footer={null}
        closable={false}
        centered
        bodyStyle={{ textAlign: "center" }}
      >
        <Spin size="large" />
      </Modal>

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
          rules={[{ required: true, message: "Please enter the category name!" }]}
        >
          <Input placeholder="Enter category name" className="rounded-md" />
        </Form.Item>

        {/* Slug Field */}
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please enter the slug!" }]}
        >
          <Input placeholder="Enter slug" className="rounded-md" />
        </Form.Item>

        {/* Parent Category Field */}
        <Form.Item
          label="Parent Category"
          name="parent"
          rules={[{ required: true, message: "Please select a parent category!" }]}
        >
          <CategoriesSelector />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea placeholder="Enter description" className="rounded-md" rows={4} />
        </Form.Item>

        {/* Image Field */}
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload an image!" }]}
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
