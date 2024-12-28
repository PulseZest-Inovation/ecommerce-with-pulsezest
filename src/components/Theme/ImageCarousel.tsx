import React, { useEffect, useState } from "react";
import { ImageCarousleType } from "@/types/ImageCarouselType";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import {
  Button,
  Select,
  Switch,
  Input,
  List,
  notification,
  Upload,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { UploadImageToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";
import ImageCarouselPreview from "./ImageCarouselPreview"; // Import the ImageCarouselPreview component

type Props = {};

const ImageCarousel = (props: Props) => {
  const [carouselData, setCarouselData] = useState<ImageCarousleType | null>(
    null
  ); // State to hold the fetched data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isUploading, setIsUploading] = useState(false); // Uploading state for tracking image upload progress

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataByDocName<ImageCarousleType>(
          "theme-settings",
          "imageCarousel"
        );
        if (data) {
          setCarouselData(data);
        } else {
          setError("No data found for Image Carousel.");
        }
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to save the data back to Firestore
  const saveData = async () => {
    if (carouselData) {
      const success = await setDocWithCustomId<ImageCarousleType>(
        "theme-settings",
        "imageCarousel",
        carouselData
      );
      if (success) {
        notification.success({ message: "Theme Updated!" });
      } else {
        notification.error({ message: "Failed to save data." });
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
        images: [...carouselData.images, { imageURL: "", pageURL: "" }], // Add new empty image object
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
  const handleImageChange = (
    index: number,
    field: "imageURL" | "pageURL",
    value: string
  ) => {
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

  // Handle image upload from the gallery
  const handleImageUpload = async (file: File, index: number) => {
    try {
      setIsUploading(true); // Set uploading state to true
      const uploadedImageUrl = await UploadImageToFirebase(
        file,
        "carousel-images"
      ); // Upload image to Firebase Storage
      handleImageChange(index, "imageURL", uploadedImageUrl); // Update the image URL field in the carousel data
      setIsUploading(false); // Set uploading state to false after the upload is complete
      notification.success({ message: "Image uploaded successfully!" });
    } catch (error) {
      setIsUploading(false);
      notification.error({ message: "Failed to upload image." });
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
      <h2 className="text-center text-2xl font-sans">Image Carousel</h2>

      {carouselData && (
        <>
          {/* Save Button */}
          <div style={{ marginTop: "20px" }} className="justify-end flex">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={saveData}
              disabled={!carouselData.selectedType || !carouselData.isEnable}
            >
              Save Data
            </Button>
          </div>

          {/*Carousle Preview  */}
          {/* Image Carousel Preview */}
          <div style={{ marginTop: "20px" }}>
            <ImageCarouselPreview
              images={carouselData.images.map((image) => ({
                imageURL: image.imageURL,
                altText: image.pageURL, // You can customize how altText is displayed
              }))}
            />
          </div>

          <Row>
            <Col span={9}>
              {/* Carousle Type Selector */}
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

              {/*Switch  */}
              <div style={{ marginTop: "20px" }}>
                <h3>Enable Carousel:</h3>
                <Switch
                  checked={carouselData.isEnable}
                  onChange={handleSwitchChange}
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </div>
            </Col>
            <Col span={15}>
              {/*Add || Remove  Images */}
              <div style={{ marginTop: "20px" }}>
                <h3>Images:</h3>
                <List
                  dataSource={carouselData.images}
                  renderItem={(item, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <MinusCircleOutlined
                          onClick={() => handleRemoveImage(index)}
                          style={{ color: "red" }}
                        />,
                      ]}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Input
                          placeholder="Page URL"
                          value={item.pageURL}
                          onChange={(e) =>
                            handleImageChange(index, "pageURL", e.target.value)
                          }
                          style={{ marginRight: "10px", flex: 1 }}
                        />
                        <Upload
                          showUploadList={false}
                          customRequest={({ file }) =>
                            handleImageUpload(file as File, index)
                          } // Handle image upload
                          accept="image/*"
                        >
                          <Button
                            icon={<UploadOutlined />}
                            loading={isUploading}
                          >
                            Upload Image
                          </Button>
                        </Upload>
                      </div>
                    </List.Item>
                  )}
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddImage}
                  style={{ marginTop: "10px" }}
                >
                  Add Image
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
