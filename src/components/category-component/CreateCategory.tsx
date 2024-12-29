'use client'

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Modal, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "@/utils/firbeaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Compressor from "compressorjs";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import CategoriesSelector from "../Selector/create-selector";
import { Categories } from "@/types/categories";

const CreateCategory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nextPosition, setNextPosition] = useState(1);

  // Fetch and calculate the next available position
  const fetchNextPosition = async () => {
    try {
      const categories = await getAllDocsFromCollection<Categories>("categories");
      const allPositions = categories
        .map((category) => category.isPosition || 0)
        .sort((a, b) => a - b);

      // Find the smallest missing position
      let newPosition = 1;
      for (const position of allPositions) {
        if (position === newPosition) {
          newPosition += 1;
        } else {
          break;
        }
      }

      setNextPosition(newPosition);
    } catch (error) {
      console.error("Error fetching categories for isPosition:", error);
      message.error("Failed to determine next position. Please try again later.");
    }
  };

  useEffect(() => {
    fetchNextPosition();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const uploadImageToFirebase = async (
    imageFile: File,
    path: string
  ): Promise<string> => {
    try {
      const compressedImage = await new Promise<File | Blob>((resolve, reject) => {
        new Compressor(imageFile, {
          quality: 0.8,
          success: resolve,
          error: reject,
        });
      });

      const fileName = `${path}/${Date.now()}-${
        compressedImage instanceof File ? compressedImage.name : "image"
      }`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, compressedImage);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image.");
    }
  };

  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
      const categories = await getAllDocsFromCollection<Categories>("categories");
      return !categories.some((category) => category.cid === slug); // Check if any category has the same slug
    } catch (error) {
      console.error("Error checking slug availability:", error);
      throw new Error("Failed to verify slug availability. Please try again.");
    }
  };

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      setModalVisible(true);

      const { image, slug, ...otherValues } = values;

      // Check if slug is already used
      let currentSlug = slug;
      let isSlugAvailable = await checkSlugAvailability(currentSlug);

      // If slug is not available, append a timestamp to create a unique slug
      if (!isSlugAvailable) {
        const timestamp = Date.now();
        currentSlug = `${slug}-${timestamp}`;
        isSlugAvailable = await checkSlugAvailability(currentSlug);
      }

      if (!isSlugAvailable) {
        throw new Error("Unable to create a unique slug. Please choose a different name.");
      }

      const imageFile = image?.[0]?.originFileObj;
      if (!imageFile) throw new Error("Image file is required!");

      const key = localStorage.getItem("securityKey");
      const imageUrl = await uploadImageToFirebase(imageFile, `${key}/categories`);

      const formData: Categories = {
        ...otherValues,
        cid: currentSlug, // Slug is used as the document ID
        slug: currentSlug, // Keep slug in the data as well
        image: imageUrl,
        count: 0,
        isPosition: nextPosition, // Assign the calculated isPosition value
      };

      // Save category data using setDocWithCustomId
      const success = await setDocWithCustomId("categories", formData.cid, formData);
      if (!success) throw new Error("Failed to save category data!");

      message.success("Category created successfully!");
      form.resetFields();
      fetchNextPosition(); // Recalculate the next position
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Failed to create category!");
      } else {
        message.error("An unknown error occurred!");
      }
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };
  

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    form.setFieldsValue({ slug });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>

      <Modal
        visible={modalVisible}
        footer={null}
        closable={false}
        centered
        bodyStyle={{ textAlign: "center" }}
      >
        <Spin size="large" />
      </Modal>

      <Form form={form} layout="vertical" onFinish={handleFinish} className="space-y-4">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the category name!" }]}
        >
          <Input
            placeholder="Enter category name"
            className="rounded-md"
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please enter the slug!" }]}
        >
          <Input placeholder="Enter slug" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Parent Category"
          name="parent"
          rules={[{ required: true, message: "Please select a parent category!" }]}
        >
          <CategoriesSelector />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea placeholder="Enter description" className="rounded-md" rows={4} />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image!" }]}
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategory;
