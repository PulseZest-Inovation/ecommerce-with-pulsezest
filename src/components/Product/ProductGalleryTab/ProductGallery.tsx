'use client'
import React, { useState } from "react";
import { storage } from "@/utils/firbeaseConfig"; // Firebase config file
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import { db } from "@/utils/firbeaseConfig"; // Firestore config
import { message, Progress, Button, Upload, Image } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

interface GalleryUploadProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const ProductGalleryImage: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]); // Track files being uploaded
  const [progress, setProgress] = useState<{ [key: string]: number }>({}); // Store progress per file

  const uploadImageToFirebase = (file: File, path: string, onProgress: (fileName: string, percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${path}/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(file.name, progressPercent);
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

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const filesToUpload = Array.from(fileList);
    const newGalleryImages = [...galleryImages];

    setUploadingFiles(filesToUpload);
    setProgress({});

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        continue;
      }

      const key = localStorage.getItem("securityKey");
      try {
        const uploadedUrl = await uploadImageToFirebase(
          file,
          `${key}/products/${file.name}`,
          (fileName, percent) => {
            setProgress((prevProgress) => ({ ...prevProgress, [fileName]: percent }));
          }
        );
        if (uploadedUrl) {
          newGalleryImages.push(uploadedUrl);
        }
      } catch (error) {
        message.error("Error uploading gallery image.");
      }
    }

    onGalleryChange(newGalleryImages);
    message.success("Gallery images uploaded successfully!");
  };

  const handleDeleteImage = async (imageUrl: string) => {
    const updatedGalleryImages = galleryImages.filter((url) => url !== imageUrl);
    onGalleryChange(updatedGalleryImages);
    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      message.success("Image deleted successfully!");
    } catch (error) {
      message.error("Error deleting image.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Gallery</h2>
        <label htmlFor="galleryUploadInput">
          <Button type="primary" icon={<UploadOutlined />} className="flex items-center">
            Upload Images
          </Button>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryUpload}
          id="galleryUploadInput"
          style={{ display: "none" }}
        />
        <label
  htmlFor="galleryUploadInput" // Matches input ID
  style={{
    cursor: 'pointer',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'inline-block',
    color: 'blue',
  }}
>
  Upload Gallery
</label>
      </div>

      <div>
        {uploadingFiles.map((file, index) => (
          <div key={index} className="mb-4">
            <div className="mb-1">{file.name}</div>
            <Progress percent={progress[file.name] || 0} size="small" />
          </div>
        ))}
      </div>

      {galleryImages.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mt-6 mb-4">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index}`}
                  className="rounded-md object-cover"
                  style={{ width: "100%", height: "120px" }}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteImage(imageUrl)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGalleryImage;
