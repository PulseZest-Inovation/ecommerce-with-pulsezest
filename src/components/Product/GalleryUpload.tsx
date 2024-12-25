import React, { useState } from "react";
import { Upload, Button, message, Progress, Modal } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { storage } from "@/utils/firbeaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firbeaseConfig";

interface GalleryUploadProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleGalleryUpload = async ({ fileList }: any) => {
    const newGalleryImages: string[] = [...galleryImages];

    setUploading(true);
    setUploadingFiles(fileList);
    setUploadProgress({});

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        message.error("Only image files are allowed!");
        continue;
      }

      const fileExists = newGalleryImages.some((image) => image.includes(file.name));
      if (fileExists) {
        message.warning(`Image ${file.name} is already uploaded.`);
        continue;
      }

      try {
        const uploadedUrl = await uploadImageToFirebase(file.originFileObj, `products/${slug}/galleryImages`, (percent: number) => {
          setUploadProgress((prev) => ({ ...prev, [file.uid]: percent }));
        });
        if (uploadedUrl) {
          newGalleryImages.push(uploadedUrl);
        }
      } catch {
        message.error(`Failed to upload ${file.name}`);
      }
    }

    onGalleryChange(newGalleryImages);
    message.success("Gallery updated successfully!");
    setUploading(false);
    setUploadingFiles([]);
  };

  const uploadImageToFirebase = async (file: File, filePath: string, onProgress: (percent: number) => void): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        reject,
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch {
            reject();
          }
        }
      );
    });
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      const imageRef = ref(storage, imageUrl);
  
      // Attempt to delete the image from Firebase Storage
      await deleteObject(imageRef);
  
      // Log a success message if the storage deletion succeeds
      console.log("Image deleted from Firebase Storage");
    } catch (error) {
      // Log a warning message if the storage deletion fails
      console.warn("Failed to delete image from Firebase Storage:", error);
    }
  
    try {
      // Remove the image from the local state
      const updatedGalleryImages = galleryImages.filter((image) => image !== imageUrl);
      onGalleryChange(updatedGalleryImages);
  
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) {
        message.error("Security key not found.");
        return;
      }
  
      // Update the Firestore collection
      const productRef = doc(db, "app_name", appKey, "products", slug);
      const productSnap = await getDoc(productRef);
  
      if (productSnap.exists()) {
        const productData = productSnap.data();
        const updatedFirestoreImages = (productData.galleryImages || []).filter((image: string) => image !== imageUrl);
        await updateDoc(productRef, { galleryImages: updatedFirestoreImages });
        message.success("Image deleted from the gallery.");
      } else {
        message.error("Product not found.");
      }
    } catch (error) {
      // Log an error message if the Firestore update fails
      console.error("Failed to update Firestore:", error);
      message.error("Failed to delete image from the gallery.");
    }
  };
    

  return (
    <div className="gallery-upload">
      <Upload
        listType="picture-card"
        multiple
        beforeUpload={() => false}
        onChange={handleGalleryUpload}
        className="mb-4"
      >
        <div>
          <PlusOutlined />
          <div>{galleryImages.length ? "Add More Images" : "Add Images to Gallery"}</div>
        </div>
      </Upload>

      {uploading && (
        <div>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="mb-4">
              <Progress percent={uploadProgress[file.uid] || 0} />
              <div>{file.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="gallery-images grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Gallery ${index}`}
              className="w-full h-24 object-cover rounded-md shadow-md"
            />
            <div className="absolute inset-0 flex items-center justify-around bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <EyeOutlined className="text-white text-lg" onClick={() => handlePreview(image)} />
              <DeleteOutlined className="text-red-500 text-lg" onClick={() => handleDelete(image)} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img src={previewImage} alt="Preview" className="w-full rounded-md" />
      </Modal>
    </div>
  );
};

export default GalleryUpload;
