'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/config/firbeaseConfig';
import {
  createDocWithAutoId,
  deleteDocById,
} from '@/services/FirestoreData/postFirestoreData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { X, Upload } from 'lucide-react';
import { Popconfirm, message, Spin, Modal, Button } from 'antd';

type GalleryDoc = {
  id?: string;
  imageUrl: string;
  name: string;
  size: number;
  createdAt: any;
};

export default function Page() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [allGalleryImages, setAllGalleryImages] = useState<GalleryDoc[]>([]);
  const [displayedImages, setDisplayedImages] = useState<GalleryDoc[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);
      const data = await getAllDocsFromCollection<GalleryDoc>('gallery');
      // Sort by createdAt descending (newest first)
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
        new Date(a.createdAt?.toDate?.() || a.createdAt).getTime()
      );
      setAllGalleryImages(sortedData);
      
      // Load first page
      setDisplayedImages(sortedData.slice(0, pageSize));
      setCurrentPage(1);
    } catch (error: any) {
      message.error('Failed to load gallery.');
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadMoreImages = useCallback(() => {
    if (loadingMore || displayedImages.length >= allGalleryImages.length) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, allGalleryImages.length);
      
      const newImages = allGalleryImages.slice(0, endIndex);
      setDisplayedImages(newImages);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 300); // Small delay for loading effect
  }, [allGalleryImages, currentPage, displayedImages.length, loadingMore, pageSize]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      message.warning('Select images first');
      return;
    }

    setUploading(true);
    try {
      for (const file of selectedImages) {
        const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await createDocWithAutoId('gallery', {
          imageUrl: downloadURL,
          name: file.name,
          size: file.size,
          createdAt: new Date(),
        });
      }
      message.success('Uploaded successfully!');
      setSelectedImages([]);
      setShowUploadModal(false);
      // Refresh gallery after upload
      await fetchGallery();
    } catch (error) {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (img: GalleryDoc) => {
    try {
      if (!img.id) return;
      await deleteDocById('gallery', img.id);
      
      // Update both allGalleryImages and displayedImages
      setAllGalleryImages(prev => prev.filter(i => i.id !== img.id));
      setDisplayedImages(prev => prev.filter(i => i.id !== img.id));
      
      message.success('Deleted');
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasMoreImages = displayedImages.length < allGalleryImages.length;

  return (
    <div className='text-center font-bold'>
      <h3>Gallery</h3>
      <div className="bg-gray-50 p-2">
        {/* Upload Button */}
        <div className="top-4 right-4 z-50 items-end flex justify-end pb-4">
          <button
            onClick={openUploadModal}
            className="h-10 w-32 mr-5 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>

        {/* Gallery */}
        <div className="pt-8">
          {loadingGallery ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : displayedImages.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🖼️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Images</h2>
              <p className="text-gray-600">Click Upload button</p>
            </div>
          ) : (
            <>
              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-9 gap-2 mb-6">
                {displayedImages.map((img, index) => (
                  <div
                    key={img.id || index}
                    className="w-40 p-2 group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer border hover:border-blue-400 relative"
                    onClick={() => setPreviewImage(img.imageUrl)}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.name}
                      className="w-40 h-48 object-cover group-hover:scale-105 transition-transform rounded-lg"
                      loading="lazy"
                    />
                    <Popconfirm 
                      title="Delete this image?" 
                      onConfirm={() => handleDeleteGalleryImage(img)}
                    >
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <X size={14} />
                      </button>
                    </Popconfirm>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreImages && (
                <div className="flex justify-center pb-8">
                  <Button
                    onClick={loadMoreImages}
                    loading={loadingMore}
                    size="large"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-2 rounded-xl font-semibold shadow-lg"
                  >
                    {loadingMore ? 'Loading...' : `Load More (${allGalleryImages.length - displayedImages.length} remaining)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal */}
        <Modal
          title="Upload Images"
          open={showUploadModal}
          onCancel={() => {
            setSelectedImages([]);
            setShowUploadModal(false);
          }}
          footer={null}
          width={500}
        >
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
            
            {selectedImages.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative border rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      <div className="p-2 text-xs">
                        <p className="truncate font-medium">{image.name}</p>
                        <p className="text-gray-500">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {uploading ? 'Uploading...' : `Upload ${selectedImages.length} images`}
                </button>
              </>
            )}
          </div>
        </Modal>

        {/* Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh] mx-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 bg-white text-black rounded-xl p-3 shadow-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
              <img
                src={previewImage}
                className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
                alt="Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
