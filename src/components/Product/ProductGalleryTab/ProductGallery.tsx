'use client'
import React, { useEffect, useState } from "react";
import { db, storage } from "@/config/firbeaseConfig";
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Modal, Spin, Image, message, Popconfirm, Pagination, Upload as AntUpload, Tooltip } from "antd";
import { UploadOutlined, PlusOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";

interface GalleryImage {
  id?: string;
  imageUrl: string;
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
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const pageSize = 16;

  // 🔹 Fetch all gallery images from Firestore
  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) throw new Error("No security key found in localStorage!");

      const colRef = collection(db, "app_name", appKey, `/gallery`);
      const q = query(colRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

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

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) throw new Error("No security key found!");

      const storageRef = ref(storage, `gallery/${appKey}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const newImage = {
        imageUrl: downloadURL,
        name: file.name,
        size: file.size,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "app_name", appKey, `/gallery`), newImage);
      const imageWithId = { ...newImage, id: docRef.id };

      setAvailableGallery([imageWithId, ...availableGallery]);
      message.success(`${file.name} uploaded successfully`);
    } catch (err) {
      console.error(err);
      message.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "Unknown Date";
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const groupedImages = availableGallery.reduce((groups: { [key: string]: GalleryImage[] }, image) => {
    const dateStr = formatDate(image.createdAt);
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(image);
    return groups;
  }, {});

  const paginatedImages = availableGallery.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 🔹 Toggle selection
  const toggleSelectImage = (image: GalleryImage) => {
    if (selectedImages.find((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  // 🔹 Delete image from selected gallery
  const handleDeleteSelected = (image: GalleryImage) => {
    const updated = galleryImages.filter((img) => img.id !== image.id);
    onGalleryChange(updated);
    setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    message.success("Image removed");
  };

  // 🔹 Delete image from Firestore gallery
  const handleDeleteFromFirestore = async (image: GalleryImage) => {
    try {
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) throw new Error("No security key found!");

      if (!image.id) throw new Error("Image ID not found!");
      await deleteDoc(doc(db, "app_name", appKey, `/gallery`, image.id));

      setAvailableGallery(availableGallery.filter((img) => img.id !== image.id));
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
      message.success("Image deleted from gallery");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete image");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Gallery</h2>
        <div className="flex gap-2">
          <AntUpload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Image
            </Button>
          </AntUpload>
          <Button type="primary" onClick={fetchGalleryImages}>
            Select from Gallery
          </Button>
        </div>
      </div>

      {/* Show selected gallery images on page */}
      {galleryImages.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mt-6 mb-4">Selected Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative">
                <Image
                  src={image.imageUrl}
                  alt={image.name}
                  style={{ width: "100%", height: "120px" }}
                  className="rounded-md object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white text-xs px-2 py-1 rounded shadow">
                  {image.name}
                </div>
                <Popconfirm
                  title="Are you sure to remove this image?"
                  onConfirm={() => handleDeleteSelected(image)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                    size="small"
                    className="absolute top-2 right-2"
                  >
                    Delete
                  </Button>
                </Popconfirm>
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
        width={800}
        onOk={() => {
          onGalleryChange([...galleryImages, ...selectedImages]);
          setShowGalleryModal(false);
          setSelectedImages([]);
        }}
      >
        {loadingGallery ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : availableGallery.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No images found in the gallery.</p>
            <AntUpload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload First Image
              </Button>
            </AntUpload>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-gray-500">{availableGallery.length} images total</span>
              <AntUpload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
              >
                <Button type="dashed" icon={<PlusOutlined />} loading={uploading}>
                  Quick Upload
                </Button>
              </AntUpload>
            </div>

            <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(80vh - 200px)', minHeight: '300px' }}>
              {Object.keys(groupedImages).map((date) => {
                const imagesInGroup = groupedImages[date].filter(img =>
                  paginatedImages.some(p => p.id === img.id)
                );

                if (imagesInGroup.length === 0) return null;

                return (
                  <div key={date} className="mb-6">
                    <h4 className="text-sm font-bold text-gray-400 mb-3 border-b pb-1">{date}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagesInGroup.map((image) => {
                        const isSelected = selectedImages.find((img) => img.id === image.id);
                        return (
                          <div
                            key={image.id}
                            className={`group relative cursor-pointer border-2 transition-all rounded-md overflow-hidden ${isSelected ? "border-blue-500 shadow-md" : "border-transparent hover:border-gray-200"}`}
                            onClick={() => toggleSelectImage(image)}
                          >
                            <img
                              src={image.imageUrl}
                              alt={image.name}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] px-1 py-0.5 truncate">
                              {image.name}
                            </div>

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2">
                              <Tooltip title="Preview">
                                <Button
                                  type="primary"
                                  shape="circle"
                                  icon={<EyeOutlined />}
                                  size="small"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImageUrl(image.imageUrl);
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title={isSelected ? "Deselect" : "Select"}>
                                <div
                                  className={`rounded-full h-6 w-6 flex items-center justify-center transition-all ${isSelected ? "bg-blue-600 border-white border" : "bg-white text-blue-600 opacity-0 group-hover:opacity-100"}`}
                                  onClick={() => toggleSelectImage(image)}
                                >
                                  {isSelected ? (
                                    <span className="text-white text-[10px] font-bold">
                                      {selectedImages.findIndex((img) => img.id === image.id) + 1}
                                    </span>
                                  ) : (
                                    <PlusOutlined style={{ fontSize: '12px' }} />
                                  )}
                                </div>
                              </Tooltip>
                            </div>

                            {/* Delete from Firestore */}
                            <Popconfirm
                              title="Delete this image from gallery?"
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                handleDeleteFromFirestore(image);
                              }}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="primary"
                                danger
                                size="small"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                style={{ height: '22px', width: '22px', padding: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                icon={<CloseOutlined style={{ fontSize: '12px' }} />}
                              />
                            </Popconfirm>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={availableGallery.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!previewImageUrl}
        footer={null}
        onCancel={() => setPreviewImageUrl(null)}
        width={300}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <img src={previewImageUrl || ""} alt="Preview" className="w-96 h-96 rounded-lg shadow-2xl" />
      </Modal>
    </div>
  );
};

export default ProductGalleryImage;
