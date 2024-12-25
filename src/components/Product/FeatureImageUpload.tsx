// components/Product/FeaturedImageUpload.tsx
import React from "react";
import { Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadImageToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";

interface FeaturedImageUploadProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  slug: string;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({ featuredImage, onFeaturedImageChange, slug }) => {
  const handleFeaturedUpload = async ({ file }: any) => {
    try {
      const uploadedUrl = await UploadImageToFirebase(file, `products/${slug}/featuredImage`);
      if (uploadedUrl) {
        onFeaturedImageChange(uploadedUrl);
        message.success("Featured image uploaded successfully!");
      }
    } catch (error) {
      message.error("Error uploading featured image.");
    }
  };

  return (
    <div>
      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFeaturedUpload}
        className="mb-4"
      >
        <Button icon={<PlusOutlined />}>Upload Featured Image</Button>
      </Upload>
      {featuredImage && <img src={featuredImage} alt="Featured" className="w-full mb-4" />}
    </div>
  );
};

export default FeaturedImageUpload;
