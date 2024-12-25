import React, { useState } from "react";
import { Upload, Button, message, Progress } from "antd";
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

      const uploadedUrl = await uploadImageToFirebase(file, `products/${slug}/featuredImage`, (percent: number) => {
        setUploadPercent(percent);
      });

      if (uploadedUrl) {
        onFeaturedImageChange(uploadedUrl);
        message.success("Featured image uploaded successfully!");
      }
    } catch (error) {
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
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Upload error: ", error);
          reject("Error uploading image.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject("Error retrieving download URL.");
          }
        }
      );
    });
  };

  return (
    <div className="w-full p-4 border rounded-md">
      {featuredImage && !uploading ? (
        <img
          src={featuredImage}
          alt="Featured"
          className="w-full h-auto mb-4 rounded-lg object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-500">Add the Feature Image</span>
        </div>
      )}

      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFeaturedUpload}
        className="mb-4"
      >
        <Button
          icon={<PlusOutlined />}
          loading={uploading}
          type={featuredImage ? "default" : "primary"}
        >
          {featuredImage ? "Change Featured Image" : "Upload Featured Image"}
        </Button>
      </Upload>

      {uploading && <Progress percent={uploadPercent} showInfo />}
    </div>
  );
};

export default FeaturedImageUpload;
