import React, { useState, useEffect } from 'react';
import { Button, Input, List, notification, Upload } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { ImageCarousleType } from '@/types/themeTypes/ImageCarouselType'
import ImageCarouselPreview from './ImageCarouselPreview';

const DesktopCarousel = () => {
  const [desktopImages, setDesktopImages] = useState<{ imageURL: string; pageURL: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getDataByDocName('theme-settings', 'imageCarousel')) as ImageCarousleType;
        setDesktopImages(data.desktopImages || []);
      } catch (error) {
        notification.error({ message: 'Error fetching desktop carousel data.' });
      }
    };

    fetchData();
  }, []);

  const saveData = async () => {
    try {
      await setDocWithCustomId('theme-settings', 'imageCarousel', {
        desktopImages,
        // Other necessary data like isEnable, etc.
      });
      notification.success({ message: 'Desktop carousel saved successfully!' });
    } catch {
      notification.error({ message: 'Failed to save desktop carousel data.' });
    }
  };

  const handleAddImage = () => {
    setDesktopImages([...desktopImages, { imageURL: '', pageURL: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    setDesktopImages(desktopImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: 'imageURL' | 'pageURL', value: string) => {
    const updatedImages = desktopImages.map((image, i) =>
      i === index ? { ...image, [field]: value } : image
    );
    setDesktopImages(updatedImages);
  };

  const handleImageUpload = async (file: File, index: number) => {
    try {
      setIsUploading(true);
      const uploadedImageUrl = await UploadImageToFirebase(file, 'desktop-carousel-images');
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
      <h2 className="text-center text-2xl">Desktop Carousel Management</h2>
      <div className="flex justify-end" style={{ marginTop: '20px' }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={saveData}
          disabled={!desktopImages.length}
        >
          Save Data
        </Button>
      </div>

    

      <List
        style={{ marginTop: '20px' }}
        dataSource={desktopImages}
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
        images={desktopImages.map(image => ({ imageURL: image.imageURL, altText: image.pageURL }))}
      />
    </div>
  );
};

export default DesktopCarousel;
