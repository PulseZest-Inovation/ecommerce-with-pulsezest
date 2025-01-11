'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Avatar, Input } from 'antd';
import { CustomerType } from '@/types/Customer';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import CustomerDetails from '../CustomerDetails/page';
const { Search } = Input;

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);

  // Fetch dynamic data from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const data = await getAllDocsFromCollection<CustomerType>('customers');
      setCustomers(data);
      setFilteredCustomers(data);
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  // Handle the "View Details" button click
  const handleViewDetails = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setDrawerVisible(true);
  };

  // Handle filtering the data
  const handleFilter = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(lowerCaseValue) ||
        customer.email.toLowerCase().includes(lowerCaseValue) ||
        customer.phoneNumber.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredCustomers(filtered);
  };

  // Define columns for the Ant Design table
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl: string) => (
        <Avatar
          src={typeof avatarUrl === 'string' ? avatarUrl : '/images/avtar.png'}
          alt="Avatar"
        />
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CustomerType) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>
      <div className="mb-4">
        <Search
          placeholder="Search by name, email, or phone"
          onSearch={handleFilter}
          enterButton
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id" // Use the id field as the unique key for each row
        loading={loading} // Show loading spinner while fetching data
        pagination={false} // Add pagination if needed
      />

      {/* Use the CustomerDetailsDrawer Component */}
      <CustomerDetails
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersTable;
