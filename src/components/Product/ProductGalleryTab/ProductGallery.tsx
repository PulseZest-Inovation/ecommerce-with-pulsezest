'use client'
import React, { useEffect, useState } from "react";
import { db } from "@/config/firbeaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Button, Modal, Spin, Image, message } from "antd";

interface GalleryImage {
  id?: string;
  url: string;
  name: string;
  size: number;
  createdAt: any;
}

interface GalleryUploadProps {
  galleryImages: GalleryImage[];
  onGalleryChange: (newGalleryImages: GalleryImage[]) => void;
  slug: string;
}

const ProductGalleryImage: React.FC<GalleryUploadProps> = ({ galleryImages, onGalleryChange, slug }) => {
  const [availableGallery, setAvailableGallery] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);

  // 🔹 Fetch all gallery images from Firestore
  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) throw new Error("No security key found in localStorage!");

      const colRef = collection(db, "app_name", appKey, `/gallery`);
      const querySnapshot = await getDocs(colRef);

      const images: GalleryImage[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as GalleryImage),
      }));

      setAvailableGallery(images);
      setShowGalleryModal(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch gallery images");
    } finally {
      setLoadingGallery(false);
    }
  };

  // 🔹 Toggle selection
  const toggleSelectImage = (image: GalleryImage) => {
    if (selectedImages.find((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Gallery</h2>
        <Button type="default" onClick={fetchGalleryImages}>
          Select from Gallery
        </Button>
      </div>

      {/* Show selected gallery images on page */}
      {galleryImages.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mt-6 mb-4">Selected Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative">
                <Image
                  src={image.url}
                  alt={image.name}
                  style={{ width: "100%", height: "120px" }}
                  className="rounded-md object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white text-xs px-2 py-1 rounded shadow">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for selecting gallery images */}
      <Modal
        title="Select Images from Gallery"
        open={showGalleryModal}
        onCancel={() => setShowGalleryModal(false)}
        onOk={() => {
          onGalleryChange([...galleryImages, ...selectedImages]);
          setShowGalleryModal(false);
        }}
      >
        {loadingGallery ? (
          <div className="flex justify-center py-6">
            <Spin />
          </div>
        ) : availableGallery.length === 0 ? (
          <p>No images found in the gallery.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableGallery.map((image) => {
              const isSelected = selectedImages.find((img) => img.id === image.id);
              return (
                <div
                  key={image.id}
                  className={`relative cursor-pointer border ${isSelected ? "border-blue-500" : "border-transparent"} rounded-md`}
                  onClick={() => toggleSelectImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.name}
                    style={{ width: "100%", height: "120px" }}
                    className="rounded-md object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white text-xs px-2 py-1 rounded shadow">
                    {image.name}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white font-bold">
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductGalleryImage;
