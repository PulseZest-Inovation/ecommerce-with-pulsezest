"use client";

import React from "react";
import { Card, List, Switch, Button, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function Setting() {
  const router = useRouter();

  const settings = [
    {
      title: "Payment Setting",
      description: "Configure your payment methods and gateways.",
      action: (
        <Button type="primary" onClick={() => router.push("setting/payment")}>
          Configure
        </Button>
      ),
    },
    {
      title: "Email Setting",
      description: "Set up your email notifications and templates.",
      action: (
        <Button type="primary" onClick={() => router.push("setting/email")}>
          Configure
        </Button>
      ),
    },
    {
      title: "Shipping Settings",
      description: "Set up the ShipRocket Integration.",
      action: (
        <Button type="primary" onClick={() => router.push("setting/shiprocket")}>
          Configure
        </Button>
      ),
    },
    {
      title: "Enable/Disable COD",
      description: "Allow customers to choose Cash on Delivery (COD).",
      action: <Switch defaultChecked />,
    },
    {
      title: "Meta Marketing API Key",
      description: "Provide the API key to connect with Meta's marketing tools.",
      action: (
        <Button type="primary" onClick={() => router.push("setting/meta-marketing")}>
          Setup
        </Button>
      ),
    },
    // {
    //   title: "Invoice Template",
    //   description: "Design and manage your invoice templates.",
    //   action: (
    //     <Button type="primary" onClick={() => router.push("setting/invoice")}>
    //       Edit
    //     </Button>
    //   ),
    // },
    // {
    //   title: "Store Information",
    //   description: "Update your store's name, address, and contact details.",
    //   action: (
    //     <Button type="primary" onClick={() => router.push("setting/store")}>
    //       Edit
    //     </Button>
    //   ),
    // },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>
        <SettingOutlined /> Dashboard Settings
      </Title>
      <Card style={{ marginTop: "16px" }}>
        <List
          itemLayout="horizontal"
          dataSource={settings}
          renderItem={(item) => (
            <List.Item actions={[item.action]}>
              <List.Item.Meta
                title={<Text strong>{item.title}</Text>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
