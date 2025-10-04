'use client';
import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/config/firbeaseConfig'; // adjust path
import { createDocWithAutoId } from '@/services/FirestoreData/postFirestoreData'; // adjust path
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData'; // adjust path
import { X } from 'lucide-react'; // icon for cross
import { Add } from '@mui/icons-material';; // icon for plus

type GalleryDoc = {
  imageUrl: string;
  name: string;
  size: number; // in bytes
  createdAt: any;
};

export default function Page() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryDoc[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch gallery from Firestore
  const fetchGallery = async () => {
    const data = await getAllDocsFromCollection<GalleryDoc>('gallery');
    setGalleryImages(data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;
    setUploading(true);

    try {
      for (const file of selectedImages) {
        const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Save image metadata in Firestore
        await createDocWithAutoId('gallery', {
          imageUrl: downloadURL,
          name: file.name,
          size: file.size, // in bytes
          createdAt: new Date(),
        });
      }
      alert('✅ Images uploaded successfully!');
      setSelectedImages([]);
      fetchGallery();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Format file size (KB / MB)
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Upload Section (Left Side) */}
      <div>
       <label
  htmlFor="imageUpload"
  className="flex items-center gap-2 cursor-pointer w-52 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  <Add className="w-4 h-4" /> {/* Plus icon */}
  Select Images
</label>
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview Grid */}
        {selectedImages.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-6">Preview</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative w-full border rounded overflow-hidden shadow"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    className="w-full h-28 object-cover"
                  />
                  {/* Cross button */}
                  <button
                    onClick={() => handleRemoveSelected(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                  <div className="p-2 text-xs text-gray-600">
                    {image.name} ({formatFileSize(image.size)})
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload to Gallery'}
            </button>
          </>
        )}
      </div>

      {/* Gallery Section (Right Side) */}
      <div>
        <h2 className="text-lg font-semibold">Gallery</h2>
        {galleryImages.length === 0 ? (
          <p className="text-gray-500 mt-2">No images in gallery.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="w-full border rounded overflow-hidden shadow cursor-pointer"
                onClick={() => setPreviewImage(img.imageUrl)}
              >
                <img
                  src={img.imageUrl}
                  alt={`gallery-${index}`}
                  className="w-full h-28 object-cover hover:scale-105 transition"
                />
                <div className="p-2 text-xs text-gray-600">
                  {img.name}  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={previewImage}
              alt="preview"
              className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
