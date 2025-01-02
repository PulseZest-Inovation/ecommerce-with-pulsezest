'use client';

import { Input, Button, Upload, message, Image } from 'antd';
import React, { useState } from 'react';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { ApplicationConfig } from '@/utils/ApplicationConfig';

interface TestimonialFormProps {
  onSubmit: (testimonialData: { text: string; name: string; imageUrl?: string }) => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSubmit }) => {
  const [testimonialText, setTestimonialText] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store the image URL for preview

  const handleImageChange = (file: any) => {
    const selectedImage = file.file;
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage)); // Create a preview of the selected image
  };

  const handleSubmit = async () => {
    message.loading('Adding the Testimonial');
    if (testimonialText.trim() && name.trim()) {
      let imageUrl = '';
      if (image) {
        imageUrl = await UploadImageToFirebase(image, `${ApplicationConfig.securityKey}/testimonials-images`);
      }

      onSubmit({
        text: testimonialText,
        name: name,
        imageUrl: imageUrl,
      });

      setTestimonialText('');
      setName('');
      setImage(null);
      setImagePreview(null); // Reset the image preview
      message.success('Testimonial Added');
    } else {
      message.error('Please fill all fields and upload an image.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-3">Add Testimonial</h1>
      <Input
        placeholder="Customer's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input.TextArea
        value={testimonialText}
        onChange={(e) => setTestimonialText(e.target.value)}
        rows={4}
        placeholder="Enter testimonial"
        style={{ marginBottom: '10px' }}
      />
      <p>Recommended image size: 400px x 600px (Portrait)</p>

      {/* Image Upload Section */}
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleImageChange}
        style={{ marginBottom: '10px' }}
      >
        <Button>Select Image</Button>
      </Upload>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ marginBottom: '10px' }}>
          <Image width={100} height={150} src={imagePreview} alt="Selected Image Preview" />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        type="primary"
        style={{ marginTop: '10px' }}
        disabled={!testimonialText.trim() || !name.trim() || !imagePreview} // Disable the button until all fields are filled
      >
        Add Testimonial
      </Button>
    </div>
  );
};

export default TestimonialForm;
