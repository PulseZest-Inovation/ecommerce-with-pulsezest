'use client';
import React, { useState } from "react";
import { Button, Image, message, Modal, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData"; // adjust path

type GalleryDoc = {
  id: string;
  imageUrl: string;
  createdAt: any;
};

interface FeaturedImageUploadProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  slug: string;
}

const ProductFeatureImage: React.FC<FeaturedImageUploadProps> = ({
  featuredImage,
  onFeaturedImageChange,
}) => {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryDoc[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const openGallery = async () => {
    setGalleryVisible(true);
    setLoadingGallery(true);

    try {
      const data = await getAllDocsFromCollection<GalleryDoc>("gallery");
      setGalleryImages(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      message.error("Failed to load gallery");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleSelectImage = (url: string) => {
    onFeaturedImageChange(url);
    setGalleryVisible(false);
    message.success("✅ Featured image updated!");
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-700">
        Feature Image
      </h3>

      {/* Featured Image Display */}
      {featuredImage ? (
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

      {/* Add / Change Button */}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2"
        onClick={openGallery}
      >
        {featuredImage ? "Change Featured Image" : "Add Featured Image"}
      </Button>

      {/* Gallery Modal */}
      <Modal
        title="Select from Gallery"
        open={galleryVisible}
        onCancel={() => setGalleryVisible(false)}
        footer={null}
        width={800}
      >
        {loadingGallery ? (
          <div className="flex justify-center items-center h-60">
            <Spin size="large" />
          </div>
        ) : galleryImages.length === 0 ? (
          <p className="text-gray-500 text-center">No images found in gallery.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                onClick={() => handleSelectImage(img.imageUrl)}
                className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <Image
                  src={img.imageUrl}
                  alt="gallery-img"
                  preview={false}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductFeatureImage;
