import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { OrderType } from '@/types/orderType';
import React, { useEffect, useState } from 'react';

interface CustomerCurrentOrderProps {
  customerId: string;
}

export default function CustomerCurrentOrder({ customerId }: CustomerCurrentOrderProps) {
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const data = await getAllDocsFromCollection<OrderType>(`customers/${customerId}/orders`);
        
        // Filter only "ongoing" orders
        const ongoingOrders = data.filter(order => 
          ['Pending', 'Processing', 'Confirmed'].includes(order.status)
        );

        // Sort orders by date (latest first)
        ongoingOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        setOrders(ongoingOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchCustomerOrders();
  }, [customerId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Current Orders</h3>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.id} className="border p-4 mb-2 rounded-md shadow">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Item:</strong> {order.productTitle}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      ) : (
        <p>No ongoing orders found.</p>
      )}
    </div>
  );
}
