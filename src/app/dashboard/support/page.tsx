'use client'
import { Card, Collapse, Typography, Space } from 'antd';
import { MailOutlined, PhoneOutlined, FacebookFilled, TwitterOutlined, DiscordOutlined} from '@ant-design/icons';
import TalkTo from '@/components/TawkTo/page'
import Link from 'next/link';

const { Panel } = Collapse;
const { Title } = Typography;

export default function PulseZestSupport() {
 
  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <Card title="PulseZest Support" bordered={false} style={{ marginBottom: '20px' }}>
        <Title level={3}>We are here to help you!</Title>
        <p>Take a Look at the Right Bottom ! You can start Chat Right Now.</p>
      </Card>

      {/* Contact Information Section */}
      <Card title="Contact Information" bordered={false} style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
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

      {/* FAQs Section */}
      <Card title="Frequently Asked Questions" bordered={false} style={{ marginBottom: '20px' }}>
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
 

      {/* Social Links Section */}
      <Card bordered={false}>
        <Space size="large">
          <Link href="https://www.facebook.com/pulsezest" target="_blank" rel="noopener noreferrer">
            <FacebookFilled style={{ fontSize: '24px' }} />
          </Link>
          <Link href="https://twitter.com/pulsezest" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined style={{ fontSize: '24px' }} />
          </Link>
          <Link href="https://discord.gg/aHjdrJZap9" target="_blank" rel="noopener noreferrer">
            <DiscordOutlined style={{ fontSize: '24px' }} />
          </Link>
        </Space>
      </Card>
      <TalkTo/>
    </div>
  );
}
