'use client'
import React, { useState } from "react";
import { storage } from "@/utils/firbeaseConfig"; // Firebase config file
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import { db } from "@/utils/firbeaseConfig"; // Your firestore config
import { Image, message } from "antd"; // Ant Design message component

interface GalleryUploadProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]); // Track files being uploaded
  const [progress, setProgress] = useState<{ [key: string]: number }>({}); // Store progress per file

  // Function to upload image to Firebase and track progress
  const uploadImageToFirebase = (
    file: File,
    path: string,
    onProgress: (fileName: string, percent: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Generate a unique file name
      const uniqueFileName = `${Date.now()}-${file.name}`;
  
      const storageRef = ref(storage, `${path}/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(file.name, progressPercent); // Update progress for the specific file
        },
        (error) => {
          console.error("Upload error: ", error);
          reject("Error uploading image.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL); // Return the download URL once upload is successful
          } catch (error) {
            reject("Error retrieving download URL.");
          }
        }
      );
    });
  };
  

  // Function to delete image from Firebase storage
  const deleteImageFromFirebase = async (imageUrl: string) => {
    const storageRef = ref(storage, imageUrl);
    try {
      await deleteObject(storageRef); // Delete the image from Firebase storage
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  // Function to update Firestore collection after deleting an image
  const deleteImageFromFirestore = async (imageUrl: string) => {
    const key = localStorage.getItem("securityKey");
    if (!key) {
      message.error("No security key found.");
      return;
    }

    const docRef = doc(db, `app_name/${key}/products/${slug}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const galleryImages = data?.galleryImages || [];

      // Remove image from the array
      const updatedGalleryImages = galleryImages.filter((url: string) => url !== imageUrl);

      // Update the Firestore document with the new gallery array
      await updateDoc(docRef, {
        galleryImages: updatedGalleryImages,
      });
    } else {
      message.error("Document not found!");
    }
  };

  // Handle file selection and uploading
  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newGalleryImages: string[] = [...galleryImages];
    const filesToUpload = Array.from(fileList);

    setUploadingFiles(filesToUpload); // Set files being uploaded
    setProgress({}); // Reset previous progress

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        continue; // Skip invalid files
      }

      const key = localStorage.getItem("securityKey");
      try {
        // Upload image immediately after selection
        const uploadedUrl = await uploadImageToFirebase(
          file,
          `${key}/products/${file.name}`,
          (fileName: string, percent: number) => {
            setProgress((prevProgress) => ({
              ...prevProgress,
              [fileName]: percent, // Update progress for each file
            }));
          }
        );
        if (uploadedUrl) {
          newGalleryImages.push(uploadedUrl); // Add new image URL to gallery
        }
      } catch (error) {
        message.error("Error uploading gallery image.");
      }
    }

    onGalleryChange(newGalleryImages); // Update parent component with new gallery images
    message.success("Gallery images uploaded successfully!");
  };

  // Function to handle the image deletion
  const handleDeleteImage = async (imageUrl: string) => {
    const updatedGalleryImages = galleryImages.filter((url) => url !== imageUrl); // Remove image from array
    onGalleryChange(updatedGalleryImages); // Update parent component with updated gallery images

    // Delete the image from Firebase storage
    await deleteImageFromFirebase(imageUrl);

    // Delete the image from Firestore
    await deleteImageFromFirestore(imageUrl);

    message.success("Image deleted successfully!");
  };

  return (
    <div>
      <div>
        {/* Upload file input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryUpload}
          style={{ display: 'none' }}
          id="galleryUploadInput"
        />
        <label htmlFor="galleryUploadInput" style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'inline-block', color: 'blue'}}>
          Upload Gallery
        </label>
      </div>

      {/* Display progress bars for uploading files */}
      <div>
        {uploadingFiles.map((file, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div>{file.name}</div>
            <div style={{ width: '100%', background: '#f3f3f3', borderRadius: '5px' }}>
              <div
                style={{
                  height: '10px',
                  background: 'green',
                  width: `${progress[file.name] || 0}%`,
                  borderRadius: '5px',
                  display: progress[file.name] === 100 ? 'none' : 'block', // Hide progress bar when 100%
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Optionally display already uploaded images */}
      {galleryImages.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Uploaded Gallery Images</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {galleryImages.map((imageUrl, index) => (
              <div key={index} style={{ marginRight: '10px', marginBottom: '10px' }}>
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} // Smaller image size
                />
                <button
                  onClick={() => handleDeleteImage(imageUrl)}
                  style={{ display: 'block', marginTop: '5px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
