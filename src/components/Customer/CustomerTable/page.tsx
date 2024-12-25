'use client'
import React from 'react';
import { Table, Button, Space } from 'antd';
import { Customer } from '@/types/Customer'; // Assuming you have the Customer interface
import { Timestamp } from 'firebase/firestore';

// Dummy customer data (replace with real data or API call)
const customers: Customer[] = [
  {
    id: '1', // Add the id field here
    fullName: 'John Doe',
    phone: '1234567890',
    address: '123 Main St',
    createdAt: Timestamp.now(),
    dateModified: Timestamp.now(),
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123',
    billing: {
      fullName: 'John Doe',
      company: 'Example Corp',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postCode: '10001',
      country: 'USA',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
    },
    shipping: {
      fullName: 'John Doe',
      company: 'Example Corp',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postcode: '10001',
      country: 'USA',
    },
    isPayingCustomer: true,
    avatarUrl: 'https://via.placeholder.com/150',
    metaData: [{ key: 'loyaltyPoints', value: '150' }],
  },
  {
    id: '2', // Add the id field here
    fullName: 'Jane Smith',
    phone: '0987654321',
    address: '456 Oak Ave',
    createdAt: Timestamp.now(),
    dateModified: Timestamp.now(),
    email: 'jane.smith@example.com',
    username: 'janesmith',
    password: 'password456',
    billing: {
      fullName: 'Jane Smith',
      company: 'Another Corp',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postCode: '90001',
      country: 'USA',
      email: 'janesmith@example.com',
      phone: '098-765-4321',
    },
    shipping: {
      fullName: 'Jane Smith',
      company: 'Another Corp',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postcode: '90001',
      country: 'USA',
    },
    isPayingCustomer: false,
    avatarUrl: 'https://via.placeholder.com/150',
    metaData: [{ key: 'preferredContact', value: 'email' }],
  },
];

const CustomersTable: React.FC = () => {
  // Handle the "View Profile" button click (you can replace this with routing logic if needed)
  const handleViewProfile = (customer: Customer) => {
    console.log('Viewing profile for:', customer);
    // Add navigation to the profile page or modal logic here
  };

  // Define columns for the Ant Design table
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'isPayingCustomer',
      key: 'isPayingCustomer',
      render: (text: boolean) => (text ? 'Paying' : 'Non-paying'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewProfile(record)}>
            View Profile
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id" // Use the id field as the unique key for each row
        pagination={false} // You can enable pagination if needed
      />
    </div>
  );
};

export default CustomersTable;
