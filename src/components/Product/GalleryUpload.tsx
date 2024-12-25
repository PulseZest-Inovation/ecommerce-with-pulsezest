import React, { useState } from "react";
import { Upload, Button, message, Progress, Modal } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { storage } from "@/utils/firbeaseConfig"; // Assuming Firebase configuration is already set
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions for fetching data
import { db } from "@/utils/firbeaseConfig"; // Assuming db is your Firestore instance

interface GalleryUploadProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]); // To track individual files
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({}); // Track progress per file
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleGalleryUpload = async ({ fileList }: any) => {
    const newGalleryImages: string[] = [...galleryImages];

    setUploading(true);
    setUploadingFiles(fileList);

    // Reset progress for all files
    setUploadProgress({});

    // Loop over the selected files
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        message.error("You can only upload image files!");
        setUploading(false);
        return false; // Prevent upload
      }

      // Check if the file is already in the gallery
      const fileExists = newGalleryImages.some((image) => image.includes(file.name));
      if (fileExists) {
        message.warning(`Image ${file.name} is already uploaded.`);
        continue; // Skip this file if it already exists in the gallery
      }

      try {
        const uploadedUrl = await uploadImageToFirebase(file.originFileObj, `products/${slug}/galleryImages`, (percent: number) => {
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.uid]: percent, // Update progress for each individual file using its uid
          }));
        });

        if (uploadedUrl) {
          newGalleryImages.push(uploadedUrl);
        }
      } catch (error) {
        message.error("Error uploading gallery images.");
      }
    }

    onGalleryChange(newGalleryImages);
    message.success("Gallery images uploaded successfully!");
    setUploading(false);
    setUploadingFiles([]); // Clear uploading state
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

  // Handle image preview (view)
  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  // Handle image deletion
  const handleDelete = async (imageUrl: string) => {
    try {
      // Step 1: Delete the image from Firebase storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef); // Delete image from Firebase storage
  
      // Step 2: Remove the image URL from the local galleryImages array
      const updatedGalleryImages = galleryImages.filter((image) => image !== imageUrl);
      onGalleryChange(updatedGalleryImages); // Update the local state
  
      // Step 3: Fetch the product data by slug and update Firestore
      const appKey = localStorage.getItem('securityKey');
      if (!appKey) {
        message.error("Security key not found.");
        return;
      }
  
      const productRef = doc(db, 'app_name', appKey, "products", slug); // Adjust 'app_name' as necessary
      const productSnap = await getDoc(productRef);
  
      if (productSnap.exists()) {
        const productData = productSnap.data();
        const galleryImagesInFirestore = productData?.galleryImages || [];
  
        // Remove the image URL from galleryImages in Firestore
        const updatedGalleryImagesFirestore = galleryImagesInFirestore.filter((image: string) => image !== imageUrl);
  
        // Step 4: Update Firestore with the new galleryImages array
        await updateDoc(productRef, {
          galleryImages: updatedGalleryImagesFirestore,
        });
  
        message.success("Image deleted successfully from gallery!");
      } else {
        message.error("Product not found.");
      }
    } catch (error) {
      message.error("Error deleting image.");
      console.error(error); // Optional: Log error for debugging purposes
    }
  };

  return (
    <div>
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

      {uploading && uploadingFiles.length > 0 && (
        <div className="mb-4">
          {uploadingFiles.map((file, index) => (
            <div key={index}>
              {/* Show individual progress for each file */}
              <Progress percent={uploadProgress[file.uid] || 0} status="active" />
              <div>Uploading: {file.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="gallery-images flex">
        {galleryImages.map((imageUrl, index) => (
          <div key={index} className="gallery-image relative mb-4">
            <img
              src={imageUrl}
              alt={`Gallery Image ${index}`}
              style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: 10 }}
            />
            <div className="gallery-actions absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-all">
              <EyeOutlined
                style={{ marginBottom: 8, cursor: 'pointer' }}
                onClick={() => handlePreview(imageUrl)}
              />
              <DeleteOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => handleDelete(imageUrl)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Modal
        visible={previewOpen}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default GalleryUpload;
