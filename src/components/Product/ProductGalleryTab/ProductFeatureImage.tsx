'use client';
import React, { useState } from "react";
import { Upload, Button, message, Progress, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "@/config/firbeaseConfig"; // Assuming Firebase configuration is already set
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface FeaturedImageUploadProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  slug: string;
}

const ProductFeatureImage: React.FC<FeaturedImageUploadProps> = ({
  featuredImage,
  onFeaturedImageChange,
  slug,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const handleFeaturedUpload = async ({ file }: any) => {
    try {
      setUploading(true);
      setUploadPercent(0);

      const key = localStorage.getItem("securityKey");

      if (!key) {
        message.error("Security key is missing. Please log in again.");
        throw new Error("Missing security key");
      }

      const uploadedUrl = await uploadImageToFirebase(
        file,
        `${key}/products/`,
        (percent: number) => {
          setUploadPercent(percent);
        }
      );

      if (uploadedUrl) {
        onFeaturedImageChange(uploadedUrl);
        message.success("Featured image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Error uploading featured image.");
    } finally {
      setUploading(false);
    }
  };

  const uploadImageToFirebase = async (
    file: File,
    filePath: string,
    onProgress: (percent: number) => void
  ): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const uniqueFileName = `${filePath}${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}-${file.name}`;

      const storageRef = ref(storage, uniqueFileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          reject("Error uploading image.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error retrieving download URL:", error);
            reject("Error retrieving download URL.");
          }
        }
      );
    });
  };

  const validateFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed!");
    }
    return isImage;
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-700">
        Feature Image
      </h3>

      {featuredImage && !uploading ? (
        <div className="mb-4">
          <Image
            src={featuredImage}
            alt="Featured"
            className="w-full h-60 rounded-lg object-cover shadow-md"
          />
        </div>
      ) : (
        <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded-lg shadow-inner mb-4 border border-dashed border-gray-300">
          <span className="text-gray-400 text-lg">No featured image selected</span>
        </div>
      )}

      <Upload
        showUploadList={false}
        beforeUpload={(file) => validateFile(file) && false}
        onChange={handleFeaturedUpload}
        className="w-full"
      >
        <Button
          icon={<PlusOutlined />}
          loading={uploading}
          type="primary"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2"
        >
          {featuredImage ? "Change Featured Image" : "Upload Featured Image"}
        </Button>
      </Upload>

      {uploading && (
        <div className="mt-6">
          <Progress
            percent={uploadPercent}
            showInfo
            strokeColor={{
              "0%": "#1890ff",
              "100%": "#87d068",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductFeatureImage;
