'use client';

import { List, Button, Modal, Input, Upload, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { updateDocWithCustomId } from '@/services/FirestoreData/updateFirestoreData';

interface Testimonial {
  id: string;
  text: string;
  name: string;
  imageUrls?: string[];
}

interface TestimonialListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
}

const TestimonialList: React.FC<TestimonialListProps> = ({ testimonials, onEdit, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  const handleEditClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setNewImagePreview(null); // Reset new image preview when editing starts
    setIsModalVisible(true);
  };

  const handleImageChange = (file: any) => {
    const selectedImage = file.file;
    setNewImage(selectedImage);
    setNewImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleDeleteImage = (imageUrl: string) => {
    if (currentTestimonial) {
      const updatedImages = currentTestimonial.imageUrls?.filter(url => url !== imageUrl) || [];
      currentTestimonial.imageUrls = updatedImages;
    }
  };

  const handleModalOk = async () => {
    if (currentTestimonial) {
      if (newImage && newImagePreview) {
        currentTestimonial.imageUrls = [
          ...(currentTestimonial.imageUrls || []),
          newImagePreview,
        ];
      }

      // Update the testimonial in Firestore
      const isUpdated = await updateDocWithCustomId('testimonials', currentTestimonial.id, currentTestimonial);

      if (isUpdated) {
        onEdit(currentTestimonial); // Notify parent component of the change
      }
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h2 className='text-2xl font-bold text-center'>Testimonials</h2>
      <List
        itemLayout="horizontal"
        dataSource={testimonials}
        renderItem={(testimonial) => (
          <List.Item
            actions={[
              <Button key="edit" onClick={() => handleEditClick(testimonial)} type="link">
                Edit
              </Button>,
              <Button key="delete" onClick={() => onDelete(testimonial.id)} type="link" danger>
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              title={testimonial.name}
              description={testimonial.text}
            />
            {testimonial.imageUrls && testimonial.imageUrls.length > 0 ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                {testimonial.imageUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: '50px',
                        height: '75px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this image?"
                      onConfirm={() => handleDeleteImage(url)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        shape="circle"
                        icon={<span style={{ fontSize: '14px', color: 'red' }}>✖</span>}
                        style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          zIndex: 1,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                        }}
                      />
                    </Popconfirm>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ width: '50px', height: '75px', backgroundColor: '#f0f0f0', borderRadius: '8px' }} />
            )}
          </List.Item>
        )}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Testimonial"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        {currentTestimonial && (
          <div>
            <Input
              placeholder="Customer's Name"
              value={currentTestimonial.name}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <Input.TextArea
              value={currentTestimonial.text}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, text: e.target.value })}
              rows={4}
              placeholder="Enter testimonial"
              style={{ marginBottom: '10px' }}
            />
            <p>Current Images:</p>
            {currentTestimonial.imageUrls && currentTestimonial.imageUrls.length > 0 ? (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {currentTestimonial.imageUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`Existing Image ${index + 1}`}
                      style={{
                        width: '100px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this image?"
                      onConfirm={() => handleDeleteImage(url)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        shape="circle"
                        icon={<span style={{ fontSize: '14px', color: 'red' }}>✖</span>}
                        style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          zIndex: 1,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                        }}
                      />
                    </Popconfirm>
                  </div>
                ))}
              </div>
            ) : (
              <p>No current images</p>
            )}
            {currentTestimonial.imageUrls && currentTestimonial.imageUrls.length < 2 && (
              <div>
                <p>New Image (if selected):</p>
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    alt="New Image Preview"
                    style={{
                      width: '100px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      marginBottom: '10px',
                    }}
                  />
                )}
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  style={{ marginBottom: '10px' }}
                >
                  <Button>Select New Image</Button>
                </Upload>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TestimonialList;
