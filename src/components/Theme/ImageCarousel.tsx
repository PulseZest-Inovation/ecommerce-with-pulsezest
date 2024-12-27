import React, { useEffect, useState } from 'react';
import { ImageCarousleType } from '@/types/ImageCarouselType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { Button, Select, Switch, Input, List, notification } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

type Props = {};

const ImageCarousel = (props: Props) => {
  const [carouselData, setCarouselData] = useState<ImageCarousleType | null>(null); // State to hold the fetched data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataByDocName<ImageCarousleType>('theme-settings', 'imageCarousel');
        if (data) {
          setCarouselData(data);
        } else {
          setError('No data found for Image Carousel.');
        }
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to save the data back to Firestore
  const saveData = async () => {
    if (carouselData) {
      const success = await setDocWithCustomId<ImageCarousleType>('theme-settings', 'imageCarousel', carouselData);
      if (success) {
        notification.success({ message: 'Data saved successfully!' });
      } else {
        notification.error({ message: 'Failed to save data.' });
      }
    }
  };

  // Handle carousel type change
  const handleCarouselTypeChange = (value: string) => {
    if (carouselData) {
      setCarouselData({
        ...carouselData,
        selectedType: value, // Update the selected type
      });
    }
  };

  // Handle switch toggle for enabling/disabling the carousel
  const handleSwitchChange = (checked: boolean) => {
    if (carouselData) {
      setCarouselData({
        ...carouselData,
        isEnable: checked, // Set isEnable to true/false based on switch state
      });
    }
  };

  // Handle adding a new image to the carousel
  const handleAddImage = () => {
    if (carouselData) {
      setCarouselData({
        ...carouselData,
        images: [...carouselData.images, { imageURL: '', pageURL: '' }],
      });
    }
  };

  // Handle removing an image from the carousel
  const handleRemoveImage = (index: number) => {
    if (carouselData) {
      const updatedImages = carouselData.images.filter((_, i) => i !== index);
      setCarouselData({
        ...carouselData,
        images: updatedImages,
      });
    }
  };

  // Handle input change for image URL or page URL
  const handleImageChange = (index: number, field: 'imageURL' | 'pageURL', value: string) => {
    if (carouselData) {
      const updatedImages = carouselData.images.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      );
      setCarouselData({
        ...carouselData,
        images: updatedImages,
      });
    }
  };

  // Render loading, error, or content based on the data state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Image Carousel</h2>
      {carouselData && (
        <>
          <div>
            <h3>Carousel Type: </h3>
            <Select
              value={carouselData.selectedType}
              onChange={handleCarouselTypeChange}
              style={{ width: 200 }}
            >
              {carouselData.carouselType.map((type, index) => (
                <Select.Option key={index} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Enable Carousel:</h3>
            <Switch
              checked={carouselData.isEnable}
              onChange={handleSwitchChange}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Images:</h3>
            <List
              dataSource={carouselData.images}
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                      placeholder="Image URL"
                      value={item.imageURL}
                      onChange={(e) => handleImageChange(index, 'imageURL', e.target.value)}
                      style={{ marginRight: '10px', flex: 1 }}
                    />
                    <Input
                      placeholder="Page URL"
                      value={item.pageURL}
                      onChange={(e) => handleImageChange(index, 'pageURL', e.target.value)}
                      style={{ marginRight: '10px', flex: 1 }}
                    />
                  </div>
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
          </div>

          <div style={{ marginTop: '20px' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={saveData}
              disabled={!carouselData.selectedType || !carouselData.isEnable}
            >
              Save Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
