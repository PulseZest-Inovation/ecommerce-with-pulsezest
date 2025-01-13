import React, { useState, useEffect } from 'react';
import { Button, Input, List, notification, Upload } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { ImageCarousleType } from '@/types/themeTypes/ImageCarouselType';
import ImageCarouselPreview from './ImageCarouselPreview';

const MobileCarousel = () => {
  const [mobileImages, setMobileImages] = useState<{ imageURL: string; pageURL: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getDataByDocName('theme-settings', 'imageCarousel')) as ImageCarousleType;
        setMobileImages(data.mobileImages || []);
      } catch (error) {
        notification.error({ message: 'Error fetching mobile carousel data.' });
      }
    };

    fetchData();
  }, []);

  const saveData = async () => {
    try {
      await setDocWithCustomId('theme-settings', 'imageCarousel', {
        mobileImages,
        // Other necessary data like isEnable, etc.
      });
      notification.success({ message: 'Mobile carousel saved successfully!' });
    } catch {
      notification.error({ message: 'Failed to save mobile carousel data.' });
    }
  };

  const handleAddImage = () => {
    setMobileImages([...mobileImages, { imageURL: '', pageURL: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    setMobileImages(mobileImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: 'imageURL' | 'pageURL', value: string) => {
    const updatedImages = mobileImages.map((image, i) =>
      i === index ? { ...image, [field]: value } : image
    );
    setMobileImages(updatedImages);
  };

  const handleImageUpload = async (file: File, index: number) => {
    try {
      setIsUploading(true);
      const uploadedImageUrl = await UploadImageToFirebase(file, 'mobile-carousel-images');
      handleImageChange(index, 'imageURL', uploadedImageUrl);
      notification.success({ message: 'Image uploaded successfully!' });
    } catch {
      notification.error({ message: 'Failed to upload image.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl">Mobile Carousel Management</h2>
      <div className="flex justify-end" style={{ marginTop: '20px' }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={saveData}
          disabled={!mobileImages.length}
        >
          Save Data
        </Button>
      </div>

    

      <List
        style={{ marginTop: '20px' }}
        dataSource={mobileImages}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <MinusCircleOutlined
                onClick={() => handleRemoveImage(index)}
                style={{ color: 'red' }}
              />,
            ]}
          >
            <Input
              placeholder="Page URL"
              value={item.pageURL}
              onChange={(e) => handleImageChange(index, 'pageURL', e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <Upload
              showUploadList={false}
              customRequest={({ file }) => handleImageUpload(file as File, index)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={isUploading}>
                Upload Image
              </Button>
            </Upload>
          </List.Item>
        )}
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddImage}
        style={{ marginTop: '10px' }}
      >
        Add Image
      </Button>


        {/* Image Carousel Preview */}
        <ImageCarouselPreview
        images={mobileImages.map(image => ({ imageURL: image.imageURL, altText: image.pageURL }))}
      />
    </div>
  );
};

export default MobileCarousel;
