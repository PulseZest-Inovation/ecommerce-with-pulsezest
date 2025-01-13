"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Switch, Typography, notification } from "antd";
import MobileCarousel from "./MobileCarousle";
import DesktopCarousel from "./DesktopCarousel";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { ImageCarousleType } from "@/types/themeTypes/ImageCarouselType"; // Ensure the proper import of the type

const { Text } = Typography;

const ImageCarousel = () => {
  const [isEnable, setIsEnable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getDataByDocName('theme-settings', 'imageCarousel')) as ImageCarousleType;
        
        // Check if 'isEnable' exists in the fetched data and if it is a boolean
        if (data && typeof data.isEnable === 'boolean') {
          setIsEnable(data.isEnable); // Set the initial value from Firestore
        }
      } catch (error) {
        notification.error({ message: 'Error fetching carousel settings.' });
      }
    };

    fetchData();
  }, []);

  const handleSwitchChange = async (checked: boolean) => {
    try {
      setIsEnable(checked); // Update state
      await setDocWithCustomId('theme-settings', 'imageCarousel', {
        isEnable: checked,
        // Retaining other existing data if needed (you can add fields here like desktopImages, mobileImages, etc.)
      });
      notification.success({ message: 'Carousel settings updated successfully!' });
    } catch (error) {
      notification.error({ message: 'Failed to update carousel settings.' });
    }
  };

  return (
    <Row gutter={24}>
      {/* Left Column - Tabs */}
      <Col xs={24} sm={16} md={16} lg={16}>
        <Tabs
          defaultActiveKey="mobile"
          tabBarExtraContent={<Switch checked={isEnable} onChange={handleSwitchChange} />}
        >
          <Tabs.TabPane tab="Mobile Image Carousel" key="mobile">
            {isEnable ? (
              <MobileCarousel />
            ) : (
              <Text type="secondary">Enable the Carousel to add the Carousel Images.</Text>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Desktop Image Carousel" key="desktop">
            {isEnable ? (
              <DesktopCarousel />
            ) : (
              <Text type="secondary">Enable the Carousel to add the Carousel Images.</Text>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Col>

      {/* Right Column - Tips/Info */}
      <Col xs={24} sm={8} md={8} lg={8}>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Tips for Image Carousel</h3>
          <Text>
            <ul>
              <li>Recommended size: 400px x 225px for mobile (16:9 aspect ratio).</li>
              <li>Recommended size: 800px x 450px for desktop (16:9 aspect ratio).</li>
              <li>Maximum file size: 2MB.</li>
              <li>Acceptable formats: JPG, PNG.</li>
            </ul>
          </Text>
        </div>
      </Col>
    </Row>
  );
};

export default ImageCarousel;
