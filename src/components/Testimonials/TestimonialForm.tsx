'use client';

import { Input, Button, Upload, message, Image } from 'antd';
import React, { useState } from 'react';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { ApplicationConfig } from '@/utils/ApplicationConfig';

interface TestimonialFormProps {
  onSubmit: (testimonialData: { text: string; name: string; imageUrls?: string[] }) => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSubmit }) => {
  const [testimonialText, setTestimonialText] = useState('');
  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = ({ fileList }: any) => {
    if (fileList.length > 2) {
      message.error('You can only upload up to 2 images.');
      return;
    }

    const selectedFiles = fileList.map((file: any) => file.originFileObj);
    setImages(selectedFiles);

    const previews = selectedFiles.map((file: File) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async () => {
    message.loading('Adding the Testimonial');
    if (testimonialText.trim() && name.trim() && images.length === 2) {
      const imageUrls = await Promise.all(
        images.map((image) =>
          UploadImageToFirebase(image, `${ApplicationConfig.securityKey}/testimonials-images`)
        )
      );

      onSubmit({
        text: testimonialText,
        name: name,
        imageUrls: imageUrls,
      });

      setTestimonialText('');
      setName('');
      setImages([]);
      setImagePreviews([]);
      message.success('Testimonial Added');
    } else {
      message.error('Please fill all fields and upload exactly two images.');
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

      <Upload
        accept="image/*"
        multiple={true}
        beforeUpload={() => false}
        onChange={handleImageChange}
        fileList={images.map((image, index) => ({
          uid: index.toString(),
          name: image.name,
          status: 'done',
          url: imagePreviews[index],
        }))}
        style={{ marginBottom: '10px' }}
      >
        <Button>Select Images (Max: 2)</Button>
      </Upload>
  
      <Button
        onClick={handleSubmit}
        type="primary"
        style={{ marginTop: '10px' }}
        disabled={!testimonialText.trim() || !name.trim() || images.length !== 2} // Ensure exactly two images are selected
      >
        Add Testimonial
      </Button>
    </div>
  );
};

export default TestimonialForm;
