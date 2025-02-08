"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Card, Space, message } from "antd";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";

export default function FacebookPixel() {
  const [pixelId, setPixelId] = useState("");

  // Fetch existing Facebook Pixel ID when component mounts
  useEffect(() => {
    const fetchPixelId = async () => {
      const data = await getDataByDocName<{ pixelId: string }>("settings", "facebook-pixel");
      if (data) {
        setPixelId(data.pixelId || "");
      }
    };
    fetchPixelId();
  }, []);

  const handleSubmit = async () => {
    const success = await setDocWithCustomId("settings", "facebook-pixel", { pixelId });
    if (success) {
      message.success("Facebook Pixel ID Saved Successfully!");
    } else {
      message.error("Failed to save Facebook Pixel ID!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Card title="Enter Facebook Pixel ID" bordered={false} style={{ padding: "20px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Pixel ID Input */}
          <div>
            <label>Facebook Pixel ID:</label>
            <Input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="Enter Facebook Pixel ID"
            />
          </div>

          {/* Submit Button */}
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: "20px" }} block>
            Save Facebook Pixel ID
          </Button>
        </Space>
      </Card>
    </div>
  );
}
