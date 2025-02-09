'use client';

import { Card, Collapse, Typography, Space, Tabs } from 'antd';
import { MailOutlined, PhoneOutlined, FacebookFilled, TwitterOutlined, DiscordOutlined } from '@ant-design/icons';
import TalkTo from '@/components/TawkTo/page';
import Link from 'next/link';
import TicketManager from './Ticket';

const { Panel } = Collapse;
const { Title } = Typography;
const { TabPane } = Tabs;

export default function PulseZestSupport() {
  return (
    <div className="w-full mx-auto p-4">
      <Tabs defaultActiveKey="1" centered>
        
        {/* Ticket Tab */}
        <TabPane tab="Ticket" key="1">
          <TicketManager />
        </TabPane>

        {/* Service Tab */}
        <TabPane tab="Service" key="2">
          <Card title="Our Services" bordered={false}>
            <p>We offer premium shipping and logistics services tailored to your needs.</p>
          </Card>
        </TabPane>

        {/* Billing Tab */}
        <TabPane tab="Billing" key="3">
          <Card title="Billing Information" bordered={false}>
            <p>View and manage your invoices, payments, and subscriptions.</p>
          </Card>
        </TabPane>

        {/* Contact & Support Tab */}
        <TabPane tab="Contact & Support" key="4">
          <Card title="PulseZest Support" bordered={false}>
            <Title level={3}>We are here to help you!</Title>
            <p>Take a look at the bottom right! You can start chatting right now.</p>
          </Card>
          <Card title="Contact Information" bordered={false}>
            <Space direction="vertical">
              <Space>
                <PhoneOutlined />
                <span>+91 6396219233</span>
              </Space>
              <Space>
                <MailOutlined />
                <span>support@pulsezest.com</span>
              </Space>
            </Space>
          </Card>
          <TalkTo />
        </TabPane>

        {/* FAQ Tab */}
        <TabPane tab="FAQ" key="5">
          <Card title="Frequently Asked Questions" bordered={false}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="How can I reset my password?" key="1">
                <p>To reset your password, click on the 'Forgot Password' link on the login page.</p>
              </Panel>
              <Panel header="How do I change my email address?" key="2">
                <p>Go to your account settings and you will find an option to change your email address.</p>
              </Panel>
              <Panel header="Where can I find my order history?" key="3">
                <p>You can find your order history in the 'Orders' section of your profile.</p>
              </Panel>
            </Collapse>
          </Card>
        </TabPane>
      </Tabs>

      {/* Social Links */}
      <Card bordered={false} className="mt-6">
        <Space size="large">
          <Link href="https://www.facebook.com/pulsezest" target="_blank" rel="noopener noreferrer">
            <FacebookFilled className="text-2xl" />
          </Link>
          <Link href="https://twitter.com/pulsezest" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="text-2xl" />
          </Link>
          <Link href="https://discord.gg/aHjdrJZap9" target="_blank" rel="noopener noreferrer">
            <DiscordOutlined className="text-2xl" />
          </Link>
        </Space>
      </Card>
    </div>
  );
}
