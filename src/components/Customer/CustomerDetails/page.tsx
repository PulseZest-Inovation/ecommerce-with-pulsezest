'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, Tabs } from 'antd';
import { CustomerType } from '@/types/Customer';
import CustomerCurrentOrder from './CurrentOrder';
import CustomerPendingOrder from './PendingOrder';
import CustomerOrderHistory from './OrderHistory';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { OrderType } from '@/types/orderType';

const { TabPane } = Tabs;

interface CustomerDetailsDrawerProps {
  visible: boolean;
  onClose: () => void;
  customer: CustomerType | null;
}

// help fuction numeric timestamp
const getCreatedAtNumber = (order: OrderType): number => {
  if (!order.createdAt) return 0;
  if (typeof order.createdAt === 'number') return order.createdAt;
  if ((order.createdAt)) return (order.createdAt).toMillis();
  return 0;
};

const CustomerDetails: React.FC<CustomerDetailsDrawerProps> = ({ visible, onClose, customer }) => {
  // change 
  const [latestOrder, setLatestOrder ] = useState<OrderType | null>(null);  
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!customer) return;
      const allOrders = await getAllDocsFromCollection<OrderType>('orders');

      const customerOrders = allOrders.filter(o => o.customerId === customer.id);


       const latest =
        customerOrders.length > 0
          ? customerOrders.sort((a, b) => getCreatedAtNumber(b) - getCreatedAtNumber(a))[0]
          : null;

      setLatestOrder(latest || null);
    };

    fetchLatestOrder();
  }, [customer]);

  // Merge customer + latestOrder for fallback
  const displayData = {
    fullName: customer?.fullName || latestOrder?.fullName || 'Not Accepted',
    email: customer?.email || latestOrder?.email || 'Not Accepted',
    phoneNumber: customer?.phoneNumber || latestOrder?.phoneNumber || 'Not Accepted',
    address: customer?.address || latestOrder?.address || 'Not Accepted',
    city: customer?.city || latestOrder?.city || '',
    state: customer?.state || latestOrder?.state || '',
    pin: customer?.pin || latestOrder?.pinCode || ''
  };
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
            
            <strong>Full Name:</strong> {displayData.fullName}
          </p>
          <p>
            
            <strong>Email:</strong> {displayData.email}
          </p>
          <p>
           
            <strong>Phone:</strong> {displayData.phoneNumber}
          </p>
          <p>
            
            <strong>Address:</strong> {displayData.address }, {displayData.city}, {displayData.state}, {displayData.pin}
          </p>

          {/* Tabs Section */}
          <Tabs defaultActiveKey="1" centered>
            {/* Current Order Tab */}
            <TabPane tab="Current Order" key="1">
                  <CustomerCurrentOrder customerId={customer.id}/>
            </TabPane>
            {/* Pending Order Tab */}
            <TabPane tab="Pending Order" key="2">
             <CustomerPendingOrder customerId={customer.id}/>
            </TabPane>
            {/* Order History Tab */}
            <TabPane tab="Order History" key="3">
              <CustomerOrderHistory customerId={customer.id}/>
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