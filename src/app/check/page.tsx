'use client';
import { Button, Tabs } from 'antd';
import React from 'react';

const TabContent1: React.FC = () => {
  return <div>This is the content of Tab 1.</div>;
};

const TabContent2: React.FC = () => {
  return <div>This is the content of Tab 2.</div>;
};

const TabContent3: React.FC = () => {
  return <div>This is the content of Tab 3.</div>;
};

// Handle "Extra Action" click
const handleExtraActionClick = () => {
  console.log('Extra Action button clicked');
};

const operations = (
  <Button onClick={handleExtraActionClick}>Extra Action</Button>
);

const App: React.FC = () => {
  const items = [
    {
      label: 'Tab 1',
      key: '1',
      children: <TabContent1 />, // Component for Tab 1
    },
    {
      label: 'Tab 2',
      key: '2',
      children: <TabContent2 />, // Component for Tab 2
    },
    {
      label: 'Tab 3',
      key: '3',
      children: <TabContent3 />, // Component for Tab 3
    },
  ];

  return (
    <>
      <Tabs centered tabBarExtraContent={operations} items={items} />
    </>
  );
};

export default App;
