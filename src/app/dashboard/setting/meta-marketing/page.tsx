"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Card, Space, message } from "antd";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import Image from "next/image";

export default function MetaMarketing() {
  const [metaApiKey, setMetaApiKey] = useState("");
  const [metaAdAccountId, setMetaAdAccountId] = useState("");
  const [metaBusinessId, setMetaBusinessId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchMetaMarketingData = async () => {
      setLoading(true);
      const data = await getDataByDocName<{
        metaApiKey: string;
        metaAdAccountId: string;
        metaBusinessId: string;
      }>("settings", "meta_marketing");

      if (data) {
        setMetaApiKey(data.metaApiKey || "");
        setMetaAdAccountId(data.metaAdAccountId || "");
        setMetaBusinessId(data.metaBusinessId || "");
      } else {
        message.info("No existing Meta Marketing data found.");
      }
      setLoading(false);
    };

    fetchMetaMarketingData();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      metaApiKey,
      metaAdAccountId,
      metaBusinessId,
    };

    setLoading(true);
    const isSaved = await setDocWithCustomId(
      "settings",
      "meta_marketing",
      payload
    );
    setLoading(false);

    if (isSaved) {
      message.success("Meta Marketing Data Saved Successfully!");
    } else {
      message.error("Failed to save Meta Marketing Data.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Card
        title="Configure your Meta Marketing settings below:"
        bordered={false}
        style={{ padding: "20px" }}
      >
        <div className=" flex justify-center items-center">
          {/* Display the Meta Marketing image */}
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2FMeta-Logo.png?alt=media&token=3c4b7b3e-6184-4ebb-a597-f9025a856d94"
            alt="Meta Marketing Logo"
            width={150}
            height={150}
            priority
          />
        </div>

        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Meta API Key */}
          <div>
            <label>Meta API Key:</label>
            <Input
              type="text"
              value={metaApiKey}
              onChange={(e) => setMetaApiKey(e.target.value)}
              placeholder="Enter your Meta API Key"
              disabled={loading}
            />
          </div>

          {/* Meta Ad Account ID */}
          <div>
            <label>Meta Ad Account ID:</label>
            <Input
              type="text"
              value={metaAdAccountId}
              onChange={(e) => setMetaAdAccountId(e.target.value)}
              placeholder="Enter your Ad Account ID"
              disabled={loading}
            />
          </div>

          {/* Meta Business ID */}
          <div>
            <label>Meta Business ID:</label>
            <Input
              type="text"
              value={metaBusinessId}
              onChange={(e) => setMetaBusinessId(e.target.value)}
              placeholder="Enter your Business ID"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
            block
            loading={loading}
          >
            Save Meta Marketing Data
          </Button>
        </Space>
      </Card>
    </div>
  );
}
