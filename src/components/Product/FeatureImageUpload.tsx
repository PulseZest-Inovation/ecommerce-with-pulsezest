'use client';
import React, { useState } from "react";
import { Upload, Button, message, Progress, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "@/utils/firbeaseConfig"; // Assuming Firebase configuration is already set
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface FeaturedImageUploadProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  slug: string;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({
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
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-center mb-4">Feature Image</h3>

      {featuredImage && !uploading ? (
        <div className="mb-4">
          <Image
            src={featuredImage}
            alt="Featured"
            className="w-full h-56 rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-500">No featured image selected</span>
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
          block
        >
          {featuredImage ? "Change Featured Image" : "Upload Featured Image"}
        </Button>
      </Upload>

      {uploading && (
        <div className="mt-4">
          <Progress percent={uploadPercent} showInfo />
        </div>
      )}
    </div>
  );
};

export default FeaturedImageUpload;
