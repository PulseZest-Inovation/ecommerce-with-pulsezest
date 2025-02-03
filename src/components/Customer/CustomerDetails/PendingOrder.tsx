import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { OrderType } from '@/types/orderType';
import React, { useEffect, useState } from 'react';

interface CustomerPendingOrderProps {
  customerId: string;
}

export default function CustomerPendingOrder({ customerId }: CustomerPendingOrderProps) {
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const data = await getAllDocsFromCollection<OrderType>(`customers/${customerId}/orders`);

        // Filter only "Pending" orders
        const filteredOrders = data.filter(order => order.status === 'Pending');

        // Sort by order date (latest first)
        filteredOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        setPendingOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    fetchPendingOrders();
  }, [customerId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>

      {pendingOrders.length > 0 ? (
        pendingOrders.map(order => (
          <div key={order.id} className="border p-4 mb-2 rounded-md shadow">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Item:</strong> {order.productTitle}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      ) : (
        <p>No pending orders at the moment.</p>
      )}
    </div>
  );
}
