// components/Product/GalleryUpload.tsx
import React from "react";
import { Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadImageToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";
import { Product } from "@/types/Product";

interface GalleryUploadProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const handleGalleryUpload = async ({ fileList }: any) => {
    const newGalleryImages: string[] = [...galleryImages];

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        return false; // Prevent upload
      }

      try {
        const uploadedUrl = await UploadImageToFirebase(file.originFileObj, `products/${slug}/galleryImages`);
        if (uploadedUrl) {
          newGalleryImages.push(uploadedUrl);
        }
      } catch (error) {
        message.error("Error uploading gallery images.");
      }
    }

    onGalleryChange(newGalleryImages);
    message.success("Gallery images uploaded successfully!");
  };

  return (
    <Upload
      listType="picture-card"
      multiple
      beforeUpload={() => false}
      onChange={handleGalleryUpload}
      className="mb-4"
    >
      <div>
        <PlusOutlined />
        <div>Upload Gallery</div>
      </div>
    </Upload>
  );
};

export default GalleryUpload;
