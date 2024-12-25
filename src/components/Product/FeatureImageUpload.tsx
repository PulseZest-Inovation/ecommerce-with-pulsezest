import React, { useState } from "react";
import { Upload, Button, message, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "@/utils/firbeaseConfig";  // Assuming Firebase configuration is already set
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface FeaturedImageUploadProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  slug: string;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({ featuredImage, onFeaturedImageChange, slug }) => {
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

  // UploadImageToFirebase function directly written here
  const uploadImageToFirebase = async (file: File, filePath: string, onProgress: (percent: number) => void): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress); // Pass progress to the parent component
        },
        (error) => {
          // Handle errors
          console.error("Upload error: ", error);
          reject("Error uploading image.");
        },
        async () => {
          // Handle successful upload
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
    <div>
      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFeaturedUpload}
        className="mb-4"
      >
        <Button icon={<PlusOutlined />} loading={uploading}>Upload Featured Image</Button>
      </Upload>
      
      {uploading && <Progress percent={uploadPercent} showInfo={true} />}
      
      {featuredImage && !uploading && <img src={featuredImage} alt="Featured" className="w-full mb-4" />}
    </div>
  );
};

export default FeaturedImageUpload;
