import { Collapse } from 'antd';
import { OrderType } from '@/types/orderType';
import React, { useEffect, useState } from 'react';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';

const { Panel } = Collapse;

interface CustomerOrderHistoryProps {
  customerId: string;
}

export default function CustomerOrderHistory({ customerId }: CustomerOrderHistoryProps) {
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await getAllDocsFromCollection<OrderType>(`customers/${customerId}/orders`);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, [customerId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Order History</h3>

      <Collapse defaultActiveKey={[]}>
        {orders.map((order) => (
          <Panel header={`Order ID: #${order.id} - ${order.status}`} key={order.id}>
            <ul>
              <li><strong>Order ID:</strong> #{order.id}</li>
              <li><strong>Item:</strong> {order.productTitle}</li>
              <li><strong>Quantity:</strong> {order.quantity}</li>
              <li><strong>Price:</strong> ₹{order.price}</li>
              <li><strong>Status:</strong> {order.status}</li>
              <li><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</li>
            </ul>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
