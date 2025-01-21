"use client";

import React from "react";
import { Tabs, Card, Select, Typography } from "antd";
import EmailSettingsComponent from "./EmailSetting";
import EmailTemplate from "./EmailTemplate";
import NotificationEmailSetting from "./NotificationEmailSetting";

const { TabPane } = Tabs;
const { Title } = Typography;

export default function EmailSettings() {
  

  return (
    <div>
      <Title level={3}>Settings</Title>
      <Card>
        <Tabs defaultActiveKey="1">
          {/* Notification Tab */}
          <TabPane tab="Notification" key="1">
              <NotificationEmailSetting/>
          </TabPane>

          {/* Email Template Tab */}
          <TabPane tab="Email Template" key="2">
              <EmailTemplate/>
          </TabPane>

          {/* Email Setting Tab */}
          <TabPane tab="Email Setting" key="3">
          <EmailSettingsComponent/>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
