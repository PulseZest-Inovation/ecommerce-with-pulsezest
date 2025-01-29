"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Card, Space, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import Image from "next/image";

export default function ShipRocketPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch existing API user credentials when component mounts
  useEffect(() => {
    const fetchApiUserCredentials = async () => {
      const data = await getDataByDocName<{ email: string; password: string }>(
        "settings",
        "shipping"
      );
      if (data) {
        setEmail(data.email || "");
        setPassword(data.password || "");
      }
    };
    fetchApiUserCredentials();
  }, []);

  const handleSubmit = async () => {
    const success = await setDocWithCustomId("settings", "shipping", {
      email,
      password,
    });
    if (success) {
      message.success("API User Credentials Saved Successfully!");
    } else {
      message.error("Failed to save API User Credentials!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Card
        title="Enter API User Account"
        bordered={false}
        style={{ padding: "20px" }}
      >
        <div className="flex justify-center items-center">
          <Image
            alt="shiprocket"
            height={150}
            width={150}
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fshiprocket.png?alt=media&token=ce4ece46-bc64-487e-aa1f-d92810f510cd"
          />
        </div>

        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Email Input */}
          <div>
            <label>Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter API user email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label>Password:</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter API user password"
              suffix={
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
            block
          >
            Save API User Credentials
          </Button>
        </Space>
      </Card>
    </div>
  );
}
