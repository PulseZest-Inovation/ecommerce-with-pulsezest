'use client';
import React from 'react';
import { Drawer, Tabs } from 'antd';
import { CustomerType } from '@/types/Customer';
import CustomerCurrentOrder from './CurrentOrder';
import CustomerPendingOrder from './PendingOrder';
import CustomerOrderHistory from './OrderHistory';

const { TabPane } = Tabs;

interface CustomerDetailsDrawerProps {
  visible: boolean;
  onClose: () => void;
  customer: CustomerType | null;
}

const CustomerDetails: React.FC<CustomerDetailsDrawerProps> = ({ visible, onClose, customer }) => {
  return (
    <Drawer
      title="Customer Details"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={800}
    >
      {customer ? (
        <div>
          <p>
            <strong>Full Name:</strong> {customer.fullName}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {customer.address}, {customer.city}, {customer.state}, {customer.pin}
          </p>

          {/* Tabs Section */}
          <Tabs defaultActiveKey="1" centered>
            {/* Current Order Tab */}
            <TabPane tab="Current Order" key="1">
                  <CustomerCurrentOrder/>
            </TabPane>

            {/* Pending Order Tab */}
            <TabPane tab="Pending Order" key="2">
             <CustomerPendingOrder/>
            </TabPane>

            {/* Order History Tab */}
            <TabPane tab="Order History" key="3">
              <CustomerOrderHistory/>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <p>No customer selected.</p>
      )}
    </Drawer>
  );
};

export default CustomerDetails;
