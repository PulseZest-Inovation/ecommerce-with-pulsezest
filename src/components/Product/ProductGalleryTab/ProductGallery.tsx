'use client'
import React, { useState } from "react";
import { message, Button, Image, Progress } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

interface GalleryPickerProps {
  galleryImages: string[];
  onGalleryChange: (newGalleryImages: string[]) => void;
  slug: string;
}

const ProductGalleryImage: React.FC<GalleryPickerProps> = ({ galleryImages, onGalleryChange }) => {
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);

  // ✅ Upload multiple images from system (local preview)
  const handleUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    const uploads: { name: string; progress: number }[] = files.map((f) => ({
      name: f.name,
      progress: 100, // since local, instantly 100%
    }));
    setUploadingFiles(uploads);

    const newImageUrls = files.map((file) => URL.createObjectURL(file));

    onGalleryChange([...galleryImages, ...newImageUrls]);
    message.success(`${files.length} image(s) added!`);
  };

  // ✅ Remove image from gallery
  const handleRemoveImage = (url: string) => {
    const updatedGallery = galleryImages.filter((img) => img !== url);
    onGalleryChange(updatedGallery);
    message.success("Image removed from gallery!");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Gallery</h2>

        {/* Upload from system */}
        <label htmlFor="uploadInput">
          <Button icon={<UploadOutlined />} className="flex items-center">
            Upload Images
          </Button>
        </label>
        <input
          type="file"
          id="uploadInput"
          multiple
          accept="image/*"
          onChange={handleUploadImages}
          style={{ display: "none" }}
        />
      </div>

      {/* Progress for uploads */}
      {uploadingFiles.length > 0 && (
        <div className="mb-4">
          {uploadingFiles.map((file, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-sm">{file.name}</div>
              <Progress percent={Math.round(file.progress)} size="small" />
            </div>
          ))}
        </div>
      )}

      {galleryImages.length > 0 ? (
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
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-white rounded-full shadow-md"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No images yet. Click "Upload Images".</p>
      )}
    </div>
  );
};

export default ProductGalleryImage;
